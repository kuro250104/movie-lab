import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"

// Important pour éviter Edge/runtime chelou
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    console.log("🔥 Webhook hit")

    const sig = req.headers.get("stripe-signature")
    if (!sig) {
        console.error("❌ Pas de stripe-signature dans les headers")
        return new NextResponse("Missing stripe-signature", { status: 400 })
    }

    let event: Stripe.Event

    try {
        // ⚠️ On récupère le RAW body en texte,
        // pas de req.json(), sinon la signature ne matche plus.
        const rawBody = await req.text()

        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error("❌ Erreur vérification webhook Stripe:", err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log("✅ Event Stripe reçu:", event.type)

    // 👉 Ici tu gères seulement les events qui t'intéressent
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        const rawBooking = session.metadata?.bookingPayload
        if (!rawBooking) {
            console.error("❌ Aucun bookingPayload dans les metadata Stripe")
            return new NextResponse("OK", { status: 200 })
        }

        const bookingPayload = JSON.parse(rawBooking)

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

        try {
            const resp = await fetch(`${baseUrl}/api/public/booking`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingPayload),
            })

            if (!resp.ok) {
                console.error("❌ Erreur lors de la création de la réservation:", await resp.text())
            } else {
                console.log("✅ Réservation créée après paiement")
            }
        } catch (err) {
            console.error("❌ Exception lors de l'appel à /api/public/booking:", err)
        }
    } else {
        console.log("ℹ️ Événement Stripe non géré:", event.type)
    }

    return NextResponse.json({ received: true })
}