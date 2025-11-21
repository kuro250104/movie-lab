// lib/booking/emails.ts
import { FR_TZ, escapeHtml, currencyEUR, type EmailSupplement } from "./utils"

export function renderCustomerBookingEmail(opts: {
    brand?: string
    fullName: string
    serviceName: string
    servicePrice?: number | null
    durationMinutes?: number | null
    startsAtISO: string
    supplements?: EmailSupplement[]
    notes?: string | null
    serviceMessage?: string | null
}) {
    const {
        brand = "MoviLab",
        fullName,
        serviceName,
        servicePrice,
        durationMinutes,
        startsAtISO,
        supplements = [],
        notes,
        serviceMessage,
    } = opts

    const when = new Date(startsAtISO).toLocaleString("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: FR_TZ,
    })

    const priceRow = Number.isFinite(Number(servicePrice))
        ? `<div style="margin-top:4px;color:#374151;">Tarif : <strong style="color:#111827;">${currencyEUR(
            Number(servicePrice),
        )}</strong></div>`
        : ""

    const durationRow = Number.isFinite(Number(durationMinutes))
        ? `<div style="margin-top:4px;color:#374151;">Durée : <strong style="color:#111827;">${Number(
            durationMinutes,
        )} min</strong></div>`
        : ""

    const supplementsList = supplements.length
        ? `
      <ul style="margin:8px 0 0 0;padding-left:18px;color:#374151;font-size:14px;">
        ${supplements
            .map(
                (s) =>
                    `<li>${escapeHtml(s.name)} – ${currencyEUR(Number(s.price) || 0)}</li>`,
            )
            .join("")}
      </ul>
    `
        : `<p style="margin:8px 0 0 0;color:#6b7280;font-size:14px;">Aucun supplément sélectionné.</p>`

    const notesBlock =
        notes && notes.trim()
            ? `
      <div style="margin-top:12px;">
        <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">Votre message :</div>
        <div style="font-size:14px;line-height:1.6;color:#374151;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;">
          ${escapeHtml(notes).replace(/\n/g, "<br/>")}
        </div>
      </div>
    `
            : ""

    const serviceMessageBlock =
        serviceMessage && serviceMessage.trim()
            ? `
      <div style="margin-top:12px;">
        <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">
          Informations importantes pour ce service :
        </div>
        <div style="font-size:14px;line-height:1.6;color:#374151;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;">
          ${escapeHtml(serviceMessage)}
        </div>
      </div>
    `
            : ""

    return `
    <div style="background:#f3f4f6;padding:24px 0;margin:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td align="center" style="padding:0 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="background:#111827;color:#fff;padding:18px 24px;">
                  <div style="font-size:16px;font-weight:700;letter-spacing:.2px;">${escapeHtml(
        brand,
    )}</div>
                  <div style="font-size:13px;opacity:.85;margin-top:2px;">Confirmation de votre demande de rendez-vous</div>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 24px 0;">
                  <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#374151;">
                    Bonjour ${escapeHtml(fullName)},
                  </p>
                  <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#374151;">
                    Nous avons bien reçu votre demande de rendez-vous pour le service
                    <strong style="color:#111827;">${escapeHtml(serviceName)}</strong>.
                  </p>
                  <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#374151;">
                    Voici le récapitulatif de votre demande :
                  </p>
                  <div style="font-size:14px;line-height:1.6;color:#374151;margin-top:4px;">
                    <div>Date & heure : <strong style="color:#111827;">${when}</strong></div>
                    ${priceRow}
                    ${durationRow}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px 0;">
                  <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">
                    Suppléments choisis :
                  </div>
                  ${supplementsList}
                </td>
              </tr>
               ${notesBlock ? `<tr><td style="padding:0 24px 0;">${notesBlock}</td></tr>` : ""}
               ${
        serviceMessageBlock
            ? `<tr><td style="padding:0 24px 0;">${serviceMessageBlock}</td></tr>`
            : ""
    }
              <tr>
                <td style="padding:16px 24px 20px;">
                  <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#374151;">
                    Votre créneau sera confirmé par un coach dès que possible. Vous recevrez un nouvel email de confirmation ou une proposition d&apos;horaire alternatif si nécessaire.
                  </p>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
                    Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous pouvez ignorer cet email.
                  </p>
                  <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#374151;">
                    Sportivement,<br/>
                    L&apos;équipe ${escapeHtml(brand)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `
}

export function renderBookingEmail(opts: {
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
        timeZone: FR_TZ,
    })

    const priceRow = Number.isFinite(Number(servicePrice))
        ? `<div style="margin-top:4px;color:#374151;">Tarif : <strong style="color:#111827;">${currencyEUR(
            Number(servicePrice),
        )}</strong></div>`
        : ""

    const durationRow = Number.isFinite(Number(durationMinutes))
        ? `<div style="margin-top:4px;color:#374151;">Durée : <strong style="color:#111827;">${Number(
            durationMinutes,
        )} min</strong></div>`
        : ""

    const coordRows = `
    ${
        customerEmail
            ? `<div style="margin-top:2px;color:#374151;">Email : <a style="color:#2563eb;text-decoration:none;" href="mailto:${escapeHtml(
                customerEmail,
            )}">${escapeHtml(customerEmail)}</a></div>`
            : ""
    }
    ${
        customerPhone
            ? `<div style="margin-top:2px;color:#374151;">Téléphone : <a style="color:#2563eb;text-decoration:none;" href="tel:${escapeHtml(
                customerPhone,
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
                    s.name,
                )}</td>
                  <td align="right" style="padding:10px 12px;border-top:1px solid #f3f4f6;font-size:14px;color:#111827;">${currencyEUR(
                    Number(s.price) || 0,
                )}</td>
                </tr>
              `,
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