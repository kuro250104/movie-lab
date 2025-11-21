// app/api/reminders/daily/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendSms } from "@/lib/sms"

export const runtime = "nodejs"

export async function GET() {
    try {
        // RDV de demain (Europe/Paris)
        const rows = await sql/* sql */`
            WITH tomorrow AS (
                SELECT
                    (date_trunc('day', (now() AT TIME ZONE 'Europe/Paris')) + interval '1 day') AS start_day,
                    (date_trunc('day', (now() AT TIME ZONE 'Europe/Paris')) + interval '2 day') AS end_day
            )
            SELECT
                a.id,
                a.starts_at,
                c.first_name,
                c.last_name,
                c.phone,
                s.name AS service_name
            FROM public.appointments a
            JOIN public.clients c ON c.id = a.client_id
            JOIN public.services s ON s.id = a.service_id
            CROSS JOIN tomorrow t
            WHERE a.status IN ('scheduled', 'confirmed')
              AND a.starts_at >= t.start_day
              AND a.starts_at <  t.end_day
        `

        let sentCount = 0

        for (const row of rows as any[]) {
            const phone = String(row.phone || "").trim()
            if (!phone) {
                console.log("[REMINDER] no phone for appointment", row.id)
                continue
            }

            const whenFr = new Date(row.starts_at).toLocaleString("fr-FR", {
                dateStyle: "full",
                timeStyle: "short",
                timeZone: "Europe/Paris",
            })

            const fullName = `${row.first_name} ${row.last_name}`.trim()

            const body = [
                `Bonjour ${fullName},`,
                ``,
                `Petit rappel : vous avez un rendez-vous movi-lab demain pour "${row.service_name}".`,
                `Date & heure : ${whenFr}`,
                ``,
                `Si vous ne pouvez pas venir, merci de nous prévenir au +33 9 79 21 92 48 pour libérer le créneau.`,
                ``,
                `L'équipe movi-lab`,
            ].join("\n")

            await sendSms(phone, body)
            sentCount++
        }

        return NextResponse.json({ ok: true, reminders: sentCount })
    } catch (e: any) {
        console.error("[REMINDER DAILY ERROR]", e)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}