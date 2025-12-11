import type { Metadata, Viewport } from "next"
import { stripe } from "@/lib/stripe"
import { Gift } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Snow from "@/components/snow-effect";

export const metadata: Metadata = {
    title: "Carte cadeau – Paiement confirmé | movi-lab",
    description: "Votre carte cadeau movi-lab a bien été créée.",
}

export const viewport: Viewport = {
    themeColor: "#000000",
}

type Props = {
    searchParams: {
        session_id?: string
    }
}

export default async function GiftCardSuccessPage({ searchParams }: Props) {
    const sessionId = searchParams.session_id

    let amountEuros: string | null = null
    let recipientEmail: string | null = null

    if (sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ["customer_details"],
            })

            if (session.amount_total && session.currency) {
                amountEuros = new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: session.currency.toUpperCase(),
                    maximumFractionDigits: 0,
                }).format(session.amount_total / 100)
            }

            const meta = session.metadata ?? {}
            recipientEmail =
                meta.recipient_email ||
                session.customer_details?.email ||
                meta.buyer_email ||
                null
        } catch (e) {
            console.error("Erreur lors de la récupération de la session Stripe:", e)
        }
    }

    return (
        <main className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white px-6">
            <Snow/>
            <section className="w-full max-w-xl rounded-3xl border border-orange-500/30 bg-gradient-to-br from-gray-900 to-black shadow-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#f9731640,_transparent_60%)] pointer-events-none" />

                <div className="relative flex flex-col items-center gap-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-400/60 shadow-lg">
                        <Gift className="w-7 h-7 text-orange-300" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold">
                        Merci, votre carte cadeau est bien créée 🎁
                    </h1>

                    {amountEuros && (
                        <p className="text-lg text-orange-300 font-semibold">
                            Montant : {amountEuros}
                        </p>
                    )}

                    <p className="text-sm md:text-base text-gray-300 max-w-md">
                        Vous allez recevoir un e-mail de confirmation
                        {recipientEmail && (
                            <>
                                {" "}
                                à <span className="font-semibold text-white">{recipientEmail}</span>
                            </>
                        )}
                        {" "}avec toutes les informations concernant votre carte cadeau movi-lab.
                    </p>

                    <p className="text-xs text-gray-500 max-w-sm">
                        La carte cadeau sera bientôt utilisable directement lors de la réservation
                        d&apos;une séance sur le site movi-lab.
                    </p>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/app/api/public" prefetch={false}>
                            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl px-6 py-2 text-sm shadow-lg">
                                Retour à l'accueil
                            </Button>
                        </Link>
                        <Link href="/gift-card" prefetch={false}>
                            <Button
                                variant="outline"
                                className="border-gray-600 text-gray-200 hover:bg-gray-900 rounded-2xl px-6 py-2 text-sm"
                            >
                                Voir les cartes cadeaux
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}