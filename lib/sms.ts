import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

if (!accountSid || !authToken || !fromNumber) {
    console.warn("[SMS] Twilio env vars missing – SMS sending disabled")
}

const client =
    accountSid && authToken
        ? twilio(accountSid, authToken)
        : null

export async function sendSms(to: string, body: string) {
    console.log("[SMS] sendSms called:", { to, body })

    if (!client || !fromNumber) {
        console.warn("[SMS] sendSms called but Twilio not configured")
        return null
    }

    return client.messages.create({
        from: fromNumber,
        to,
        body,
    })
}