import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)

        const from   = searchParams.get("from") || null
        const to     = searchParams.get("to")   || null
        const statusParam = (searchParams.get("status") || "").trim()
        const statuses = statusParam ? statusParam.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : []
        const includeRequests = (searchParams.get("includeRequests") ?? "1") === "1"

        const limit  = Math.min(Math.max(Number(searchParams.get("limit") ?? 100), 1), 1000)
        const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0)
        const orderDir = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "asc" : "desc"
        const orderClause = orderDir === "asc" ? sql`ASC` : sql`DESC`

        // WHERE appointments
        const whereA: any[] = []
        if (from) whereA.push(sql`a.starts_at >= ${from}::timestamptz`)
        if (to)   whereA.push(sql`a.starts_at <  ${to}::timestamptz`)
        if (statuses.length > 0) whereA.push(sql`lower(a.status) = ANY(${statuses})`)
        let whereClauseA: any = sql``
        if (whereA.length) {
            whereClauseA = sql`WHERE ${whereA[0]}`
            for (let i = 1; i < whereA.length; i++) whereClauseA = sql`${whereClauseA} AND ${whereA[i]}`
        }

        // WHERE requests
        const whereR: any[] = []
        if (from) whereR.push(sql`ar.starts_at >= ${from}::timestamptz`)
        if (to)   whereR.push(sql`ar.starts_at <  ${to}::timestamptz`)
        if (statuses.length > 0) whereR.push(sql`lower(ar.status) = ANY(${statuses})`)
        else whereR.push(sql`lower(ar.status) = 'pending'`)
        let whereClauseR: any = sql``
        if (whereR.length) {
            whereClauseR = sql`WHERE ${whereR[0]}`
            for (let i = 1; i < whereR.length; i++) whereClauseR = sql`${whereClauseR} AND ${whereR[i]}`
        }

        const rows = await sql/* sql */`
            WITH appts AS (
                SELECT
                    'appointment'::text                 AS source,
                    a.id                                AS id,
                    a.coach_id                          AS coach_id,
                    co.first_name                       AS coach_first_name,
                    co.last_name                        AS coach_last_name,
                    a.service_id                        AS service_id,
                    s.name                              AS service_name,
                    s.price                             AS service_price,
                    a.starts_at                         AS starts_at,
                    a.ends_at                           AS ends_at,
                    a.status                            AS status,
                    a.notes                             AS notes,
                    NULL::text                          AS customer_name,
                    NULL::text                          AS customer_email
                FROM public.appointments a
                         JOIN public.coaches  co ON co.id = a.coach_id
                         JOIN public.services s  ON s.id = a.service_id
                ${whereClauseA}
                ),
                reqs AS (
            SELECT
                'request'::text                     AS source,
                ar.id                               AS id,
                NULL::bigint                        AS coach_id,
                NULL::text                          AS coach_first_name,
                NULL::text                          AS coach_last_name,
                ar.service_id                       AS service_id,
                s.name                              AS service_name,
                s.price                             AS service_price,
                ar.starts_at                        AS starts_at,
                ar.ends_at                          AS ends_at,
                ar.status                           AS status,
                NULL::text                          AS notes,           -- <<<<< ICI: plus de ar.notes
                ar.customer_name                    AS customer_name,
                ar.customer_email                   AS customer_email
            FROM public.appointment_requests ar
                LEFT JOIN public.services s ON s.id = ar.service_id
                ${whereClauseR}
                )
            SELECT *
            FROM (
                     SELECT * FROM appts
                                       ${includeRequests ? sql`UNION ALL SELECT * FROM reqs` : sql``}
                 ) t
            ORDER BY t.starts_at ${orderClause}
      LIMIT ${limit} OFFSET ${offset};
        `

        const payload = rows.map((r: any) => {
            const d = r.starts_at ? new Date(r.starts_at) : null
            const ymd = d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` : ""
            const hm  = d ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""

            let firstName = ""
            let lastName  = ""
            if (r.source === "request") {
                const full = String(r.customer_name || "")
                const [f, ...rest] = full.split(" ")
                firstName = f || ""
                lastName  = rest.join(" ")
            }

            return {
                source: r.source,
                id: Number(r.id),
                date: ymd,
                time: hm,
                firstName,
                lastName,
                clientEmail: r.customer_email || "",
                serviceName: r.service_name || "",
                price: Number(r.service_price || 0),
                status: r.source === "request" ? "En attente coach" : String(r.status || ""),
                paymentStatus: r.source === "request" ? null : null,
                notes: r.notes ?? null,
                startsAt: r.starts_at,
                endsAt: r.ends_at,
            }
        })

        return NextResponse.json(payload, { status: 200 })
    } catch (error) {
        console.error("[GET APPOINTMENTS ERROR]", error)
        return NextResponse.json({ error: "Erreur lors du chargement des rendez-vous" }, { status: 500 })
    }
}