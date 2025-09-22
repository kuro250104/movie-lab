import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

function normalizeStatus(v?: string) {
    return v === "Inactif" ? "Inactif" : "Actif"
}
function normalizeCoachType(v?: string) {
    const allowed = new Set(["Coach sportif", "Coach running", "Préparateur mental", "Autre"])
    const trimmed = String(v ?? "").trim()
    return allowed.has(trimmed) ? trimmed : "Coach sportif"
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const {
        firstName,
        lastName,
        email,
        phone,
        city,
        status,          // "Actif" | "Inactif"
        coachType,       // "Coach sportif" | "Coach running" | "Préparateur mental" | "Autre"
        dateOfBirth,
        serviceIds,
    } = body ?? {}

    // map statut -> boolean si fourni, sinon laisse tel quel
    const isActiveProvided =
        typeof status === "string" ? (normalizeStatus(status) === "Actif") : null
    const coachTypeProvided =
        typeof coachType === "string" ? normalizeCoachType(coachType) : null

    // maj coach
    const updated = await sql/* sql */`
    UPDATE public.coaches SET
      first_name      = COALESCE(${firstName}, first_name),
      last_name       = COALESCE(${lastName},  last_name),
      email           = COALESCE(${email},     email),
      phone           = COALESCE(${phone},     phone),
      city            = COALESCE(${city},      city),
      is_active       = COALESCE(${isActiveProvided}::boolean, is_active),
      coach_type      = COALESCE(${coachTypeProvided}, coach_type),
      date_of_birth   = COALESCE(${dateOfBirth}::date, date_of_birth),
      updated_at      = NOW()
    WHERE id = ${id}
    RETURNING id
  `
    if (updated.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // maj services si fourni
    if (Array.isArray(serviceIds)) {
        await sql/* sql */`DELETE FROM public.coach_services WHERE coach_id = ${id}`
        if (serviceIds.length > 0) {
            await sql/* sql */`
        INSERT INTO public.coach_services (coach_id, service_id)
        SELECT ${id}, UNNEST(${serviceIds}::int[])
        ON CONFLICT DO NOTHING
      `
        }
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
                        DISTINCT JSONB_BUILD_OBJECT(
            'id', s.id, 'name', s.name, 'price', s.price, 'color', s.color, 'is_active', s.is_active
          )
        ) FILTER (WHERE s.id IS NOT NULL),
                    '[]'
            ) AS services
        FROM public.coaches c
                 LEFT JOIN public.coach_services cs ON cs.coach_id = c.id
                 LEFT JOIN public.services s        ON s.id = cs.service_id
        WHERE c.id = ${id}
        GROUP BY c.id
    `
    return NextResponse.json(rows[0])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    await sql/* sql */`DELETE FROM public.coach_services WHERE coach_id = ${id}`
    await sql/* sql */`DELETE FROM public.coaches WHERE id = ${id}`

    return NextResponse.json({ ok: true })
}