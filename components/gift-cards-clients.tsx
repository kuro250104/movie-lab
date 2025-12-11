"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type GiftCardOffer = {
    productId: string
    priceId: string
    name: string
    description?: string | null
    amountCents: number
    currency: string
}

type Props = {
    offers: GiftCardOffer[]
}

export function GiftCardsClient({ offers }: Props) {
    const [isPending, startTransition] = useTransition()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedOffer, setSelectedOffer] = useState<GiftCardOffer | null>(null)

    // Emails
    const [buyerEmail, setBuyerEmail] = useState("")
    const [recipientEmail, setRecipientEmail] = useState("")

    // Infos facture
    const [buyerFirstName, setBuyerFirstName] = useState("")
    const [buyerLastName, setBuyerLastName] = useState("")
    const [buyerCompany, setBuyerCompany] = useState("")
    const [buyerVatNumber, setBuyerVatNumber] = useState("")
    const [buyerAddress, setBuyerAddress] = useState("")
    const [buyerAddressComplement, setBuyerAddressComplement] = useState("")
    const [buyerPostalCode, setBuyerPostalCode] = useState("")
    const [buyerCity, setBuyerCity] = useState("")
    const [buyerCountry, setBuyerCountry] = useState("FR")

    const [error, setError] = useState<string | null>(null)

    const formatPrice = (amountCents: number, currency: string) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: currency.toUpperCase(),
            maximumFractionDigits: 0,
        }).format(amountCents / 100)
    }

    const resetForm = () => {
        setBuyerEmail("")
        setRecipientEmail("")

        setBuyerFirstName("")
        setBuyerLastName("")
        setBuyerCompany("")
        setBuyerVatNumber("")
        setBuyerAddress("")
        setBuyerAddressComplement("")
        setBuyerPostalCode("")
        setBuyerCity("")
        setBuyerCountry("FR")

        setError(null)
    }

    const openModal = (offer: GiftCardOffer) => {
        setSelectedOffer(offer)
        resetForm()
        setIsDialogOpen(true)
    }

    const handleConfirm = () => {
        if (!selectedOffer) return

        // validations basiques
        if (!buyerEmail.trim()) {
            setError("Merci de renseigner votre adresse e-mail.")
            return
        }

        const basicEmailRegex = /\S+@\S+\.\S+/
        if (!basicEmailRegex.test(buyerEmail.trim())) {
            setError("L'adresse e-mail saisie ne semble pas valide.")
            return
        }

        if (!buyerFirstName.trim() || !buyerLastName.trim()) {
            setError("Merci de renseigner votre nom et prénom pour la facture.")
            return
        }

        if (!buyerAddress.trim() || !buyerPostalCode.trim() || !buyerCity.trim()) {
            setError("Merci de renseigner votre adresse complète (adresse, code postal, ville).")
            return
        }

        const finalRecipientEmail = recipientEmail.trim() || buyerEmail.trim()

        setError(null)

        startTransition(async () => {
            try {
                const res = await fetch("/api/gift-cards/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        // Stripe / offre
                        priceId: selectedOffer.priceId,
                        amountCents: selectedOffer.amountCents,
                        currency: selectedOffer.currency,

                        // Emails
                        buyerEmail: buyerEmail.trim(),
                        recipientEmail: finalRecipientEmail,

                        // Facturation
                        buyerFirstName: buyerFirstName.trim(),
                        buyerLastName: buyerLastName.trim(),
                        buyerCompany: buyerCompany.trim() || null,
                        buyerVatNumber: buyerVatNumber.trim() || null,
                        buyerAddress: buyerAddress.trim(),
                        buyerAddressComplement: buyerAddressComplement.trim() || null,
                        buyerPostalCode: buyerPostalCode.trim(),
                        buyerCity: buyerCity.trim(),
                        buyerCountry: buyerCountry.trim() || "FR",
                    }),
                })

                if (!res.ok) {
                    console.error("Erreur checkout", await res.text())
                    setError("Une erreur est survenue lors de la création du paiement.")
                    return
                }

                const data = await res.json()
                if (data.url) {
                    window.location.href = data.url
                } else {
                    setError("Impossible de rediriger vers la page de paiement.")
                }
            } catch (e) {
                console.error(e)
                setError("Erreur réseau lors de la création du paiement.")
            }
        })
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-3">
                {offers.map((offer) => (
                    <div
                        key={offer.priceId}
                        className="relative flex flex-col rounded-3xl border border-orange-500/30 bg-gradient-to-br from-gray-900 to-black shadow-2xl overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#f9731640,_transparent_60%)] pointer-events-none" />

                        <div className="relative p-6 flex-1 flex flex-col gap-4">
                            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-300 bg-orange-500/15 rounded-full px-3 py-1">
                                <Gift className="w-3 h-3" />
                                Carte cadeau
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-1">{offer.name}</h2>
                                {offer.description && (
                                    <p className="text-sm text-gray-300 line-clamp-3">
                                        {offer.description}
                                    </p>
                                )}
                            </div>

                            <div className="mt-auto pt-2 flex items-end justify-between gap-3">
                                <div>
                                    <div className="text-3xl font-extrabold text-orange-400">
                                        {formatPrice(offer.amountCents, offer.currency)}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Utilisable en une ou plusieurs fois
                                    </p>
                                </div>

                                <Button
                                    onClick={() => openModal(offer)}
                                    disabled={isPending && selectedOffer?.priceId === offer.priceId}
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl px-4 py-2 text-sm shadow-lg"
                                >
                                    {isPending && selectedOffer?.priceId === offer.priceId
                                        ? "Redirection..."
                                        : "Acheter"}
                                    {!isPending && <ArrowRight className="ml-1 w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal e-mails + facturation */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg bg-gray-950 border border-orange-500/40 text-white">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedOffer
                                ? `Offrir ${formatPrice(selectedOffer.amountCents, selectedOffer.currency)}`
                                : "Offrir une carte cadeau"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Indiquez vos informations pour la facture ainsi que les e-mails de réception.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-2 max-h-[75vh] overflow-y-auto pr-1">
                        {/* Emails */}
                        <div className="space-y-1.5">
                            <Label htmlFor="buyerEmail">Votre e-mail (facture / confirmation) *</Label>
                            <Input
                                id="buyerEmail"
                                type="email"
                                value={buyerEmail}
                                onChange={(e) => setBuyerEmail(e.target.value)}
                                className="bg-black/40 border-gray-700 text-white"
                                placeholder="vous@example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="recipientEmail">E-mail du bénéficiaire (optionnel)</Label>
                            <Input
                                id="recipientEmail"
                                type="email"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                className="bg-black/40 border-gray-700 text-white"
                                placeholder="ami.e@example.com (sinon envoyé à votre adresse)"
                            />
                        </div>

                        {/* Identité */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="buyerLastName">Nom *</Label>
                                <Input
                                    id="buyerLastName"
                                    value={buyerLastName}
                                    onChange={(e) => setBuyerLastName(e.target.value)}
                                    className="bg-black/40 border-gray-700 text-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="buyerFirstName">Prénom *</Label>
                                <Input
                                    id="buyerFirstName"
                                    value={buyerFirstName}
                                    onChange={(e) => setBuyerFirstName(e.target.value)}
                                    className="bg-black/40 border-gray-700 text-white"
                                />
                            </div>
                        </div>

                        {/* Société (optionnel) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="buyerCompany">Société (optionnel)</Label>
                            <Input
                                id="buyerCompany"
                                value={buyerCompany}
                                onChange={(e) => setBuyerCompany(e.target.value)}
                                className="bg-black/40 border-gray-700 text-white"
                                placeholder="Nom de l'entreprise"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="buyerVatNumber">N° de TVA (optionnel)</Label>
                            <Input
                                id="buyerVatNumber"
                                value={buyerVatNumber}
                                onChange={(e) => setBuyerVatNumber(e.target.value)}
                                className="bg-black/40 border-gray-700 text-white"
                                placeholder="FRXX999999999"
                            />
                        </div>

                        {/* Adresse */}
                        <div className="space-y-1.5">
                            <Label htmlFor="buyerAddress">Adresse *</Label>
                            <Input
                                id="buyerAddress"
                                value={buyerAddress}
                                onChange={(e) => setBuyerAddress(e.target.value)}
                                className="bg-black/40 border-gray-700 text-white"
                                placeholder="Numéro et rue"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="buyerAddressComplement">Complément d'adresse (optionnel)</Label>
                            <Input
                                id="buyerAddressComplement"
                                value={buyerAddressComplement}
                                onChange={(e) => setBuyerAddressComplement(e.target.value)}
                                className="bg-black/40 border-gray-700 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="buyerPostalCode">Code postal *</Label>
                                <Input
                                    id="buyerPostalCode"
                                    value={buyerPostalCode}
                                    onChange={(e) => setBuyerPostalCode(e.target.value)}
                                    className="bg-black/40 border-gray-700 text-white"
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="buyerCity">Ville *</Label>
                                <Input
                                    id="buyerCity"
                                    value={buyerCity}
                                    onChange={(e) => setBuyerCity(e.target.value)}
                                    className="bg-black/40 border-gray-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="buyerCountry">Pays *</Label>
                            <Input
                                id="buyerCountry"
                                value={buyerCountry}
                                onChange={(e) => setBuyerCountry(e.target.value)}
                                className="bg-black/40 border-gray-700 text-white"
                                placeholder="FR"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="border-gray-600 text-gray-200 hover:bg-gray-800"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={isPending || !selectedOffer}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                            >
                                {isPending ? "Création du paiement..." : "Continuer vers le paiement"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}