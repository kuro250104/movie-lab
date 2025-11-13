import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { sendMail } from "@/lib/mailer"

export const runtime = "nodejs"

const BUFFER_MINUTES = 10
const FR_TZ = "Europe/Paris"

const nn = <T>(v: T | undefined | null) => (v === undefined ? null : v)

function must<T>(v: T | null | undefined, label: string): T {
    if (v == null) {
        console.error(`[BOOKING] '${label}' is null/undefined`)
        throw new Error(`Param '${label}' is null/undefined`)
    }
    return v
}

function escapeHtml(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function currencyEUR(n: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0)
}

type EmailSupplement = { id: number; name: string; price: number }

function renderBookingEmail(opts: {
    brand?: string
    fullName: string
    customerEmail?: string | null
    customerPhone?: string | null
    serviceName: string
    servicePrice?: number | null
    durationMinutes?: number | null
    startsAtISO: string
    acceptUrl?: string
    declineUrl?: string
    notes?: string | null
    supplements?: EmailSupplement[]
}) {
    const {
        brand = "MoviLab",
        fullName,
        customerEmail,
        customerPhone,
        serviceName,
        servicePrice,
        durationMinutes,
        startsAtISO,
        acceptUrl,
        declineUrl,
        notes,
        supplements = [],
    } = opts

    const when = new Date(startsAtISO).toLocaleString("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
    })

    const priceRow = Number.isFinite(Number(servicePrice))
        ? `<div style="margin-top:4px;color:#374151;">Tarif : <strong style="color:#111827;">${currencyEUR(
            Number(servicePrice)
        )}</strong></div>`
        : ""

    const durationRow = Number.isFinite(Number(durationMinutes))
        ? `<div style="margin-top:4px;color:#374151;">Durée : <strong style="color:#111827;">${Number(
            durationMinutes
        )} min</strong></div>`
        : ""

    const coordRows = `
    ${
        customerEmail
            ? `<div style="margin-top:2px;color:#374151;">Email : <a style="color:#2563eb;text-decoration:none;" href="mailto:${escapeHtml(
                customerEmail
            )}">${escapeHtml(customerEmail)}</a></div>`
            : ""
    }
    ${
        customerPhone
            ? `<div style="margin-top:2px;color:#374151;">Téléphone : <a style="color:#2563eb;text-decoration:none;" href="tel:${escapeHtml(
                customerPhone
            )}">${escapeHtml(customerPhone)}</a></div>`
            : ""
    }
  `

    const supplementsTable = supplements.length
        ? `
      <tr>
        <td style="padding:16px 24px 0;">
          <h3 style="margin:0 0 8px;font-size:16px;line-height:1.35;color:#111827;">Options supplémentaires</h3>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#f9fafb;">
                <th align="left" style="padding:10px 12px;font-size:13px;color:#374151;">Nom</th>
                <th align="right" style="padding:10px 12px;font-size:13px;color:#374151;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${supplements
            .map(
                (s) => `
                <tr>
                  <td style="padding:10px 12px;border-top:1px solid #f3f4f6;font-size:14px;color:#111827;">${escapeHtml(
                    s.name
                )}</td>
                  <td align="right" style="padding:10px 12px;border-top:1px solid #f3f4f6;font-size:14px;color:#111827;">${currencyEUR(
                    Number(s.price) || 0
                )}</td>
                </tr>
              `
            )
            .join("")}
            </tbody>
          </table>
        </td>
      </tr>
    `
        : ""

    const notesBlock =
        notes && notes.trim()
            ? `
      <tr>
        <td style="padding:16px 24px 0;">
          <h3 style="margin:0 0 8px;font-size:16px;line-height:1.35;color:#111827;">Notes du client</h3>
          <div style="font-size:14px;line-height:1.6;color:#374151;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;">
            ${escapeHtml(notes).replace(/\n/g, "<br/>")}
          </div>
        </td>
      </tr>
    `
            : ""

    const actions =
        acceptUrl && declineUrl
            ? `
