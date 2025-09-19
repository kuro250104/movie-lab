// app/api/public/booking/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { sendMail } from "@/lib/mailer"

const nn = <T>(v: T | undefined | null) => (v === undefined ? null : v)

// assert: pas undefined (et log clair si c'est le cas)
function must<T>(v: T | undefined, label: string): T {
    if (v === undefined) {
        console.error(`[BOOKING] '${label}' is undefined`)
        throw new Error(`Param '${label}' is undefined`)
    }
    return v
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log("[BOOKING] payload:", body)

        const firstName = nn(body?.firstName)
        const lastName  = nn(body?.lastName)
        const email     = nn(body?.email)
        const phone     = nn(body?.phone)
        const serviceId = nn(body?.serviceId)
        const startsAt  = nn(body?.startsAt)
        const endsAt    = nn(body?.endsAt)
        const notes     = nn(body?.notes)

        // URL publique pour les liens d'acceptation/refus
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
        console.log("[BOOKING] baseUrl:", baseUrl)

        // Validation claire
        if (!firstName || !lastName || !email || !serviceId || !startsAt) {
            return NextResponse.json(
                { error: "firstName, lastName, email, serviceId, startsAt are required" },
                { status: 400 }
            )
        }

        // 1) Upsert client
        let clientRows
        try {
            clientRows = await sql/* sql */`
                WITH upsert_client AS (
                INSERT INTO public.clients (first_name, last_name, email, phone)
                SELECT ${must(firstName, "firstName")}, ${must(lastName, "lastName")}, ${must(email, "email")}, ${nn(phone)}
                    WHERE NOT EXISTS (SELECT 1 FROM public.clients WHERE lower(email) = lower(${must(email, "email")}))
                    RETURNING id
                    )
                SELECT id FROM upsert_client
                UNION ALL
                SELECT id FROM public.clients WHERE lower(email) = lower(${must(email, "email")})
                    LIMIT 1;
            `
        } catch (e) {
            console.error("[BOOKING] SQL error at step 1 (upsert client)", e)
            throw e
        }
        const clientId = clientRows[0].id as number

        // 2) Service + infos utiles
        const svcRows = await sql/* sql */`
            SELECT
                id               AS "id",
                duration_minutes AS "durationMinutes",
                price            AS "price",
                is_active        AS "isActive",
                name             AS "name"
            FROM public.services
            WHERE id = ${must(serviceId, "serviceId")}
        `
        const svc = svcRows[0]
        if (!svc || !svc.isActive) {
            return NextResponse.json({ error: "Service not found or inactive" }, { status: 400 })
        }
        if (svc.durationMinutes == null) {
            return NextResponse.json({ error: "Service duration missing" }, { status: 400 })
        }

        const svcId        = svc.id as number
        const svcDuration  = Number(svc.durationMinutes)
        const fullName     = `${must(firstName,"firstName")} ${must(lastName,"lastName")}`
        const startIso     = must(startsAt, "startsAt")
        const endIsoOrNull = endsAt ?? null
        const emailSafe    = must(email, "email")

        console.log("[BOOKING] step2 values:", {
            svcId, svcDuration, fullName, startIso, endIsoOrNull, emailSafe
        })

        // 2b) Créer la demande
        let requestRows
        try {
            requestRows = await sql/* sql */`
                INSERT INTO public.appointment_requests (
                    service_id, customer_name, customer_email, timezone, starts_at, ends_at, status
                )
                VALUES (
                           ${svcId},
                           ${fullName},
                           ${emailSafe},
                           'Europe/Paris',
                           ${startIso}::timestamptz,
                           COALESCE(${endIsoOrNull}::timestamptz, (${startIso}::timestamptz + make_interval(mins => ${svcDuration}))),
                           'pending'
                       )
                    RETURNING
          id,
          service_id AS "serviceId",
          starts_at  AS "startsAt",
          ends_at    AS "endsAt";
            `
        } catch (e) {
            console.error("[BOOKING] SQL error at step 2 (insert appointment_request)", e)
            throw e
        }
        const reqRow = requestRows[0]
        const requestId = reqRow.id as number

        // 3) Chercher les coachs dispos
        let candidates: Array<{ coachId: number; email: string }>
        try {
            candidates = await sql/* sql */`
                WITH input AS (
                    SELECT
                        ${must(reqRow.serviceId, "reqRow.serviceId")}::int        AS service_id,
                        ${must(reqRow.startsAt, "reqRow.startsAt")}::timestamptz  AS starts_at,
                        ${must(reqRow.endsAt, "reqRow.endsAt")}::timestamptz      AS ends_at
                ),
                     base AS (
                         SELECT
                             c.id AS coach_id,
                             c.email,
                             COALESCE(NULLIF(c.timezone,''),'Europe/Paris') AS tz
                         FROM public.coaches c
                                  JOIN public.coach_services cs ON cs.coach_id = c.id
                                  JOIN input i ON i.service_id = cs.service_id
                         WHERE c.is_active = true
                     ),
                     local_times AS (
                         SELECT
                             b.*,
                             EXTRACT(DOW FROM (i.starts_at AT TIME ZONE b.tz))::int        AS dow,
                             (EXTRACT(HOUR FROM (i.starts_at AT TIME ZONE b.tz))*60
                                 + EXTRACT(MINUTE FROM (i.starts_at AT TIME ZONE b.tz)))::int AS start_min,
                             (EXTRACT(HOUR FROM (i.ends_at   AT TIME ZONE b.tz))*60
                                 + EXTRACT(MINUTE FROM (i.ends_at   AT TIME ZONE b.tz)))::int AS end_min,
                             (i.starts_at AT TIME ZONE b.tz)::date AS local_date,
                             i.starts_at, i.ends_at
                         FROM base b, input i
                     ),
                     allowed_by_exception AS (
                         SELECT l.coach_id
                         FROM local_times l
                                  JOIN public.coach_availability_exceptions e
                                       ON e.coach_id = l.coach_id
                                           AND e.date = l.local_date
                                           AND e.is_available = true
                                           AND e.start_minute <= l.start_min
                                           AND e.end_minute   >= l.end_min
                     ),
                     allowed_by_rules AS (
                         SELECT DISTINCT l.coach_id
                         FROM local_times l
                                  JOIN public.coach_availability_rules r
                                       ON r.coach_id = l.coach_id
                                           AND r.is_active = true
                                           AND r.weekday = l.dow
                                           AND r.start_minute <= l.start_min
                                           AND r.end_minute   >= l.end_min
                         WHERE NOT EXISTS (
                             SELECT 1 FROM public.coach_availability_exceptions e
                             WHERE e.coach_id = l.coach_id AND e.date = l.local_date
                         )
                     ),
                     time_ok AS (
                         SELECT coach_id FROM allowed_by_exception
                         UNION
                         SELECT coach_id FROM allowed_by_rules
                     ),
                     not_overlapping AS (
                         SELECT l.coach_id, l.email
                         FROM local_times l
                                  JOIN time_ok t USING (coach_id)
                         WHERE NOT EXISTS (
                             SELECT 1
                             FROM public.appointments a
                             WHERE a.coach_id = l.coach_id
                               AND a.status IN ('scheduled','confirmed')
                               AND tstzrange(a.starts_at, a.ends_at, '[)') && tstzrange(l.starts_at, l.ends_at, '[)')
                         )
                     )
                SELECT coach_id AS "coachId", email FROM not_overlapping;
            `
        } catch (e) {
            console.error("[BOOKING] SQL error at step 3 (find candidates)", e)
            throw e
        }

        // 4) Candidates + outbox + envoi OVH
        let queuedEmails = 0
        let emailRows: Array<{ to_email: string; subject: string; html: string }> = []

        console.log("[BOOKING] raw candidates:", candidates)

        if (Array.isArray(candidates) && candidates.length > 0) {
            const coachIds = candidates.map(c => Number(c?.coachId)).filter(Number.isFinite)
            console.log("[BOOKING] coachIds cleaned:", coachIds)

            if (coachIds.length === 0) {
                console.warn("[BOOKING] no valid coach ids after cleaning -> skip candidates/outbox")
            } else {
                console.log("[BOOKING] inserting appointment_candidates for request", requestId)
                const inserted = await sql/* sql */`
                    WITH to_ins AS (
                        SELECT UNNEST(${coachIds}::int[]) AS coach_id
                    ),
                         ins AS (
                    INSERT INTO public.appointment_candidates (request_id, coach_id)
                    SELECT ${requestId}::int, t.coach_id
                    FROM to_ins t
                        ON CONFLICT (request_id, coach_id) DO NOTHING
            RETURNING coach_id AS "coachId", decision_token AS "decisionToken"
          ),
          existing AS (
                    SELECT coach_id AS "coachId", decision_token AS "decisionToken"
                    FROM public.appointment_candidates
                    WHERE request_id = ${requestId}::int
                      AND coach_id IN (SELECT coach_id FROM to_ins)
                        )
                    SELECT "coachId", "decisionToken" FROM ins
                    UNION ALL
                    SELECT "coachId", "decisionToken" FROM existing;
                `
                console.log("[BOOKING] candidates tokens:", inserted)

                const tokenByCoach: Record<number, string> =
                    Object.fromEntries(inserted.map((r: any) => [Number(r.coachId), String(r.decisionToken)]))
                console.log("[BOOKING] tokenByCoach map:", tokenByCoach)

                // debug candidat par candidat
                for (const c of candidates) {
                    const idNum = Number(c?.coachId)
                    const hasToken = Number.isFinite(idNum) && !!tokenByCoach[idNum]
                    const emailOk = !!String(c.email || "").length
                    console.log("[BOOKING] candidate check:", {
                        coachId: c?.coachId, email: c?.email, validId: Number.isFinite(idNum), hasToken, emailOk
                    })
                }

                // construire les emails à envoyer
                emailRows = candidates
                    .filter(c => {
                        const idNum = Number(c?.coachId)
                        const keep = Number.isFinite(idNum) && !!tokenByCoach[idNum] && String(c.email || "").length > 0
                        if (!keep) {
                            console.log("[BOOKING] drop candidate:", {
                                coachId: c?.coachId, email: c?.email,
                                reason: !Number.isFinite(idNum) ? "invalid id"
                                    : !tokenByCoach[idNum] ? "missing token"
                                        : "empty email"
                            })
                        }
                        return keep
                    })
                    .map(c => {
                        const cid = Number(c.coachId)
                        const token = tokenByCoach[cid]
                        const acceptUrl  = `${baseUrl}/api/coach/requests/decision?token=${token}&d=accept`
                        const declineUrl = `${baseUrl}/api/coach/requests/decision?token=${token}&d=decline`
                        return {
                            to_email: String(c.email || ""),
                            subject: "Nouvelle demande de RDV",
                            html: `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
    <h2 style="color:#111827; font-size:20px; margin-bottom:10px;">Nouvelle demande de rendez-vous</h2>
    <p style="font-size:16px; color:#374151; margin:0 0 10px;">
      Bonjour,
    </p>
    <p style="font-size:16px; color:#374151; margin:0 0 10px;">
      <strong>${fullName}</strong> souhaite réserver le service 
      <strong style="color:#111827;">${svc.name}</strong> 
      le <strong style="color:#111827;">${new Date(reqRow.startsAt).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}</strong>.
    </p>
    <p style="font-size:16px; color:#374151; margin:0 0 20px;">
      Souhaitez-vous accepter ce rendez-vous ?
    </p>
    <div style="display:flex; gap:12px; margin-bottom:20px;">
      <a href="${acceptUrl}" 
         style="background:#16a34a; color:#fff; padding:10px 16px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:14px;">
        ✅ Accepter
      </a>
      <a href="${declineUrl}" 
         style="background:#dc2626; color:#fff; padding:10px 16px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:14px;">
        ❌ Refuser
      </a>
    </div>
    <p style="font-size:14px; color:#6b7280;">
      Merci de votre réactivité,<br/>
      L’équipe MoviLab
    </p>
  </div>
`,
                        }
                    })

                console.log("[BOOKING] emailRows prepared (count):", emailRows.length)
                console.log("[BOOKING] emailRows sample:", emailRows.slice(0, 3))

                if (emailRows.length > 0) {
                    // --- INSERT BULK via UNNEST (fiable, pas de JSONB) ---
                    const toEmails = emailRows.map(e => e.to_email)
                    const subjects = emailRows.map(e => e.subject)
                    const htmls    = emailRows.map(e => e.html)

                    console.log("[BOOKING] bulk insert to email_outbox with UNNEST")
                    const outbox = await sql/* sql */`
            INSERT INTO public.email_outbox (to_email, subject, html)
            SELECT t.email, t.subject, t.html
            FROM UNNEST(
              ${toEmails}::text[],
              ${subjects}::text[],
              ${htmls}::text[]
            ) AS t(email, subject, html)
            RETURNING id, to_email, subject, sent_at
          `
                    console.log("[BOOKING] email_outbox inserted:", outbox)
                    queuedEmails = emailRows.length

                    // Envoi réel + marquage sent_at
                    for (const e of emailRows) {
                        console.log("[BOOKING] sending email via OVH:", { to: e.to_email, subject: e.subject })
                        try {
                            const info = await sendMail(e.to_email, e.subject, e.html)
                            console.log("[BOOKING] SMTP response:", {
                                messageId: info?.messageId,
                                accepted: info?.accepted,
                                rejected: info?.rejected,
                                response: info?.response
                            })

                            await sql/* sql */`
                                UPDATE public.email_outbox
                                SET sent_at = now()
                                WHERE to_email = ${e.to_email}
                                  AND subject  = ${e.subject}
                                  AND sent_at IS NULL
                                    ORDER BY id DESC
                LIMIT 1;
                            `
                            console.log("[BOOKING] email_outbox marked sent for", e.to_email)
                        } catch (err) {
                            console.error("[BOOKING] sendMail FAILED for", e.to_email, err)
                            // on laisse sent_at NULL => permettra un retry
                        }
                    }
                } else {
                    console.log("[BOOKING] no email rows to queue")
                }
            }
        } else {
            console.log("[BOOKING] no candidates -> skip")
        }

        // ✅ Réponse API
        return NextResponse.json({
            requestId,
            clientId,
            candidates: (candidates || []).map(c => c.coachId),
            queuedEmails,
        }, { status: 201 })

    } catch (e: any) {
        console.error("[ERROR BOOKING REQUEST]", e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}