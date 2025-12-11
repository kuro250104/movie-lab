import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { sql } from "@/lib/db" // <-- adapte le chemin si besoin

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-11-17.clover",
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const {
            priceId,
            amountCents,
            currency,
            buyerEmail,
            recipientEmail,
            buyerFirstName,
            buyerLastName,
            buyerCompany,
            buyerVatNumber,
            buyerAddress,
            buyerAddressComplement,
            buyerPostalCode,
            buyerCity,
            buyerCountry,
        } = body

        // 🔎 validations basiques
        if (
            !priceId ||
            !amountCents ||
            !currency ||
            !buyerEmail ||
            !buyerFirstName ||
            !buyerLastName ||
            !buyerAddress ||
            !buyerPostalCode ||
            !buyerCity
        ) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const finalCountry = buyerCountry?.trim() || "FR"
        const finalRecipientEmail = recipientEmail?.trim() || buyerEmail.trim()

        // 1️⃣ On enregistre la commande + infos de facture AVANT Stripe
        const [order] = await sql<{
            id: number
        }>`
            INSERT INTO gift_card_orders (
                price_id,
                amount_cents,
                currency,
                buyer_email,
                recipient_email,
                buyer_first_name,
                buyer_last_name,
                buyer_company,
                buyer_vat_number,
                buyer_address,
                buyer_address_complement,
                buyer_postal_code,
                buyer_city,
                buyer_country
            )
            VALUES (
                       ${priceId},
                       ${amountCents},
                       ${currency},
                       ${buyerEmail.trim()},
                       ${finalRecipientEmail},
                       ${buyerFirstName.trim()},
                       ${buyerLastName.trim()},
                       ${buyerCompany?.trim() || null},
                       ${buyerVatNumber?.trim() || null},
                       ${buyerAddress.trim()},
                       ${buyerAddressComplement?.trim() || null},
                       ${buyerPostalCode.trim()},
                       ${buyerCity.trim()},
                       ${finalCountry}
                   )
            RETURNING id
        `

        const orderId = order.id

        // 2️⃣ Création de la session Stripe
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: buyerEmail.trim(),
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/gift-card/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/gift-card/cancel`,
            metadata: {
                type: "gift_card",
                gift_order_id: String(orderId),
                recipient_email: finalRecipientEmail,
            },
        })

        // 3️⃣ On stocke l’ID de session Stripe pour la suite (webhook)
        await sql`
            UPDATE gift_card_orders
            SET stripe_session_id = ${session.id}
            WHERE id = ${orderId}
        `

        return NextResponse.json({ url: session.url }, { status: 200 })
    } catch (err) {
        console.error("Gift card checkout error", err)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}