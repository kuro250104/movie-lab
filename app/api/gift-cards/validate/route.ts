import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db" // ton helper Neon/Scaleway

export async function POST(req: NextRequest) {
    try {
        const { code, totalAmount } = await req.json() as {
            code?: string
            totalAmount?: number
        }

        if (!code) {
            return NextResponse.json(
                { valid: false, discountAmount: 0, message: "Code manquant." },
                { status: 400 }
            )
        }

        // totalAmount = montant du panier en EUROS (ex: 280)
        const totalAmountNumber = Number(totalAmount ?? 0)
        if (!Number.isFinite(totalAmountNumber) || totalAmountNumber <= 0) {
            return NextResponse.json(
                { valid: false, discountAmount: 0, message: "Montant de réservation invalide." },
                { status: 400 }
            )
        }

        const normalizedCode = code.trim().toUpperCase()

        // On récupère la carte cadeau
        const rows = await sql/*sql*/`
      SELECT id, code, amount_cents, remaining_cents, currency, status
      FROM gift_cards
      WHERE code = ${normalizedCode}
      LIMIT 1;
    `
        const gift = rows[0]

        if (!gift) {
            return NextResponse.json({
                valid: false,
                discountAmount: 0,
                message: "Ce code n'existe pas.",
            })
        }

        if (gift.status !== "active" || gift.remaining_cents <= 0) {
            return NextResponse.json({
                valid: false,
                discountAmount: 0,
                message: "Cette carte cadeau n'est plus utilisable.",
            })
        }

        // Conversion panier → cents
        const totalCents = Math.round(totalAmountNumber * 100)

        // On ne peut pas appliquer plus que le solde restant
        const applicableCents = Math.min(totalCents, gift.remaining_cents)

        if (applicableCents <= 0) {
            return NextResponse.json({
                valid: false,
                discountAmount: 0,
                message: "Cette carte ne peut pas être utilisée pour ce montant.",
            })
        }

        const discountAmount = applicableCents / 100 // 👉 EN EUROS pour le front

        return NextResponse.json({
            valid: true,
            discountAmount,
            message: `Code valide. Réduction disponible : ${discountAmount.toFixed(2)} €.`,
            remainingAfter: (gift.remaining_cents - applicableCents) / 100,
        })
    } catch (err) {
        console.error("[GIFT_CARDS_VALIDATE] error", err)
        return NextResponse.json(
            {
                valid: false,
                discountAmount: 0,
                message: "Erreur lors de la vérification du code.",
            },
            { status: 500 }
        )
    }
}