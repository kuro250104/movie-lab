import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { sql } from "@/lib/db"
import {sendGiftCardEmail} from "@/lib/mailer";

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function generateGiftCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    const part = () =>
        Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    return `MOVI-${part()}-${part()}`
}

export async function POST(req: NextRequest) {
    console.log("Webhook hit")

    const sig = req.headers.get("stripe-signature")
    if (!sig) {
        console.error("Pas de stripe-signature dans les headers")
        return new NextResponse("Missing stripe-signature", { status: 400 })
    }

    let event: Stripe.Event

    try {
        const rawBody = await req.text()

        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error("Erreur vérification webhook Stripe:", err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log("Event Stripe reçu:", event.type)

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session
            const metadata = session.metadata ?? {}
            const type = metadata.type

            console.log("checkout.session.completed metadata.type =", type)
            //carte cadeaux
            if (type === "gift_card") {
                const buyerEmail = metadata.buyer_email || session.customer_details?.email || null
                const recipientEmail = metadata.recipient_email || buyerEmail

                const amountTotal = session.amount_total ?? 0 // en cents
                const currency = session.currency ?? "eur"

                const code = generateGiftCode()

                console.log(
                    "[GIFT_CARD] Création:",
                    code,
                    "montant:",
                    amountTotal,
                    "devise:",
                    currency,
                    "recipient:",
                    recipientEmail
                )

                await sql/*sql*/`
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

                const finalRecipient = recipientEmail || buyerEmail
                if (finalRecipient) {
                    await sendGiftCardEmail({
                        to: finalRecipient,
                        code,
                        amountCents: amountTotal,
                    })
                    console.log("[WEBHOOK] ✉️ Gift card envoyée à", finalRecipient)
                } else {
                    console.warn(
                        "[WEBHOOK] Aucun email disponible pour envoyer la carte cadeau",
                        { buyerEmail, recipientEmail },
                    )
                }
                console.log("[GIFT_CARD] ✅ Carte cadeau créée")

                return NextResponse.json({ received: true })
            }

            //sans carte cadeaux
            const rawBooking = metadata.bookingPayload
            if (!rawBooking) {
                console.error("Aucun bookingPayload dans les metadata Stripe (et pas gift_card)")
                return new NextResponse("OK", { status: 200 })
            }

            const bookingPayload = JSON.parse(rawBooking)

            const giftCode: string | null = bookingPayload.giftCode || null
            const giftDiscount: number = Number(bookingPayload.giftDiscount || 0) // en euros

            if (giftCode && giftDiscount > 0) {
                console.log(
                    "[GIFT_REDEEM] Tentative d'utilisation de la carte",
                    giftCode,
                    "pour",
                    giftDiscount,
                    "€"
                )

                const discountCents = Math.round(giftDiscount * 100)

                const rows = await sql/*sql*/`
          SELECT id, remaining_cents, status
          FROM gift_cards
          WHERE code = ${giftCode}
          FOR UPDATE
        `

                if (!rows.length) {
                    console.warn("[GIFT_REDEEM] Code inconnu:", giftCode)
                } else {
                    const card = rows[0] as { id: string; remaining_cents: number; status: string }

                    if (card.status !== "active" || card.remaining_cents <= 0) {
                        console.warn("[GIFT_REDEEM] Carte non utilisable:", card.status, card.remaining_cents)
                    } else {
                        const amountToUse = Math.min(discountCents, card.remaining_cents)

                        await sql.begin(async (tx) => {
                            await tx/*sql*/`
                UPDATE gift_cards
                SET remaining_cents = remaining_cents - ${amountToUse},
                    status = CASE 
                      WHEN remaining_cents - ${amountToUse} <= 0 THEN 'empty'
                      ELSE status
                    END,
                    updated_at = now()
                WHERE id = ${card.id}
              `

                            await tx/*sql*/`
                INSERT INTO gift_card_redemptions (
                  gift_card_id,
                  appointment_id,
                  redeemed_cents
                ) VALUES (
                  ${card.id},
                  NULL,
                  ${amountToUse}
                )
              `
                        })

                        console.log(
                            "[GIFT_REDEEM] Carte débitée de",
                            amountToUse,
                            "cents. Code:",
                            giftCode
                        )
                    }
                }
            }

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL

            try {
                const resp = await fetch(`${baseUrl}/api/public/booking`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingPayload),
                })

                if (!resp.ok) {
                    console.error("Erreur lors de la création de la réservation:", await resp.text())
                } else {
                    console.log("Réservation créée après paiement")
                }
            } catch (err) {
                console.error("Exception lors de l'appel à /api/public/booking:", err)
            }

            return NextResponse.json({ received: true })
        }

        console.log("ℹ Événement Stripe non géré:", event.type)
        return NextResponse.json({ received: true })
    } catch (err) {
        console.error("[WEBHOOK] Handler error", err)
        return new NextResponse("Webhook handler error", { status: 500 })
    }
}