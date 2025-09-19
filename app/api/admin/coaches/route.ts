import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

function normalizeIsActive(v?: string) {
    // "Actif" => true, "Inactif" => false, default true
    return v === "Inactif" ? false : true
}
function normalizeLevel(v?: string) {
    return v === "Débutant" || v === "Avancé" ? v : "Intermédiaire"
}

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // On calcule lastAppointment / totalAppointments avec des sous-requêtes
    const rows = await sql/* sql */`
        SELECT
            c.id,
            c.first_name       AS "firstName",
            c.last_name        AS "lastName",
            c.email,
            c.phone,
            c.city,
            CASE WHEN c.is_active THEN 'Actif' ELSE 'Inactif' END AS "status",
            c.running_experience AS "runningExperience",
            c.date_of_birth    AS "dateOfBirth",
            -- calculs dérivés
            (
                SELECT MAX(a.starts_at)
                FROM public.appointments a
                WHERE a.coach_id = c.id
            ) AS "lastAppointment",
            (
                SELECT COUNT(*)
                FROM public.appointments a
                WHERE a.coach_id = c.id
            ) AS "totalAppointments",
            c.created_at       AS "createdAt",
            COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
            'id', s.id,
            'name', s.name,
            'price', s.price,
            'color', s.color,
            'is_active', s.is_active
          )
        ) FILTER (WHERE s.id IS NOT NULL),
                    '[]'
            ) AS services
        FROM public.coaches c
                 LEFT JOIN public.coach_services cs ON cs.coach_id = c.id
                 LEFT JOIN public.services s        ON s.id = cs.service_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
    `
    return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const {
        firstName, lastName, email,
        phone = null,
        city = null,
        status = "Actif",
        runningExperience = "Intermédiaire",
        dateOfBirth = null,     // ISO string ou null
        serviceIds = [] as number[]
    } = body ?? {}

    if (!firstName || !lastName || !email) {
        return NextResponse.json({ error: "firstName, lastName, email are required" }, { status: 400 })
    }

    // Insert : on mappe "Actif"/"Inactif" -> is_active boolean
    const isActive = normalizeIsActive(status)
    const level = normalizeLevel(runningExperience)

    const coachRows = await sql/* sql */`
    INSERT INTO public.coaches (
      first_name, last_name, email, phone, city,
      is_active, running_experience, date_of_birth
    )
    VALUES (
      ${firstName}, ${lastName}, ${email}, ${phone}, ${city},
      ${isActive}, ${level}, ${dateOfBirth}
    )
    RETURNING id
  `
    const coachId = coachRows[0].id as number

    // Affectations services
    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
        await sql/* sql */`
      INSERT INTO public.coach_services (coach_id, service_id)
      SELECT ${coachId}, UNNEST(${serviceIds}::int[])
      ON CONFLICT DO NOTHING
    `
    }

    // Retourner le coach créé avec les champs calculés + services
    const rows = await sql/* sql */`
    SELECT
      c.id,
      c.first_name AS "firstName",
      c.last_name  AS "lastName",
      c.email,
      c.phone,
      c.city,
      CASE WHEN c.is_active THEN 'Actif' ELSE 'Inactif' END AS "status",
      c.running_experience AS "runningExperience",
      c.date_of_birth AS "dateOfBirth",
      (
        SELECT MAX(a.starts_at)
        FROM public.appointments a
        WHERE a.coach_id = c.id
      ) AS "lastAppointment",
      (
        SELECT COUNT(*)
        FROM public.appointments a
        WHERE a.coach_id = c.id
      ) AS "totalAppointments",
      COALESCE(
        JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', s.id, 'name', s.name, 'price', s.price, 'color', s.color, 'is_active', s.is_active)
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS services
    FROM public.coaches c
    LEFT JOIN public.coach_services cs ON cs.coach_id = c.id
    LEFT JOIN public.services s        ON s.id = cs.service_id
    WHERE c.id = ${coachId}
    GROUP BY c.id
  `
    return NextResponse.json(rows[0], { status: 201 })
}