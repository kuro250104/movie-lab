// app/api/admin/appointments/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"

export const runtime = "nodejs"

function parseStatuses(q: string | null) {
    const s = (q ?? "").trim()
    return s ? s.split(",").map(v => v.trim().toLowerCase()).filter(Boolean) : []
}

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get("from")
        const to   = searchParams.get("to")
        const statuses = parseStatuses(searchParams.get("status"))
        const limit  = Math.min(Math.max(Number(searchParams.get("limit") ?? 200), 1), 1000)
        const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0)
        const order  = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "asc" : "desc"
        const includeRequests = searchParams.get("includeRequests") === "1"

        //
        // 1. Rendez-vous confirmés / planifiés
        //
        const apptWhere: any[] = []
        if (from) apptWhere.push(sql`a.starts_at >= ${from}::timestamptz`)
        if (to)   apptWhere.push(sql`a.starts_at <  ${to}::timestamptz`)
        if (statuses.length > 0) {
            apptWhere.push(sql`lower(a.status) = ANY(${statuses})`)
        }

        let apptWhereClause: any = sql``
        if (apptWhere.length > 0) {
            apptWhereClause = sql`WHERE ${apptWhere[0]}`
            for (let i = 1; i < apptWhere.length; i++) {
                apptWhereClause = sql`${apptWhereClause} AND ${apptWhere[i]}`
            }
        }

        const appts = await sql/* sql */`
      SELECT
        'appointment'::text         AS source,
        a.id                        AS id,
        a.starts_at                 AS starts_at,
        a.ends_at                   AS ends_at,
        a.status                    AS status,
        a.payment_status            AS payment_status,
        a.notes                     AS notes,
        s.id                        AS service_id,
        s.name                      AS service_name,
        s.price                     AS service_price,
        c.id                        AS client_id,
        c.first_name                AS client_first_name,
        c.last_name                 AS client_last_name,
        c.email                     AS customer_email,
        c.phone                     AS customer_phone,
        co.id                       AS coach_id,
        co.first_name               AS coach_first_name,
        co.last_name                AS coach_last_name
      FROM public.appointments a
      JOIN public.services  s  ON s.id  = a.service_id
      JOIN public.clients   c  ON c.id  = a.client_id
      LEFT JOIN public.coaches co ON co.id = a.coach_id
      ${apptWhereClause}
      ORDER BY a.starts_at ${order === "asc" ? sql`ASC` : sql`DESC`}
      LIMIT ${limit} OFFSET ${offset};
    `

        //
        // 2. Demandes de RDV (appointment_requests)
        //
        let reqs: any[] = []
        if (includeRequests) {
            const reqWhere: any[] = []
            if (from) reqWhere.push(sql`ar.starts_at >= ${from}::timestamptz`)
            if (to)   reqWhere.push(sql`ar.starts_at <  ${to}::timestamptz`)
            // on peut filtrer sur status si tu veux, mais ici on prend tout
            let reqWhereClause: any = sql``
            if (reqWhere.length > 0) {
                reqWhereClause = sql`WHERE ${reqWhere[0]}`
                for (let i = 1; i < reqWhere.length; i++) {
                    reqWhereClause = sql`${reqWhereClause} AND ${reqWhere[i]}`
                }
            }

            reqs = await sql/* sql */`
        SELECT
          'request'::text               AS source,
          ar.id                         AS id,
          ar.starts_at                  AS starts_at,
          ar.ends_at                    AS ends_at,
          ar.status                     AS status,
          ar.notes                      AS notes,
          ar.customer_name              AS customer_name,
          ar.customer_email             AS customer_email,
          ar.customer_phone             AS customer_phone,
          s.id                          AS service_id,
          s.name                        AS service_name,
          s.price                       AS service_price
        FROM public.appointment_requests ar
        JOIN public.services s ON s.id = ar.service_id
        ${reqWhereClause}
      `
        }

        //
        // 3. Normalisation
        //
        const apptPayload = appts.map((r: any) => ({
            source: r.source,                            // "appointment"
            id: r.id,
            startsAt: r.starts_at,
            endsAt:   r.ends_at,
            status: r.status,
            paymentStatus: r.payment_status ?? null,
            notes: r.notes ?? null,

            serviceId: r.service_id,
            serviceName: r.service_name,
            price: Number(r.service_price ?? 0),

            coachId: r.coach_id ?? null,
            coachFirstName: r.coach_first_name ?? "",
            coachLastName:  r.coach_last_name ?? "",

            firstName: r.client_first_name ?? "",
            lastName:  r.client_last_name ?? "",
            clientEmail: r.customer_email ?? "",
            clientPhone: r.customer_phone ?? null,       // << ajouté
        }))

        const reqPayload = reqs.map((r: any) => {
            // découpe prénom/nom si possible
            let firstName = ""
            let lastName = ""
            const full = (r.customer_name ?? "").trim()
            if (full) {
                const parts = full.split(/\s+/)
                firstName = parts[0]
                lastName  = parts.slice(1).join(" ")
            }

            return {
                source: r.source,                          // "request"
                id: r.id,
                startsAt: r.starts_at,
                endsAt:   r.ends_at,
                status: "pending",                         // ou r.status, mais ton front affiche "En attente coach"
                paymentStatus: null,
                notes: r.notes ?? null,

                serviceId: r.service_id,
                serviceName: r.service_name,
                price: Number(r.service_price ?? 0),

                coachId: null,
                coachFirstName: "",
                coachLastName:  "",

                firstName,
                lastName,
                clientEmail: r.customer_email ?? "",
                clientPhone: r.customer_phone ?? null,     // << ajouté
            }
        })

        // 4. fusion + tri côté JS pour bien mélanger RDV + demandes
        const merged = [...apptPayload, ...reqPayload].sort((a, b) => {
            const da = new Date(a.startsAt).getTime()
            const db = new Date(b.startsAt).getTime()
            if (order === "asc") return da - db
            return db - da
        })

        return NextResponse.json(merged, { status: 200 })
    } catch (e) {
        console.error("[ADMIN/APPTS] GET error:", e)
        return NextResponse.json({ error: "Erreur lors de la récupération des rendez-vous" }, { status: 500 })
    }
}

