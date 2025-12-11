// app/api/public/contact/route.ts
import { NextResponse } from "next/server"
import { sendMail } from "@/lib/mailer"

function escapeHtml(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, phone, message } = await req.json()

        if (!firstName || !lastName || !email || !message) {
            return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 })
        }

        const subject = `Contact movi-lab — ${firstName} ${lastName}`

        const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;line-height:1.5">
        <h2>Nouveau message via le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(lastName)}</p>
        <p><strong>Prénom :</strong> ${escapeHtml(firstName)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(phone || "-")}</p>
        <hr/>
        <p><strong>Message :</strong></p>
        <pre style="white-space:pre-wrap; font: inherit;">${escapeHtml(message)}</pre>
      </div>
    `

        await sendMail("info@movi-lab.fr", subject, html)

        return NextResponse.json({ ok: true })
    } catch (e: any) {
        console.error("[CONTACT API] error:", e)
        return NextResponse.json({ error: "Impossible d’envoyer le message." }, { status: 500 })
    }
}