// app/api/coach/requests/decision/route.ts
export const dynamic = "force-dynamic";

import { sql } from "@/lib/db";

function htmlPage(title: string, message: string, ok = false) {
    // palette & icône inline (pas de CDN, pas de React)
    const accent = ok ? "#16a34a" /* green-600 */ : "#dc2626" /* red-600 */;
    const icon =
        ok
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;

    return new Response(
        `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root{
      --bg:#f8fafc;        /* slate-50 */
      --card:#ffffff;      /* white */
      --text:#0f172a;      /* slate-900 */
      --muted:#475569;     /* slate-600 */
      --border:#e5e7eb;    /* gray-200 */
      --accent:${accent};
    }
    @media (prefers-color-scheme: dark){
      :root{
        --bg:#0b1020;      /* custom dark bg */
        --card:#0f172a;    /* slate-900 */
        --text:#e5e7eb;    /* gray-200 */
        --muted:#94a3b8;   /* slate-400 */
        --border:#1f2937;  /* gray-800 */
      }
    }
    *{box-sizing:border-box}
    body{
      margin:0; padding:32px;
      background:var(--bg);
      color:var(--text);
      font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;
    }
    .wrap{max-width:760px;margin:0 auto}
    .card{
      background:var(--card);
      border:1px solid var(--border);
      border-radius:16px;
      padding:24px;
      box-shadow:0 10px 20px rgba(0,0,0,.04);
    }
    .head{display:flex;gap:12px;align-items:center;margin-bottom:6px}
    .title{font-size:20px;font-weight:700;margin:0}
    .icon{display:flex;align-items:center;justify-content:center}
    .msg{margin-top:4px;color:var(--muted)}
    .actions{margin-top:18px;display:flex;gap:10px;flex-wrap:wrap}
    .btn{
      display:inline-flex;align-items:center;gap:8px;
      padding:10px 14px;border-radius:10px;
      text-decoration:none;cursor:pointer;
      border:1px solid var(--border);color:var(--text);background:transparent;
      transition:background .15s ease, transform .04s ease;
    }
    .btn:hover{background:rgba(15,23,42,.04)}
    .btn:active{transform:translateY(1px)}
    .btn-primary{
      background:var(--accent);color:#fff;border-color:var(--accent);
    }
    .btn-primary:hover{filter:brightness(0.95)}
    .foot{margin-top:16px;font-size:12px;color:var(--muted)}
    .brand{font-weight:700;letter-spacing:.2px}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="icon">${icon}</div>
        <h1 class="title">${escapeHtml(title)}</h1>
      </div>
      <p class="msg">${escapeHtml(message)}</p>

      <div class="actions">
        <a class="btn" href="/">↩︎ Retour au site</a>
        <a class="btn btn-primary" href="/coach">Ouvrir l’espace coach</a>
      </div>

      <div class="foot">
        <span class="brand">MoviLab</span> — gestion des demandes de rendez-vous
      </div>
    </div>
  </div>
</body>
</html>`,
        { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
    );
}

function escapeHtml(s: string) {
    return s
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#39;");
}

function splitName(fullName: string | null | undefined) {
    const name = (fullName ?? "").trim().replace(/\s+/g, " ");
    if (!name) return { first: "", last: "" };
    const parts = name.split(" ");
    if (parts.length === 1) return { first: parts[0], last: "" };
    return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = (searchParams.get("token") ?? "").trim();
    const decision = (searchParams.get("d") ?? "").toLowerCase();

    if (!token || !["accept", "decline"].includes(decision)) {
        return htmlPage("Lien invalide", "Paramètres manquants ou décision inconnue.", false);
    }

    const rows = await sql/* sql */`
        SELECT
            ac.id               AS "candidateId",
            ac.request_id       AS "requestId",
            ac.coach_id         AS "coachId",
            ac.decision_token   AS "token",
            ar.service_id       AS "serviceId",
            ar.starts_at        AS "startsAt",
            ar.ends_at          AS "endsAt",
            ar.status           AS "requestStatus",
            ar.customer_name    AS "customerName",
            ar.customer_email   AS "customerEmail",
            c.id                AS "clientId"
        FROM public.appointment_candidates ac
                 JOIN public.appointment_requests ar ON ar.id = ac.request_id
                 LEFT JOIN public.clients c ON lower(c.email) = lower(ar.customer_email)
        WHERE ac.decision_token = ${token}
            LIMIT 1;
    `;

    if (!rows[0]) {
        return htmlPage("Lien expiré", "Ce lien n’est plus valide ou a déjà été utilisé.", false);
    }

    const cand = rows[0] as {
        candidateId: number;
        requestId: number;
        coachId: number;
        serviceId: number;
        startsAt: string;
        endsAt: string;
        requestStatus: string;
        customerName: string | null;
        customerEmail: string | null;
        clientId: number | null;
    };

    // Refus → SUPPRIMER la ligne (le champ decision_token est NOT NULL)
    if (decision === "decline") {
        await sql/* sql */`
            DELETE FROM public.appointment_candidates
            WHERE id = ${cand.candidateId};
        `;
        return htmlPage("Refus enregistré", "Merci, votre refus a bien été enregistré.", true);
    }

    if (cand.requestStatus !== "pending") {
        return htmlPage("Trop tard", "Ce rendez-vous a déjà été traité ou n’est plus disponible.", false);
    }

    if (!cand.customerEmail) {
        return htmlPage("Erreur", "Email du client manquant sur la demande.", false);
    }

    try {
        // 1) upsert client si absent
        let clientId = cand.clientId;
        if (!clientId) {
            const { first, last } = splitName(cand.customerName);
            const upsert = await sql/* sql */`
                WITH ins AS (
                INSERT INTO public.clients (first_name, last_name, email)
                SELECT ${first}, ${last}, ${cand.customerEmail}
                    WHERE NOT EXISTS (
            SELECT 1 FROM public.clients WHERE lower(email) = lower(${cand.customerEmail})
                    )
                    RETURNING id
                    )
                SELECT id FROM ins
                UNION ALL
                SELECT id FROM public.clients WHERE lower(email) = lower(${cand.customerEmail})
                    LIMIT 1;
            `;
            clientId = upsert?.[0]?.id as number | undefined;
            if (!clientId) throw new Error("Impossible d'upserter le client.");
        }

        // 2) marquer la request acceptée
        const updatedReq = await sql/* sql */`
            UPDATE public.appointment_requests
            SET status = 'accepted'
            WHERE id = ${cand.requestId} AND status = 'pending'
                RETURNING id;
        `;
        if (!updatedReq[0]) {
            return htmlPage("Trop tard", "Ce rendez-vous a déjà été traité.", false);
        }

        // 3) créer l'appointment complet
        await sql/* sql */`
            INSERT INTO public.appointments (client_id, coach_id, service_id, starts_at, ends_at, status)
            VALUES (
                       ${clientId}::int,
                       ${cand.coachId}::int,
                       ${cand.serviceId}::int,
                       ${cand.startsAt}::timestamptz,
                       ${cand.endsAt}::timestamptz,
                       'scheduled'
                   );
        `;

        // 4) nettoyer les candidats (supprimer celui-ci + les autres)
        await sql/* sql */`DELETE FROM public.appointment_candidates WHERE id = ${cand.candidateId};`;
        await sql/* sql */`
            DELETE FROM public.appointment_candidates
            WHERE request_id = ${cand.requestId} AND coach_id <> ${cand.coachId};
        `;

        return htmlPage("Rendez-vous confirmé ✅", "Merci ! Le créneau vous a été attribué et planifié.", true);
    } catch (e) {
        console.error("[COACH DECISION ERROR]", e);
        return htmlPage("Erreur", "Une erreur est survenue lors du traitement de votre décision.", false);
    }
}