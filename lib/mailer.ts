import nodemailer from "nodemailer"

let transporter: nodemailer.Transporter | null = null
let verifiedOnce = false

function must(name: string, v: string | undefined) {
    if (!v) throw new Error(`[MAILER] Missing env ${name}`)
    return v
}

export async function getTransport() {
    if (transporter) return transporter

    const host = must("OVH_SMTP_HOST", process.env.OVH_SMTP_HOST)
    const port = Number(process.env.OVH_SMTP_PORT || 587)
    const user = must("OVH_SMTP_USER", process.env.OVH_SMTP_USER)
    const pass = must("OVH_SMTP_PASS", process.env.OVH_SMTP_PASS)

    console.log("[MAILER] Creating transporter", {
        host,
        port,
        secure: port === 465,
        user_present: !!user,
        pass_present: !!pass ? "(hidden)" : "(missing)",
    })

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    })

    if (!verifiedOnce) {
        try {
            await transporter.verify()
            console.log("[MAILER] SMTP verify OK")
        } catch (err) {
            console.error("[MAILER] SMTP verify FAILED", err)
        }
        verifiedOnce = true
    }

    return transporter
}

export async function sendMail(to: string, subject: string, html: string) {
    const from = process.env.MAIL_FROM || process.env.OVH_SMTP_USER || "no-reply@localhost"
    const t = await getTransport()

    console.log("[MAILER] sendMail called", { to, subject, fromLen: from.length, htmlLen: html.length })

    try {
        const info = await t.sendMail({ from, to, subject, html })
        console.log("[MAILER] sendMail OK", {
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response,
        })
        return info
    } catch (err: any) {
        console.error("[MAILER] sendMail ERROR", {
            to, subject,
            code: err?.code,
            command: err?.command,
            response: err?.response,
            message: err?.message,
        })
        throw err
    }
}