<tr>
  <td style="padding:24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding-top:4px;">
          <a href="${acceptUrl}"
             style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;
                    font-weight:600;font-size:15px;padding:12px 20px;border-radius:6px;
                    box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            Accepter la demande
          </a>
          <a href="${declineUrl}"
             style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;
                    font-weight:600;font-size:15px;padding:12px 20px;border-radius:6px;
                    margin-left:12px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            Refuser la demande
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>`
            : ""

    return `
  <div style="background:#f3f4f6;padding:24px 0;margin:0;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#111827;color:#fff;padding:18px 24px;">
                <div style="font-size:16px;font-weight:700;letter-spacing:.2px;">${escapeHtml(brand)}</div>
                <div style="font-size:13px;opacity:.85;margin-top:2px;">Nouvelle demande de rendez-vous</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 0;">
                <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#374151;">Bonjour,</p>
                <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#374151;">
                  <strong style="color:#111827;">${escapeHtml(fullName)}</strong> souhaite réserver le service
                  <strong style="color:#111827;">${escapeHtml(serviceName)}</strong>.
                </p>
                <div style="font-size:14px;line-height:1.6;color:#374151;">
                  Date/heure: <strong style="color:#111827;">${when}</strong>
                  ${priceRow}
                  ${durationRow}
                  ${coordRows}
                </div>
              </td>
            </tr>
            ${supplementsTable}
            ${notesBlock}
            ${actions}
            <tr>
              <td style="padding:14px 24px 20px;border-top:1px solid #f3f4f6;">
                <div style="font-size:12px;color:#6b7280;line-height:1.5;">
                  Merci de votre réactivité,<br/>
                  L’équipe ${escapeHtml(brand)}<br/>
                  <span style="color:#9ca3af;">Cet email contient des liens d’action sécurisés et vous est destiné en tant que coach partenaire.</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`
}

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
                { status: 400 }
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
                { status: 409 }
            )
        }

        // 4) INSERT request (🔥 cast phone + notes)
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


        // 5) Chercher les coachs candidats
//         const candidates: Array<{ coachId: number; email: string }> = await sql/* sql */`
//   WITH input AS (
//     SELECT
//       ${Number(reqRow.serviceId)}::bigint AS service_id,
//       ${reqRow.startsAt}::timestamptz     AS starts_at,
//       ${reqRow.endsAt}::timestamptz       AS ends_at
//   ),
//   base AS (
//     SELECT
//       c.id    AS coach_id,
//       c.email AS email,
//       'Europe/Paris'::text AS tz          -- ✅ on force le fuseau
//     FROM public.coaches c
//     JOIN public.coach_services cs ON cs.coach_id = c.id
//     JOIN input i ON i.service_id = cs.service_id
//     WHERE c.is_active = true
//   ),
//   local_times AS (
//     SELECT
//       b.*,
//       EXTRACT(DOW FROM (i.starts_at AT TIME ZONE b.tz))::int AS dow,
//       (EXTRACT(HOUR FROM (i.starts_at AT TIME ZONE b.tz)) * 60
//        + EXTRACT(MINUTE FROM (i.starts_at AT TIME ZONE b.tz)))::int AS start_min,
//       (EXTRACT(HOUR FROM (i.ends_at   AT TIME ZONE b.tz)) * 60
//        + EXTRACT(MINUTE FROM (i.ends_at   AT TIME ZONE b.tz)))::int AS end_min,
//       (i.starts_at AT TIME ZONE b.tz)::date AS local_date,
//       i.starts_at,
//       i.ends_at
//     FROM base b, input i
//   ),
//   -- 1) exceptions positives
//   allowed_by_exception AS (
//     SELECT l.coach_id
//     FROM local_times l
//     JOIN public.coach_availability_exceptions e
//       ON e.coach_id = l.coach_id
//      AND e.date = l.local_date
//      AND e.is_available = true
//      AND e.start_minute <= l.start_min
//      AND e.end_minute >= l.end_min
//   ),
//   -- 2) règles récurrentes
//   allowed_by_rules AS (
//     SELECT DISTINCT l.coach_id
//     FROM local_times l
//     JOIN public.coach_availability_rules r
//       ON r.coach_id = l.coach_id
//      AND r.is_active = true
//      AND r.weekday = l.dow
//      AND r.start_minute <= l.start_min
//      AND r.end_minute >= l.end_min
//     WHERE NOT EXISTS (
//       SELECT 1
//       FROM public.coach_availability_exceptions e
//       WHERE e.coach_id = l.coach_id
//         AND e.date = l.local_date
//     )
//   ),
//   time_ok AS (
//     SELECT coach_id FROM allowed_by_exception
//     UNION
//     SELECT coach_id FROM allowed_by_rules
//   ),
//   not_overlapping AS (
//     SELECT l.coach_id, l.email
//     FROM local_times l
//     JOIN time_ok t USING (coach_id)
//     WHERE NOT EXISTS (
//       SELECT 1
//       FROM public.appointments a
//       WHERE a.coach_id = l.coach_id
//         AND a.status IN ('scheduled', 'confirmed')
//         AND tstzrange(a.starts_at, a.ends_at, '[)')
//             && tstzrange(l.starts_at, l.ends_at, '[)')
//     )
//   )
//   SELECT coach_id AS "coachId", email
//   FROM not_overlapping;
// `

        // 5) Chercher les coachs candidats (version simple = pas de filtre d'horaires)
        const candidates: Array<{ coachId: number; email: string }> = await sql/* sql */`
  SELECT
    c.id   AS "coachId",
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
            brand: "MoviLab",
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
                    { status: 500 }
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
                    inserted.map((r: any) => [Number(r.coachId), String(r.decisionToken)])
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
                            brand: "MoviLab",
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
                    const info = await sendMail(e.to_email, e.subject, e.html)
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
            { status: 201 }
        )
    } catch (e: any) {
        console.error("[ERROR BOOKING REQUEST]", e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}