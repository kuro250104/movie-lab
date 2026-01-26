import { Metadata } from "next"
import { stripe } from "@/lib/stripe"
import Snow from "@/components/snow-effect"
import { GiftCardsClient } from "@/components/gift-cards-clients"

export const metadata: Metadata = {
    title: "Cartes cadeaux | movi-lab",
    description: "Offrez une carte cadeau movi-lab pour Noël ou toute occasion spéciale.",
}

type GiftCardOffer = {
    productId: string
    priceId: string
    name: string
    description?: string | null
    amountCents: number
    currency: string
}

async function getGiftCardOffers(): Promise<GiftCardOffer[]> {
    const prices = await stripe.prices.list({
        active: true,
        expand: ["data.product"],
        limit: 50,
    })

    const offers: GiftCardOffer[] = []

    for (const price of prices.data) {
        const product = price.product

        if (typeof product === "string" || !price.unit_amount) continue

        console.log("[GIFT_PAGE] check product", product.id, product.metadata)

        if ((product.metadata as any)?.type !== "gift_card") continue

        offers.push({
            productId: product.id,
            priceId: price.id,
            name: product.name,
            description: product.description,
            amountCents: price.unit_amount,
            currency: price.currency ?? "eur",
        })
    }

    offers.sort((a, b) => a.amountCents - b.amountCents)

    return offers
}

export default async function GiftCardsPage() {
    const offers = await getGiftCardOffers()

    return (
        <main className="relative min-h-screen bg-gradient-to-b from-[#1a1d24] via-[#0d0f12] to-[#08090b] text-white overflow-hidden">


            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),transparent_70%),radial-gradient(circle_at_bottom,_rgba(255,0,0,0.10),transparent_70%)]" />

            <section className="relative py-20 px-6">
                <div className="relative max-w-5xl mx-auto">

                    <div className="text-center mb-12">

                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r text-white text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Cartes cadeaux movi-lab
                        </h1>

                        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                            Faites plaisir à un proche : offrez une analyse haute performance movi-lab.
                            Un cadeau unique, utile et 100% personnalisé. 🎁
                        </p>
                    </div>

                    {/* Cards */}
                    {offers.length === 0 ? (
                        <div className="text-center text-gray-400 border border-dashed border-gray-700 rounded-3xl py-16 px-6">
                            Aucune carte cadeau n&apos;est disponible pour le moment.
                        </div>
                    ) : (
                        <GiftCardsClient offers={offers} />
                    )}

                    <p className="mt-8 text-xs text-gray-500 text-center max-w-md mx-auto">
                        Utilisable en une ou plusieurs fois, jusqu'à épuisement du solde 🎁.
                    </p>
                </div>
            </section>
        </main>
    )
}