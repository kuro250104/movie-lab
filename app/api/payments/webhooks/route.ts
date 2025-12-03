import { NextRequest, NextResponse} from "next/server";
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(req: NextRequest){
    const sig = req.headers.get("stripe-signature")
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !webhookSecret) {
        console.error("Missing webhook secret ok strip signature")
        return new NextResponse("Bad Request", {status: 400})
    }
    const RawBody = await req.text()

    let event: Stripe.Event

    try{
        event = stripe.webhooks.constructEvent(RawBody, sig, webhookSecret)
    } catch (err:any) {
        console.error("Error parsing webhook payload:", err.message)
        return new NextResponse(`WebHooks error: ${err.message}`, {status: 400})
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                const appointmentRequestId = session.metadata?.appointmentRequestId;
                const orderId = session.metadata?.orderId;
                const payementIntentId = session.metadata?.payementIntentId;

                console.log("Paiement complété pour :", {
                    appointmentRequestId,
                    orderId,
                    payementIntentId,
                })
                break;
            }
            default:
                console.log("event unhandled :", event.type)
        }
        return new NextResponse("OK", {status: 200})
    } catch (err) {
    console.error("Error processing webhook:", err)
    return new NextResponse("Webhooks handler error", {status: 500})
    }
}