type PostBody = {
    clientId?: number
    clientEmail?: string
    clientFirstName?: string
    clientLastName?: string
    clientPhone?: string

    coachId?: number | null
    serviceId: number
    startsAt: string
    endsAt?: string | null
    status?: "pending" | "scheduled" | "completed" | "canceled"
    paymentStatus?: string | null
    notes?: string | null
}

export async function POST(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    try {
        const body = (await request.json()) as PostBody

        // 1) service
        const svc = (await sql/* sql */`
            SELECT id, duration_minutes::int AS duration, price
            FROM public.services
            WHERE id = ${Number(body.serviceId)}
                LIMIT 1;
        `)[0]
        if (!svc) return NextResponse.json({ error: "Service introuvable" }, { status: 400 })

        const startsAt = String(body.startsAt)
        const endsAt = body.endsAt ? String(body.endsAt) : null

        // 2) client
        let clientId = body.clientId ?? null
        if (!clientId) {
            const email = (body.clientEmail ?? "").trim().toLowerCase()
            const first = (body.clientFirstName ?? "").trim()
            const last  = (body.clientLastName ?? "").trim()
            const phone = (body.clientPhone ?? "").trim()

            if (!email || !first) {
                return NextResponse.json({ error: "Client incomplet : clientId ou (email + firstName) requis" }, { status: 400 })
            }

            const upsert = await sql/* sql */`
                WITH ins AS (
                INSERT INTO public.clients (first_name, last_name, email, phone)
                SELECT ${first}, ${last}, ${email}, NULLIF(${phone}, '')
                    WHERE NOT EXISTS (
            SELECT 1 FROM public.clients WHERE lower(email) = lower(${email})
                    )
                    RETURNING id
                    )
                SELECT id FROM ins
                UNION ALL
                SELECT id FROM public.clients WHERE lower(email) = lower(${email})
                    LIMIT 1;
            `
            clientId = Number(upsert?.[0]?.id ?? 0) || null
            if (!clientId) {
                return NextResponse.json({ error: "Impossible d’enregistrer le client" }, { status: 500 })
            }
        }

        // 3) end si manquant
        const endsExpr = endsAt
            ? sql`${endsAt}::timestamptz`
            : sql`${startsAt}::timestamptz + make_interval(mins => ${svc.duration})`

        // 4) conflit coach
        if (body.coachId) {
            const conflict = await sql/* sql */`
                SELECT COUNT(*)::int AS count
                FROM public.appointments a
                WHERE a.coach_id = ${Number(body.coachId)}
                  AND a.status IN ('scheduled','completed')
                  AND tstzrange(a.starts_at, a.ends_at, '[)') &&
                    tstzrange(${startsAt}::timestamptz, ${endsExpr}, '[)');
            `
            if ((conflict?.[0]?.count ?? 0) > 0) {
                return NextResponse.json({ error: "Conflit d’horaire pour ce coach" }, { status: 409 })
            }
        }

        // 5) insert
        const inserted = await sql/* sql */`
            INSERT INTO public.appointments
            (client_id, coach_id, service_id, starts_at, ends_at, status, payment_status, notes)
            VALUES
                (
                    ${clientId},
                    ${body.coachId ?? null},
                    ${Number(body.serviceId)},
                    ${startsAt}::timestamptz,
                    ${endsExpr},
                    ${String(body.status ?? "scheduled")},
                    ${body.paymentStatus ?? null},
                    ${body.notes ?? null}
                )
                RETURNING id;
        `

        return NextResponse.json({ id: Number(inserted[0].id) }, { status: 201 })
    } catch (e) {
        console.error("[ADMIN/APPTS] POST error:", e)
        return NextResponse.json({ error: "Erreur lors de la création du rendez-vous" }, { status: 500 })
    }
}