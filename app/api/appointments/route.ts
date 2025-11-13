//
//
// // app/api/admin/appointments/route.ts
// import { NextResponse, type NextRequest } from "next/server"
// import { sql } from "@/lib/db"
// import { getAdminFromRequest } from "@/lib/auth"
//
// export const runtime = "nodejs"
//
// export async function GET(request: NextRequest) {
//     const admin = await getAdminFromRequest(request)
//     if (!admin) {
//         return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
//     }
//
//     try {
//         const { searchParams } = new URL(request.url)
//
//         const from   = searchParams.get("from") || null // "YYYY-MM-DD" ou ISO
//         const to     = searchParams.get("to")   || null
//         const statusParam = (searchParams.get("status") || "").trim()
//         const statuses = statusParam
//             ? statusParam.split(",").map(s => s.trim().toLowerCase()).filter(Boolean)
//             : [] // si vide: pas de filtre de statut
//
//         const limit  = Math.min(Math.max(Number(searchParams.get("limit") ?? 100), 1), 500)
//         const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0)
//         const orderDir = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "asc" : "desc"
//
//         // includeRequests=1 (default: 1)
//         const includeRequests = (searchParams.get("includeRequests") ?? "1") === "1"
//
//         // WHERE fragments pour appointments (alias a)
//         const whereA: any[] = []
//         if (from) whereA.push(sql`a.starts_at >= ${from}::timestamptz`)
//         if (to)   whereA.push(sql`a.starts_at <  ${to}::timestamptz`)
//         if (statuses.length > 0) whereA.push(sql`lower(a.status) = ANY(${statuses})`)
//
//         let whereClauseA: any = sql``
//         if (whereA.length > 0) {
//             whereClauseA = sql`WHERE ${whereA[0]}`
//             for (let i = 1; i < whereA.length; i++) whereClauseA = sql`${whereClauseA} AND ${whereA[i]}`
//         }
//
//         const whereR: any[] = []
//         if (from) whereR.push(sql`ar.starts_at >= ${from}::timestamptz`)
//         if (to)   whereR.push(sql`ar.starts_at <  ${to}::timestamptz`)
//         if (statuses.length > 0) whereR.push(sql`lower(ar.status) = ANY(${statuses})`)
//         if (statuses.length === 0) whereR.push(sql`lower(ar.status) = 'pending'`)
//
//         let whereClauseR: any = sql``
//         if (whereR.length > 0) {
//             whereClauseR = sql`WHERE ${whereR[0]}`
//             for (let i = 1; i < whereR.length; i++) whereClauseR = sql`${whereClauseR} AND ${whereR[i]}`
//         }
//
//         const orderClause = orderDir === "asc" ? sql`ASC` : sql`DESC`
//
//         const rows = await sql/* sql */`
//       WITH appts AS (
//         SELECT
//           'appointment'::text                 AS source,
//           a.id                                AS id,
//           a.coach_id                          AS coach_id,
//           co.client_id                       AS client,
//           a.service_id                        AS service_id,
//           s.name                              AS service_name,
//           s.price                             AS service_price,
//           a.starts_at                         AS starts_at,
//           a.ends_at                           AS ends_at,
//           a.status                            AS status,
//           -- infos client pour harmoniser avec requests
//           CONCAT_WS(' ', c.first_name, c.last_name) AS customer_name,
//           c.email                            AS customer_email,
//           -- champs bruts séparés pour mapping
//           c.first_name                       AS client_first_name,
//           c.last_name                        AS client_last_name,
//           -- champs additionnels pour compat
//           a.payment_status                   AS payment_status,
//           a.notes                             AS notes
//         FROM public.appointments a
//         JOIN public.coaches  co ON co.id = a.coach_id
//         JOIN public.services s  ON s.id = a.service_id
//         LEFT JOIN public.clients c ON c.id = a.client_id
//         ${whereClauseA}
//       ),
//       reqs AS (
//         SELECT
//           'request'::text                     AS source,
//           ar.id                               AS id,
//           NULL::bigint                        AS coach_id,
//           NULL::text                          AS coach_first_name,
//           NULL::text                          AS coach_last_name,
//           ar.service_id                       AS service_id,
//           s.name                              AS service_name,
//           s.price                             AS service_price,
//           ar.starts_at                        AS starts_at,
//           ar.ends_at                          AS ends_at,
//           ar.status                           AS status,
//           ar.customer_name                    AS customer_name,
//           ar.customer_email                   AS customer_email,
//           NULL::text                          AS client_first_name,
//           NULL::text                          AS client_last_name,
//           NULL::text                          AS payment_status,
//           NULL::text                          AS notes
//         FROM public.appointment_requests ar
//         LEFT JOIN public.services s ON s.id = ar.service_id
//         ${whereClauseR}
//       )
//       SELECT *
//       FROM (
//         SELECT * FROM appts
//         ${includeRequests ? sql`UNION ALL SELECT * FROM reqs` : sql``}
//       ) t
//       ORDER BY t.starts_at ${orderClause}
//       LIMIT ${limit} OFFSET ${offset};
//     `
//
//         const payload = rows.map((r: any) => {
//             // derive first/last from client_* when présents; sinon découper customer_name
//             let firstName = r.client_first_name || ""
//             let lastName  = r.client_last_name  || ""
//
//             if ((!firstName || !lastName) && r.customer_name) {
//                 const parts = String(r.customer_name).trim().split(/\s+/)
//                 if (!firstName && parts.length > 0) firstName = parts[0]
//                 if (!lastName && parts.length > 1)  lastName  = parts.slice(1).join(" ")
//             }
//
//             return {
//                 source: r.source,
//                 id: r.id,
//
//                 startsAt: r.starts_at,
//                 endsAt:   r.ends_at,
//
//                 serviceId: r.service_id,
//                 serviceName: r.service_name,
//                 servicePrice: r.service_price,
//
//                 coachId: r.coach_id,
//                 coachFirstName: r.coach_first_name,
//                 coachLastName: r.coach_last_name,
//
//                 firstName,
//                 lastName,
//                 clientEmail: r.customer_email || "",
//
//                 status: r.status,
//                 paymentStatus: r.payment_status ?? null,
//                 notes: r.notes ?? null,
//             }
//         })
//
//         return NextResponse.json(payload, { status: 200 })
//     } catch (error) {
//         console.error("[ADMIN/APPTS] GET error:", error)
//         return NextResponse.json({ error: "Erreur lors de la récupération des rendez-vous" }, { status: 500 })
//     }
// }
// export async function POST(request: NextRequest) {
//     const admin = await getAdminFromRequest(request)
//     if (!admin) {
//         return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
//     }
//
//     try {
//         const body = await request.json()
//         const { coachId, serviceId, startsAt, endsAt, status = "scheduled" } = body ?? {}
//
//         if (!coachId || !serviceId || !startsAt) {
//             return NextResponse.json({ error: "coachId, serviceId, startsAt requis" }, { status: 400 })
//         }
//
//         const inserted = await sql/* sql */`
//       INSERT INTO public.appointments (coach_id, service_id, starts_at, ends_at, status)
//       VALUES (
//         ${Number(coachId)},
//         ${Number(serviceId)},
//         ${String(startsAt)}::timestamptz,
//         COALESCE(${endsAt ? String(endsAt) : null}::timestamptz, ${String(startsAt)}::timestamptz + make_interval(mins => 60)),
//         ${String(status)}
//       )
//       RETURNING id
//     `
//         return NextResponse.json(inserted[0], { status: 201 })
//     } catch (error) {
//         console.error("[ADMIN/APPTS] POST error:", error)
//         return NextResponse.json({ error: "Erreur lors de la création du rendez-vous" }, { status: 500 })
//     }
// }