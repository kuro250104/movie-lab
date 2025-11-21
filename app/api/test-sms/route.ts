import { NextResponse } from "next/server"
import { sendSms } from "@/lib/sms"

export async function GET() {
    try {
        const to = process.env.SMS_TEST_NUMBER // TON numéro perso au format +33...
        const msg = await sendSms(to!, "Test MoviLab : ce message confirme que Twilio fonctionne bien 🚀")

        return NextResponse.json({ ok: true, sid: msg?.sid })
    } catch (err) {
        console.error("TEST_SMS_ERROR", err)
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
    }
}