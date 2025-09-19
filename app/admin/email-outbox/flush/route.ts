import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendMail } from "@/lib/mailer"

export async function POST() {
    const messages = await sql/* sql */`
    SELECT id, to_email, subject, html
    FROM public.email_outbox
    WHERE sent_at IS NULL
    ORDER BY created_at
    LIMIT 50
  `
    let sent = 0

    for (const m of messages) {
        try {
            await sendMail(m.to_email, m.subject, m.html)
            await sql/* sql */`UPDATE public.email_outbox SET sent_at = now() WHERE id = ${m.id}`
            sent++
        } catch (e) {
            console.error("MAIL SEND ERROR", m.id, e)
            // tu peux aussi ajouter une colonne retry_count / last_error pour re-tenter
        }
    }

    return NextResponse.json({ queued: messages.length, sent })
}