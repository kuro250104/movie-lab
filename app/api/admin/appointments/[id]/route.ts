// app/api/admin/appointments/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
    const id = Number(ctx.params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: "id invalide" }, { status: 400 })

    try {
        const row = (await sql/* sql */`
      SELECT
        a.id,
        a.starts_at, a.ends_at, a.status, a.payment_status, a.notes,
        s.id AS service_id, s.name AS service_name, s.price AS service_price,
        c.id AS client_id, c.first_name AS client_first_name, c.last_name AS client_last_name, c.email AS customer_email,
        co.id AS coach_id, co.first_name AS coach_first_name, co.last_name AS coach_last_name
      FROM public.appointments a
      JOIN public.services s  ON s.id = a.service_id
      JOIN public.clients  c  ON c.id = a.client_id
      LEFT JOIN public.coaches co ON co.id = a.coach_id
      WHERE a.id = ${id}
      LIMIT 1;
    `)[0]

        if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

        return NextResponse.json({
            id: row.id,
            startsAt: row.starts_at,
            endsAt:   row.ends_at,
            status: row.status,
            paymentStatus: row.payment_status ?? null,
            notes: row.notes ?? null,

            serviceId: row.service_id,
            serviceName: row.service_name,
            price: Number(row.service_price ?? 0),

            coachId: row.coach_id ?? null,
            coachFirstName: row.coach_first_name ?? "",
            coachLastName:  row.coach_last_name ?? "",

            firstName: row.client_first_name ?? "",
            lastName:  row.client_last_name ?? "",
            clientEmail: row.customer_email ?? "",
        }, { status: 200 })
    } catch (e) {
        console.error("[ADMIN/APPTS/:id] GET error:", e)
        return NextResponse.json({ error: "Erreur chargement rendez-vous" }, { status: 500 })
    }
}

type PatchBody = Partial<{
    clientId: number
    coachId: number | null
    serviceId: number
    startsAt: string
    endsAt: string | null
    status: "pending" | "scheduled" | "completed" | "canceled"
    paymentStatus: string | null
    notes: string | null
}>

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const id = Number(ctx.params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: "id invalide" }, { status: 400 })

    try {
        const body = (await request.json()) as PatchBody

        // Récup pour calculs / checks
        const cur = (await sql/* sql */`SELECT * FROM public.appointments WHERE id = ${id} LIMIT 1;`)[0]
        if (!cur) return NextResponse.json({ error: "Not found" }, { status: 404 })

        const nextCoachId   = body.coachId   ?? cur.coach_id
        const nextServiceId = body.serviceId ?? cur.service_id
        const nextStarts    = body.startsAt  ?? cur.starts_at
        const nextEnds      = body.endsAt ?? cur.ends_at

        // si on change (coach / horaires) → vérif conflit
        if (nextCoachId) {
            const conflict = await sql/* sql */`
        SELECT COUNT(*)::int AS count
        FROM public.appointments a
        WHERE a.coach_id = ${Number(nextCoachId)}
          AND a.id <> ${id}
          AND a.status IN ('scheduled','completed')
          AND tstzrange(a.starts_at, a.ends_at, '[)') &&
              tstzrange(${String(nextStarts)}::timestamptz, ${String(nextEnds)}::timestamptz, '[)');
      `
            if ((conflict?.[0]?.count ?? 0) > 0) {
                return NextResponse.json({ error: "Conflit d’horaire pour ce coach" }, { status: 409 })
            }
        }

        const updated = await sql/* sql */`
      UPDATE public.appointments
      SET
        client_id      = COALESCE(${body.clientId ?? null}, client_id),
        coach_id       = ${nextCoachId ?? null},
        service_id     = ${nextServiceId},
        starts_at      = ${String(nextStarts)}::timestamptz,
        ends_at        = ${String(nextEnds)}::timestamptz,
        status         = COALESCE(${body.status ?? null}, status),
        payment_status = ${body.paymentStatus ?? null},
        notes          = ${body.notes ?? null}
      WHERE id = ${id}
      RETURNING id;
    `

        return NextResponse.json({ id: Number(updated[0].id) }, { status: 200 })
    } catch (e) {
        console.error("[ADMIN/APPTS/:id] PATCH error:", e)
        return NextResponse.json({ error: "Erreur mise à jour rendez-vous" }, { status: 500 })
    }
}

export async function DELETE(_request: NextRequest, ctx: { params: { id: string } }) {
    const admin = await getAdminFromRequest(_request)
    if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const id = Number(ctx.params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: "id invalide" }, { status: 400 })

    try {
        await sql/* sql */`DELETE FROM public.appointments WHERE id = ${id};`
        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (e) {
        console.error("[ADMIN/APPTS/:id] DELETE error:", e)
        return NextResponse.json({ error: "Erreur suppression rendez-vous" }, { status: 500 })
    }
}