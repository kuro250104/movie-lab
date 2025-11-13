// app/api/coach/requests/decision/route.ts
export const dynamic = "force-dynamic"
export const runtime = "nodejs";

import { sql } from "@/lib/db"

// ---------- UI Helpers ----------
function htmlPage(title: string, message: string, ok = false) {
    const accent = ok ? "#16a34a" : "#dc2626"
    const icon = ok
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`

    return new Response(
        `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<style>
:root{--bg:#f8fafc;--card:#ffffff;--text:#0f172a;--muted:#475569;--border:#e5e7eb;--accent:${accent}}
@media (prefers-color-scheme:dark){:root{--bg:#0b1020;--card:#0f172a;--text:#e5e7eb;--muted:#94a3b8;--border:#1f2937}}
*{box-sizing:border-box}body{margin:0;padding:32px;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif}
.wrap{max-width:760px;margin:0 auto}.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:0 10px 20px rgba(0,0,0,.04)}
.head{display:flex;gap:12px;align-items:center;margin-bottom:6px}.title{font-size:20px;font-weight:700;margin:0}.icon{display:flex;align-items:center;justify-content:center}
.msg{margin-top:4px;color:var(--muted)}.actions{margin-top:18px;display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;text-decoration:none;cursor:pointer;border:1px solid var(--border);color:var(--text);background:transparent;transition:background .15s ease, transform .04s ease}
.btn:hover{background:rgba(15,23,42,.04)}.btn:active{transform:translateY(1px)}.btn-primary{background:var(--accent);color:#fff;border-color:var(--accent)}.btn-primary:hover{filter:brightness(.95)}
.foot{margin-top:16px;font-size:12px;color:var(--muted)}.brand{font-weight:700;letter-spacing:.2px}
</style>
</head>
<body>
  <div class="wrap"><div class="card">
    <div class="head"><div class="icon">${icon}</div><h1 class="title">${escapeHtml(title)}</h1></div>
    <p class="msg">${escapeHtml(message)}</p>
    <div class="actions">
      <a class="btn" href="/">↩︎ Retour au site</a>
      <a class="btn btn-primary" href="/admin/appointments">Ouvrir l’espace coach</a>
    </div>
    <div class="foot"><span class="brand">MoviLab</span> — gestion des demandes de rendez-vous</div>
  </div></div>
</body></html>`,
        { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
    )
}

function escapeHtml(s: string) {
    return s.replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#39;")
}

function splitName(fullName: string | null | undefined) {
    const name = (fullName ?? "").trim().replace(/\s+/g, " ")
    if (!name) return { first: "", last: "" }
    const parts = name.split(" ")
    if (parts.length === 1) return { first: parts[0], last: "" }
    return { first: parts[0], last: parts.slice(1).join(" ") }
}

function isValidEmail(e: string | null | undefined) {
    const s = (e ?? "").trim()
    if (!s) return false
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)
}

// ---------- Handler ----------
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = (searchParams.get("token") ?? "").trim()
    const decision = (searchParams.get("d") ?? "").toLowerCase()

    if (!token || !["accept","decline"].includes(decision)) {
        return htmlPage("Lien invalide", "Paramètres manquants ou décision inconnue.", false)
    }

    try {
        const found = await sql/* sql */`
            SELECT
                ac.id               AS "candidateId",
                ac.request_id       AS "requestId",
                ac.coach_id         AS "coachId",
                ac.decision         AS "candidateDecision",
                ac.decided_at       AS "candidateDecidedAt",
                ar.service_id       AS "serviceId",
                ar.starts_at        AS "startsAt",
                ar.ends_at          AS "endsAt",
                ar.status           AS "requestStatus",
                ar.customer_name    AS "customerName",
                ar.customer_email   AS "customerEmail",
                c.id                AS "clientId"
            FROM public.appointment_candidates ac
                     JOIN public.appointment_requests  ar ON ar.id = ac.request_id
                     LEFT JOIN public.clients c ON lower(c.email) = lower(ar.customer_email)
            WHERE ac.decision_token = ${token}
                LIMIT 1;
        `

        const row = found?.[0]
        if (!row) {
            return htmlPage("Lien expiré", "Ce lien n’est plus valide ou a déjà été utilisé.", false)
        }

        if (row.candidateDecision && row.candidateDecision !== "pending") {
            return htmlPage("Déjà traité", "Vous avez déjà répondu à cette demande.", false)
        }

        // Refus simple
        if (decision === "decline") {
            await sql/* sql */`
                UPDATE public.appointment_candidates
                SET decision = 'declined', decided_at = now()
                WHERE id = ${row.candidateId};
            `
            return htmlPage("Refus enregistré", "Merci, votre refus a bien été enregistré.", true)
        }

        // --- Transaction sécurisée ---
        const result = await sql.begin(async (trx) => {
            // 1) Verrouiller la requête
            const locked = await trx/* sql */`
                SELECT id, service_id, starts_at, ends_at, status
                FROM public.appointment_requests
                WHERE id = ${row.requestId}
                    FOR UPDATE;
            `
            const reqRow = locked?.[0]
            if (!reqRow || reqRow.status !== "pending") {
                return { ok: false, code: "already_decided" as const }
            }

            // 2) Vérifier conflit horaire
            const conflict = await trx/* sql */`
                SELECT COUNT(*)::int AS count
                FROM public.appointments
                WHERE coach_id = ${row.coachId}
                  AND status IN ('scheduled','confirmed')
                  AND tstzrange(starts_at, ends_at, '[)')
                      && tstzrange(${reqRow.starts_at}::timestamptz, ${reqRow.ends_at}::timestamptz, '[)');
            `
            if ((conflict?.[0]?.count ?? 0) > 0) {
                return { ok: false, code: "time_conflict" as const }
            }

            // 3) Upsert client (robuste, normalise l'email, backfill request.client_id si colonne présente)
            let clientId: number | null = row.clientId ?? null
            const normEmail = (row.customerEmail ?? "").trim()

            if (!clientId) {
                if (!isValidEmail(normEmail)) {
                    // Email invalide -> on ne crée pas de client, mais on laisse la création du RDV possible avec client_id NULL si autorisé
                    // Ici on force l'arrêt car la suite de l'app s'attend à un client_id valide
                    return { ok: false, code: "missing_email" as const }
                }

                const { first, last } = splitName(row.customerName)

                // Tente de retrouver un client par email (case-insensitive)
                const existing = await trx/* sql */`
                    SELECT id, first_name, last_name
                    FROM public.clients
                    WHERE lower(email) = lower(${normEmail})
                    LIMIT 1;
                `

                if (existing?.length) {
                    clientId = Number(existing[0].id)

                    // Complète/écrase uniquement si valeurs non vides
                    await trx/* sql */`
                        UPDATE public.clients
                        SET first_name = COALESCE(NULLIF(${first}, ''), first_name),
                            last_name  = COALESCE(NULLIF(${last},  ''), last_name)
                        WHERE id = ${clientId};
                    `
                } else {
                    // Insère un nouveau client
                    const ins = await trx/* sql */`
                        INSERT INTO public.clients (first_name, last_name, email)
                        VALUES (${first}, ${last}, ${normEmail})
                        RETURNING id;
                    `
                    clientId = Number(ins?.[0]?.id ?? 0) || null
                }

                if (!clientId) return { ok: false, code: "client_upsert_failed" as const }

                // Backfill: si la colonne client_id existe sur appointment_requests, on la met à jour (sans DO $$)
                const hasClientIdCol = await trx/* sql */`
                  SELECT 1
                  FROM information_schema.columns
                  WHERE table_schema = 'public'
                    AND table_name = 'appointment_requests'
                    AND column_name = 'client_id'
                  LIMIT 1;
                `
                if (hasClientIdCol.length) {
                  await trx/* sql */`
                    UPDATE public.appointment_requests
                    SET client_id = ${clientId}
                    WHERE id = ${row.requestId};
                  `
                }
            }

            // 4) Créer le rendez-vous (scheduled par défaut)
            // INSÉRER le RDV une seule fois par request_id
            const apptIns = await trx/* sql */`
                INSERT INTO public.appointments
                (request_id, client_id, coach_id, service_id, starts_at, ends_at, status)
                VALUES
                    (${row.requestId}, ${clientId}, ${row.coachId}, ${row.serviceId},
                     ${reqRow.starts_at}::timestamptz, ${reqRow.ends_at}::timestamptz, 'scheduled')
                ON CONFLICT (request_id) DO NOTHING
                RETURNING id;
            `;

            const apptId = Number(apptIns?.[0]?.id ?? 0);
            if (!apptId) {
                return { ok: false, code: "already_decided" as const }; // déjà créé
            }

            await trx/* sql */`
  UPDATE public.appointment_requests
  SET status = 'matched'
  WHERE id = ${row.requestId};
`;

            // (Optionnel) Backfill request_id dans appointments si la colonne existe (sans DO $$)
            const hasRequestIdCol = await trx/* sql */`
              SELECT 1
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = 'appointments'
                AND column_name = 'request_id'
              LIMIT 1;
            `
            if (hasRequestIdCol.length) {
              await trx/* sql */`
                UPDATE public.appointments
                SET request_id = ${row.requestId}
                WHERE id = ${apptId};
              `
            }

            // 6) Marquer les décisions candidats (audit friendly)
            await trx/* sql */`
                UPDATE public.appointment_candidates
                SET decision = 'accepted', decided_at = now()
                WHERE id = ${row.candidateId};
            `

            await trx/* sql */`
            UPDATE public.appointment_candidates
            SET decision = 'auto_declined', decided_at = now()
            WHERE request_id = ${row.requestId}
              AND id <> ${row.candidateId}
              AND (decision IS NULL OR decision = 'pending');
                `

            return { ok: true, apptId }
        })

        // --- Gestion résultats ---
        if (!result.ok) {
            const msgMap = {
                already_decided: ["Trop tard", "Ce rendez-vous a déjà été traité ou n’est plus disponible."],
                time_conflict: ["Conflit d’horaire", "Ce créneau est déjà occupé dans votre planning."],
                missing_email: ["Erreur", "Email du client manquant sur la demande."],
                client_upsert_failed: ["Erreur", "Impossible d’enregistrer le client."],
                appointment_insert_failed: ["Erreur", "Création du rendez-vous impossible."]
            } as const
            const err = msgMap[result.code as keyof typeof msgMap]
            return htmlPage(err?.[0] ?? "Erreur", err?.[1] ?? "Une erreur est survenue.", false)
        }

        return htmlPage("Rendez-vous confirmé ✅", "Merci ! Le créneau vous a été attribué et planifié.", true)
    } catch (e) {
        console.error("[COACH DECISION ERROR]", e)
        return htmlPage("Erreur", "Une erreur est survenue lors du traitement de votre décision.", false)
    }
}