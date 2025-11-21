// app/api/booking/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { sendMail } from "@/lib/mailer"
import { serviceEmailMessages } from "@/lib/service-message"
import { BUFFER_MINUTES, nn, must, type EmailSupplement } from "@/lib/booking/utils"
import { renderBookingEmail, renderCustomerBookingEmail} from "@/lib/booking/emails"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log("[BOOKING] payload:", body)

        const firstName = nn(body?.firstName)
        const lastName = nn(body?.lastName)
        const email = nn(body?.email)
        const phone = nn(body?.phone)
        const serviceId = body?.serviceId != null ? Number(body.serviceId) : null
        const startsAt = nn(body?.startsAt)
        const endsAt = nn(body?.endsAt)
        const notes = nn(body?.notes)

        const supplementIds: number[] = Array.isArray(body?.supplementIds)
            ? body.supplementIds.map((x: any) => Number(x)).filter(Number.isFinite)
            : []

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? null
        console.log("[BOOKING] baseUrl:", baseUrl)

        if (!firstName || !lastName || !email || !serviceId || !startsAt) {
            return NextResponse.json(
                { error: "firstName, lastName, email, serviceId, startsAt are required" },
                { status: 400 },
            )
        }

        const fallbackCsv = process.env.BOOKING_FALLBACK ?? ""
        const fallbackEmails = fallbackCsv.split(",").map((s) => s.trim()).filter(Boolean)

        // 1) upsert client
        const clientRows = await sql/* sql */`
            WITH upsert_client AS (
                INSERT INTO public.clients (first_name, last_name, email, phone)
                SELECT ${must(firstName, "firstName")},
                       ${must(lastName, "lastName")},
                       ${must(email, "email")},
                       ${phone ? String(phone) : null}
                WHERE NOT EXISTS (
                    SELECT 1 FROM public.clients WHERE lower(email) = lower(${must(email, "email")})
                )
                RETURNING id
            )
            SELECT id FROM upsert_client
            UNION ALL
            SELECT id FROM public.clients
            WHERE lower(email) = lower(${must(email, "email")})
            LIMIT 1;
        `
        const clientId = Number(clientRows[0].id)

        // 2) service
        const svcRows = await sql/* sql */`
            SELECT id               AS "id",
                   duration_minutes AS "durationMinutes",
                   price            AS "price",
                   is_active        AS "isActive",
                   name             AS "name"
            FROM public.services
            WHERE id = ${serviceId}::bigint
        `
        const svc = svcRows[0]
        if (!svc || !svc.isActive) {
            return NextResponse.json({ error: "Service not found or inactive" }, { status: 400 })
        }
        if (svc.durationMinutes == null) {
            return NextResponse.json({ error: "Service duration missing" }, { status: 400 })
        }

        const svcId = Number(svc.id)
        const svcDuration = Number(svc.durationMinutes)
        const fullName = `${must(firstName, "firstName")} ${must(lastName, "lastName")}`
        const startIso = must(startsAt, "startsAt")
        const endIsoOrNull = endsAt ?? null
        const emailSafe = must(email, "email")

        console.log("[BOOKING] step2 values:", {
            svcId,
            svcDuration,
            fullName,
            startIso,
            endIsoOrNull,
            emailSafe,
        })

        // supplements pour l’email
        let chosenSupps: EmailSupplement[] = []
        if (supplementIds.length > 0) {
            try {
                const suppRows = await sql/* sql */`
                    SELECT id::int, name, COALESCE(price, 0)::numeric AS price
                    FROM public.supplements
                    WHERE id = ANY(${supplementIds}::int[])
                      AND is_active = true
                    ORDER BY name;
                `
                chosenSupps = (suppRows || []).map((r: any) => ({
                    id: Number(r.id),
                    name: String(r.name),
                    price: Number(r.price),
                }))
                console.log("[BOOKING] fetched supplements for email recap", chosenSupps)
            } catch (e) {
                console.warn("[BOOKING] failed to fetch supplements for email recap", e)
            }
        }

        // 3) anti-overlap
        const overlapCheck = await sql/* sql */`
            WITH input AS (
                SELECT
                    ${svcId}::bigint AS service_id,
                    ${startIso}::timestamptz AS starts_at,
                    COALESCE(
                        ${endIsoOrNull}::timestamptz,
                        (${startIso}::timestamptz + make_interval(mins => ${svcDuration}))
                    ) + make_interval(mins => ${BUFFER_MINUTES}) AS ends_at
            )
            SELECT COUNT(*)::int AS "count"
            FROM public.appointments a
            JOIN input i ON i.service_id = a.service_id
            WHERE a.status IN ('scheduled', 'confirmed')
              AND tstzrange(a.starts_at, a.ends_at, '[)') && tstzrange(i.starts_at, i.ends_at, '[)');
        `
        if ((overlapCheck?.[0]?.count ?? 0) > 0) {
            return NextResponse.json(
                { error: "Ce créneau n'est plus disponible. Merci de choisir un autre horaire." },
                { status: 409 },
            )
        }

        // 4) INSERT request
        const requestRows = await sql/* sql */`
            INSERT INTO public.appointment_requests
                (service_id, customer_name, customer_email, customer_phone, starts_at, ends_at, status, notes)
            VALUES
                (
                    ${svcId}::bigint,
                    ${fullName},
                    ${emailSafe},
                    ${phone ? String(phone) : null}::text,
                    ${startIso}::timestamptz,
                    COALESCE(${endIsoOrNull}::timestamptz, (${startIso}::timestamptz + make_interval(mins => ${svcDuration}))),
                    'pending',
                    ${notes ? String(notes) : null}::text
                )
            RETURNING
                id,
                service_id AS "serviceId",
                starts_at  AS "startsAt",
                ends_at    AS "endsAt";
        `
        const reqRow = requestRows[0]
        const requestId = Number(reqRow.id)

        // 5) Chercher les coachs candidats (version simple)
        const candidates: Array<{ coachId: number; email: string }> = await sql/* sql */`
            SELECT
                c.id    AS "coachId",
                c.email AS email
            FROM public.coaches c
            JOIN public.coach_services cs ON cs.coach_id = c.id
            WHERE c.is_active = true
              AND cs.service_id = ${svcId}::bigint;
        `

        // 6) emails
        let queuedEmails = 0
        let emailRows: Array<{ to_email: string; subject: string; html: string }> = []

        const adminHtml = renderBookingEmail({
            brand: "movi-lab",
            fullName,
            customerEmail: emailSafe,
            customerPhone: phone ?? null,
            serviceName: svc.name,
            servicePrice: Number(svc.price),
            durationMinutes: svcDuration,
            startsAtISO: String(reqRow.startsAt),
            notes: notes ?? undefined,
            supplements: chosenSupps,
        })

        const whenFr = new Date(reqRow.startsAt).toLocaleString("fr-FR", {
            dateStyle: "full",
            timeStyle: "short",
        })
        const serviceMessage = serviceEmailMessages[svcId] ?? null

        const customerHtml = renderCustomerBookingEmail({
            brand: "movi-lab",
            fullName,
            serviceName: svc.name,
            servicePrice: Number(svc.price),
            durationMinutes: svcDuration,
            startsAtISO: String(reqRow.startsAt),
            supplements: chosenSupps,
            notes: notes ?? null,
            serviceMessage,
        })

        emailRows.push({
            to_email: emailSafe,
            subject: `movi-lab – Confirmation de votre demande de rendez-vous (${whenFr})`,
            html: customerHtml,
        })

        for (const adminTo of fallbackEmails) {
            emailRows.push({
                to_email: adminTo,
                subject:
                    Array.isArray(candidates) && candidates.length > 0
                        ? "Nouvelle demande de RDV (coachs notifiés)"
                        : "Nouvelle demande de RDV (aucun coach dispo)",
                html: adminHtml,
            })
        }

        if (Array.isArray(candidates) && candidates.length > 0) {
            if (!baseUrl) {
                return NextResponse.json(
                    { error: "Server misconfigured: NEXT_PUBLIC_APP_URL missing" },
                    { status: 500 },
                )
            }

            const coachIds = candidates.map((c) => Number(c.coachId)).filter(Number.isFinite)

            if (coachIds.length > 0) {
                const inserted = await sql/* sql */`
                    WITH to_ins AS (SELECT UNNEST(${coachIds}::bigint[]) AS coach_id),
                         ins AS (
                             INSERT INTO public.appointment_candidates (request_id, coach_id)
                             SELECT ${requestId}::bigint, t.coach_id
                             FROM to_ins t
                             ON CONFLICT (request_id, coach_id) DO NOTHING
                             RETURNING coach_id AS "coachId", decision_token AS "decisionToken"
                         ),
                         existing AS (
                             SELECT coach_id AS "coachId", decision_token AS "decisionToken"
                             FROM public.appointment_candidates
                             WHERE request_id = ${requestId}::bigint
                               AND coach_id IN (SELECT coach_id FROM to_ins)
                         )
                    SELECT "coachId", "decisionToken" FROM ins
                    UNION ALL
                    SELECT "coachId", "decisionToken" FROM existing;
                `

                const tokenByCoach: Record<number, string> = Object.fromEntries(
                    inserted.map((r: any) => [Number(r.coachId), String(r.decisionToken)]),
                )
                console.log("[BOOKING] tokenByCoach map:", tokenByCoach)

                const coachEmails = candidates
                    .filter((c) => {
                        const idNum = Number(c?.coachId)
                        const keep =
                            Number.isFinite(idNum) && !!tokenByCoach[idNum] && String(c.email || "").length > 0
                        return keep
                    })
                    .map((c) => {
                        const cid = Number(c.coachId)
                        const token = tokenByCoach[cid]
                        const acceptUrl = `${baseUrl}/api/coach/requests/decision?token=${token}&d=accept`
                        const declineUrl = `${baseUrl}/api/coach/requests/decision?token=${token}&d=decline`

                        const html = renderBookingEmail({
                            brand: "movi-lab",
                            fullName,
                            customerEmail: emailSafe,
                            customerPhone: phone ?? null,
                            serviceName: svc.name,
                            servicePrice: Number(svc.price),
                            durationMinutes: svcDuration,
                            startsAtISO: String(reqRow.startsAt),
                            acceptUrl,
                            declineUrl,
                            notes: notes ?? undefined,
                            supplements: chosenSupps,
                        })

                        return {
                            to_email: String(c.email || ""),
                            subject: "Nouvelle demande de rendez-vous",
                            html,
                        }
                    })

                emailRows.push(...coachEmails)
            }
        } else {
            console.log("[BOOKING] no candidates -> only admin notified")
        }

        if (emailRows.length > 0) {
            const toEmails = emailRows.map((e) => e.to_email)
            const subjects = emailRows.map((e) => e.subject)
            const htmls = emailRows.map((e) => e.html)

            await sql/* sql */`
                INSERT INTO public.email_outbox (to_email, subject, html)
                SELECT t.email, t.subject, t.html
                FROM UNNEST(
                    ${toEmails}::text[],
                    ${subjects}::text[],
                    ${htmls}::text[]
                ) AS t(email, subject, html)
            `
            queuedEmails = emailRows.length

            for (const e of emailRows) {
                try {
                    await sendMail(e.to_email, e.subject, e.html)
                    await sql/* sql */`
                        UPDATE public.email_outbox eo
                        SET sent_at = now()
                        FROM (
                            SELECT id
                            FROM public.email_outbox
                            WHERE to_email = ${e.to_email}
                              AND subject = ${e.subject}
                              AND sent_at IS NULL
                            ORDER BY id DESC
                            LIMIT 1
                        ) t
                        WHERE eo.id = t.id;
                    `
                } catch (err) {
                    console.error("[BOOKING] sendMail FAILED for", e.to_email, err)
                }
            }
        }

        const none = !Array.isArray(candidates) || candidates.length === 0

        return NextResponse.json(
            {
                requestId,
                clientId,
                candidates: (candidates || []).map((c) => Number(c.coachId)),
                queuedEmails,
                info: none
                    ? "Demande reçue. Aucun coach immédiatement disponible, l’équipe a été notifiée et vous recontactera."
                    : "Demande envoyée aux coachs disponibles. Vous recevrez une confirmation rapidement.",
            },
            { status: 201 },
        )
    } catch (e: any) {
        console.error("[ERROR BOOKING REQUEST]", e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}