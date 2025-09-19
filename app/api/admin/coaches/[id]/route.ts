import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

function normalizeStatus(v?: string) {
    return v === "Inactif" ? "Inactif" : "Actif"
}
function normalizeLevel(v?: string) {
    return v === "Débutant" || v === "Avancé" ? v : "Intermédiaire"
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const {
        firstName, lastName, email,
        phone, city,
        status, runningExperience,
        dateOfBirth,
        serviceIds
    } = body ?? {}

    const updated = await sql/* sql */`
    UPDATE coaches SET
      first_name = COALESCE(${firstName}, first_name),
      last_name  = COALESCE(${lastName},  last_name),
      email      = COALESCE(${email},     email),
      phone      = COALESCE(${phone},     phone),
      city       = COALESCE(${city},      city),
      status     = COALESCE(${status ? normalizeStatus(status) : null}, status),
      running_experience = COALESCE(${runningExperience ? normalizeLevel(runningExperience) : null}, running_experience),
      date_of_birth = COALESCE(${dateOfBirth}, date_of_birth),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `
    if (updated.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (Array.isArray(serviceIds)) {
        await sql/* sql */`DELETE FROM coach_services WHERE coach_id = ${id}`
        if (serviceIds.length > 0) {
            await sql/* sql */`
        INSERT INTO coach_services (coach_id, service_id)
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
      c.status,
      c.running_experience AS "runningExperience",
      c.date_of_birth AS "dateOfBirth",
      c.last_appointment AS "lastAppointment",
      c.total_appointments AS "totalAppointments",
      COALESCE(
        JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', s.id, 'name', s.name, 'price', s.price, 'color', s.color, 'is_active', s.is_active)
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS services
    FROM coaches c
    LEFT JOIN coach_services cs ON cs.coach_id = c.id
    LEFT JOIN services s        ON s.id = cs.service_id
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

    await sql/* sql */`DELETE FROM coaches WHERE id = ${id}`
    return NextResponse.json({ ok: true })
}