import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const {
            // ancien mode (tu peux encore l’utiliser si tu veux)
            priceId,
            orderId,
            successUrl,
            cancelUrl,

            // nouveau flow Movilab
            appointmentRequestId,
            serviceId,
            totalAmount,
            title,
        } = body

        const baseSuccessUrl =
            successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
        const baseCancelUrl =
            cancelUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`

        // === CAS 1 : ancien mode avec priceId + orderId ===
        if (priceId && orderId) {
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    orderId: String(orderId),
                },
                success_url: baseSuccessUrl,
                cancel_url: baseCancelUrl,
            })

            return NextResponse.json({ url: session.url, sessionId: session.id })
        }

        // === CAS 2 : flow Movilab : réservation + montant dynamique ===
        if (!appointmentRequestId || typeof totalAmount !== "number") {
            return NextResponse.json(
                { error: "Missing appointmentRequestId or totalAmount" },
                { status: 400 },
            )
        }

        const amountInCents = Math.round(totalAmount * 100)

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        unit_amount: amountInCents,
                        product_data: {
                            name: title || `Séance ${serviceId ? `#${serviceId}` : ""}`,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentRequestId: String(appointmentRequestId),
                ...(serviceId ? { serviceId: String(serviceId) } : {}),
            },
            success_url: baseSuccessUrl,
            cancel_url: baseCancelUrl,
        })

        return NextResponse.json({ url: session.url, sessionId: session.id })
    } catch (error) {
        console.error("Stripe checkout error:", error)
        return NextResponse.json({ error: "Erreur serveur Stripe" }, { status: 500 })
    }
}