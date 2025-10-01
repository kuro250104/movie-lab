import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

function normalizeIsActive(v?: string) {
    return v === "Inactif" ? false : true
}

function normalizeCoachType(v?: string) {
    const allowed = new Set([
        "Coach sportif",
        "Coach running",
        "Préparateur mental",
        "Autre",
    ])
    if (!v) return "Coach sportif"
    const trimmed = String(v).trim()
    return allowed.has(trimmed) ? trimmed : "Coach sportif"
}

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const rows = await sql/* sql */`
        SELECT
            c.id,
            c.first_name         AS "firstName",
            c.last_name          AS "lastName",
            c.email,
            c.phone,
            c.city,
            CASE WHEN c.is_active THEN 'Actif' ELSE 'Inactif' END AS "status",
            c.coach_type         AS "coachType",
            c.date_of_birth      AS "dateOfBirth",
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
            c.created_at         AS "createdAt",
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
        coachType: coachTypeRaw,
        runningExperience, // legacy
        dateOfBirth = null,
        serviceIds = [],
    } = body ?? {}

    if (!firstName || !lastName || !email) {
        return NextResponse.json({ error: "firstName, lastName, email are required" }, { status: 400 })
    }

    const isActive  = normalizeIsActive(status)
    const coachType = normalizeCoachType(coachTypeRaw ?? runningExperience)

    // ✅ Normaliser serviceIds en nombres
    const serviceIdsNum: number[] = Array.isArray(serviceIds)
        ? serviceIds.map((v: any) => Number(v)).filter(Number.isFinite)
        : []

    const coachRows = await sql/* sql */`
    INSERT INTO public.coaches (
      first_name, last_name, email, phone, city,
      is_active, coach_type, date_of_birth
    )
    VALUES (
      ${firstName}, ${lastName}, ${email}, ${phone}, ${city},
      ${isActive}, ${coachType}, ${dateOfBirth}
    )
    RETURNING id
  `
    // ✅ id peut être string si colonne = BIGINT
    const coachId = Number(coachRows[0].id)

    if (serviceIdsNum.length > 0) {
        await sql/* sql */`
            INSERT INTO public.coach_services (coach_id, service_id)
            SELECT ${coachId}::bigint, UNNEST(${serviceIdsNum}::bigint[])
                ON CONFLICT DO NOTHING
        `
    }

    const rows = await sql/* sql */`
        SELECT
            c.id,
            c.first_name AS "firstName",
            c.last_name  AS "lastName",
            c.email,
            c.phone,
            c.city,
            CASE WHEN c.is_active THEN 'Actif' ELSE 'Inactif' END AS "status",
            c.coach_type AS "coachType",
            c.date_of_birth AS "dateOfBirth",
            (
                SELECT MAX(a.starts_at) FROM public.appointments a WHERE a.coach_id = c.id
            ) AS "lastAppointment",
            (
                SELECT COUNT(*) FROM public.appointments a WHERE a.coach_id = c.id
            ) AS "totalAppointments",
            COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
            'id', s.id, 'name', s.name, 'price', s.price, 'color', s.color, 'is_active', s.is_active
          )
        ) FILTER (WHERE s.id IS NOT NULL),
                    '[]'
            ) AS services
        FROM public.coaches c
                 LEFT JOIN public.coach_services cs ON cs.coach_id = c.id
                 LEFT JOIN public.services s        ON s.id = cs.service_id
        WHERE c.id = ${coachId}::bigint
        GROUP BY c.id
    `
    return NextResponse.json(rows[0], { status: 201 })
}