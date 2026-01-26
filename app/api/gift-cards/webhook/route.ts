import { NextResponse } from "next/server"
import Stripe from "stripe"
import { sql } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-11-17.clover",
})

function generateGiftCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    const part = () =>
        Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    return `MOVI-${part()}-${part()}`
}

export async function POST(req: Request) {
    console.log("[WEBHOOK] Hit")

    const sig = req.headers.get("stripe-signature") ?? ""
    let event: Stripe.Event

    try {
        // ✅ App Router: raw body via req.text() (ou arrayBuffer)
        const rawBody = await req.text()

        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string,
        )
    } catch (err: any) {
        console.error("[WEBHOOK] Signature error", err)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log("[WEBHOOK] Event type:", event.type)

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session

            const type = session.metadata?.type
            console.log("[WEBHOOK] checkout.session.completed metadata.type =", type)

            // 🔹 BRANCHE CARTE CADEAU
            if (type === "gift_card") {
                const buyerEmail =
                    session.metadata?.buyer_email || session.customer_details?.email || null
                const recipientEmail = session.metadata?.recipient_email || buyerEmail

                const amountTotal = session.amount_total ?? 0 // cents
                const currency = session.currency ?? "eur"

                const code = generateGiftCode()

                console.log(
                    "[WEBHOOK] Création gift_card:",
                    code,
                    "amount:",
                    amountTotal,
                    "currency:",
                    currency,
                    "recipient:",
                    recipientEmail,
                )

                await sql/*sql*/ `
                    INSERT INTO gift_cards (
                        code,
                        amount_cents,
                        remaining_cents,
                        currency,
                        status,
                        buyer_email,
                        recipient_email,
                        stripe_payment_intent_id,
                        stripe_session_id
                    ) VALUES (
                                 ${code},
                                 ${amountTotal},
                                 ${amountTotal},
                                 ${currency},
                                 'active',
                                 ${buyerEmail},
                                 ${recipientEmail},
                                 ${session.payment_intent?.toString() ?? null},
                                 ${session.id}
                             );
                `

                console.log("[WEBHOOK] ✅ Gift card créée avec succès")
            } else {
                console.log("[WEBHOOK] checkout.session.completed non gift_card, ignoré pour l'instant")
            }
        } else {
            console.log("[WEBHOOK] Event Stripe non géré:", event.type)
        }

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (err) {
        console.error("[WEBHOOK] Handler error", err)
        return new NextResponse("Webhook handler error", { status: 500 })
    }
}