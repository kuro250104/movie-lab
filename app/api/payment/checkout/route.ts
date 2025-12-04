import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { bookingPayload, totalAmount, title } = body

        if (!bookingPayload || !totalAmount || !title) {
            return NextResponse.json(
                { error: "bookingPayload, totalAmount et title sont obligatoires" },
                { status: 400 }
            )
        }

        const amount = Math.round(Number(totalAmount) * 100)
        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                { error: "Montant invalide" },
                { status: 400 }
            )
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: { name: title },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingPayload: JSON.stringify(bookingPayload),
            },
            success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/payment/cancel`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error("Stripe checkout error:", error)
        return NextResponse.json(
            { error: "Erreur lors de la création de la session de paiement" },
            { status: 500 }
        )
    }
}