// app/api/admin/appointments/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const from   = searchParams.get("from")
        const to     = searchParams.get("to")
        const status = searchParams.get("status")
        const limit  = Math.min(Number(searchParams.get("limit") ?? 100), 500)
        const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0)

        // filtre dynamique
        const conditions: string[] = []
        if (from)  conditions.push(`a.starts_at >= ${sql`${from}T00:00:00`}::timestamptz`)
        if (to)    conditions.push(`a.starts_at <  ${sql`${to}T00:00:00`}::timestamptz`)
        if (status) conditions.push(sql`a.status = ${status}`.toString())

        const whereSQL = conditions.length ? sql.unsafe(`WHERE ${conditions.join(" AND ")}`) : sql.unsafe("")

        const rows = await sql/* sql */`
      SELECT
        a.id,
        a.coach_id       AS "coachId",
        co.first_name    AS "coachFirstName",
        co.last_name     AS "coachLastName",
        a.service_id     AS "serviceId",
        s.name           AS "serviceName",
        s.price          AS "servicePrice",
        a.starts_at      AS "startsAt",
        a.ends_at        AS "endsAt",
        a.status         AS "status"
      FROM public.appointments a
      JOIN public.coaches  co ON co.id = a.coach_id
      JOIN public.services s  ON s.id = a.service_id
      ${whereSQL}
      ORDER BY a.starts_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `
        return NextResponse.json(rows)
    } catch (error) {
        console.error("[ADMIN/APPTS] GET error:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération des rendez-vous" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { coachId, serviceId, startsAt, endsAt, status = "scheduled" } = body ?? {}

        if (!coachId || !serviceId || !startsAt) {
            return NextResponse.json({ error: "coachId, serviceId, startsAt requis" }, { status: 400 })
        }

        const inserted = await sql/* sql */`
      INSERT INTO public.appointments (coach_id, service_id, starts_at, ends_at, status)
      VALUES (
        ${Number(coachId)},
        ${Number(serviceId)},
        ${String(startsAt)}::timestamptz,
        COALESCE(${endsAt ? String(endsAt) : null}::timestamptz, ${String(startsAt)}::timestamptz + make_interval(mins => 60)),
        ${String(status)}
      )
      RETURNING id
    `
        return NextResponse.json(inserted[0], { status: 201 })
    } catch (error) {
        console.error("[ADMIN/APPTS] POST error:", error)
        return NextResponse.json({ error: "Erreur lors de la création du rendez-vous" }, { status: 500 })
    }
}