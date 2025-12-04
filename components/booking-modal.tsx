"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Euro, User, MapPin, Mail, Phone, Check, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Supplement = {
    id: number
    name: string
    description?: string | null
    price: number
    is_active: boolean
}
type SupplementId = number

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    selectedService: {
        id: number
        name: string
        price: number
        duration_minutes: number
    }
}

function normalizePhoneFR(raw: string): string {
    if (!raw) return ""

    let p = raw.replace(/[^0-9+]/g, "")

    if (p.startsWith("+33") && p.length >= 4) {
        return p
    }

    if (p.startsWith("0") && p.length === 10) {
        return "+33" + p.slice(1)
    }

    if (p.startsWith("33") && p.length === 11) {
        return "+" + p
    }

    if (!p.startsWith("+") && p.length === 9) {
        return "+33" + p
    }

    return p
}

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [loading, setLoading] = useState(false) // utilisé aussi pour le paiement

    const [formData, setFormData] = useState({
        // perso
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        // rendez-vous
        appointmentDate: "",
        appointmentTime: "",
        notes: "Pas de commentaire.",
        // UI only
        selectedSupplements: [] as SupplementId[],
    })

    // ---------- SUPPLÉMENTS ----------
    const [supplements, setSupplements] = useState<Supplement[]>([])
    const [loadingSupps, setLoadingSupps] = useState(false)
    const [suppsError, setSuppsError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoadingSupps(true)
            setSuppsError(null)
            try {
                const res = await fetch(`/api/services/supplements/${selectedService.id}`, { cache: "no-store" })
                if (!res.ok) throw new Error("Failed to load supplements")
                const rows = (await res.json()) as Supplement[]

                if (!cancelled) {
                    const normalized = (Array.isArray(rows) ? rows : [])
                        .filter((s) => s.is_active)
                        .map((s) => ({
                            ...s,
                            id: Number(s.id),
                            price: Number(s.price) || 0,
                        }))
                    setSupplements(normalized)
                }
            } catch (e: any) {
                if (!cancelled) {
                    setSupplements([])
                    setSuppsError(e?.message ?? "Erreur chargement suppléments")
                }
            } finally {
                if (!cancelled) setLoadingSupps(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [selectedService.id])

    // ---------- RÈGLES OUVERTURE ----------
    const RULES = {
        // 0=dim, 1=lun
        openingHours: {
            6: [["09:00", "13:00"]],
        } as Record<number, string[][]>,
        minLeadHours: 12,
        maxAdvanceDays: 60,
        bufferMinutes: 60,
        blackoutDates: new Set<string>([]),
    }

    // ---------- HELPERS TEMPS ----------
    const toMinutes = (hhmm: string) => {
        const [h, m] = hhmm.split(":").map(Number)
        return h * 60 + (m || 0)
    }
    const fromMinutes = (min: number) => {
        const h = Math.floor(min / 60)
        const m = min % 60
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    }
    const isDateAllowed = (dateStr: string) => {
        if (!dateStr) return false
        if (RULES.blackoutDates.has(dateStr)) return false
        const d = new Date(`${dateStr}T00:00:00`)
        const dow = d.getDay()
        const ranges = RULES.openingHours[dow] ?? []
        if (!ranges.length) return false
        const now = new Date()
        const minAllowed = new Date(now.getTime() + RULES.minLeadHours * 60 * 60 * 1000)
        if (new Date(`${dateStr}T23:59:59`) < minAllowed) return false
        const maxAdvance = new Date()
        maxAdvance.setDate(maxAdvance.getDate() + RULES.maxAdvanceDays)
        if (d > maxAdvance) return false
        return true
    }

    const buildSlotsForDate = (dateStr: string, durationMin: number) => {
        if (!isDateAllowed(dateStr)) return []
        const d = new Date(`${dateStr}T00:00:00`)
        const dow = d.getDay()
        const ranges = RULES.openingHours[dow] ?? []
        const slots: string[] = []
        const now = new Date()
        for (const [start, end] of ranges) {
            const startMin = toMinutes(start)
            const endMin = toMinutes(end)
            let t = startMin
            while (t + durationMin <= endMin) {
                const slot = fromMinutes(t)
                const slotDT = new Date(`${dateStr}T${slot}:00`)
                if (slotDT.getTime() >= now.getTime() + RULES.minLeadHours * 60 * 60 * 1000) {
                    slots.push(slot)
                }
                t += Math.max(5, RULES.bufferMinutes)
            }
        }
        return slots
    }

    const [slots, setSlots] = useState<string[]>([])
    const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set())
    const [loadingSlots, setLoadingSlots] = useState(false)

    const refreshSlots = async (dateStr: string) => {
        setLoadingSlots(true)
        try {
            const all = buildSlotsForDate(dateStr, selectedService.duration_minutes)
            let taken: string[] = []
            try {
                const res = await fetch(`/api/public/availability?date=${dateStr}&serviceId=${selectedService.id}`)
                if (res.ok) {
                    const data = await res.json()
                    taken = Array.isArray(data?.taken) ? data.taken : []
                }
            } catch {}
            setTakenSlots(new Set(taken))
            setSlots(all)
            // reset si slot plus dispo
            if (
                formData.appointmentTime &&
                (!all.includes(formData.appointmentTime) || taken.includes(formData.appointmentTime))
            ) {
                setFormData((prev) => ({ ...prev, appointmentTime: "" }))
            }
        } finally {
            setLoadingSlots(false)
        }
    }

    // (Optional) reload slots if service changes while a date is selected
    useEffect(() => {
        if (formData.appointmentDate) {
            refreshSlots(formData.appointmentDate)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedService.id, selectedService.duration_minutes])

    // ---------- FORM HELPERS ----------
    const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }
    const toggleSupplement = (id: SupplementId) => {
        setFormData((prev) => ({
            ...prev,
            selectedSupplements: prev.selectedSupplements.includes(id)
                ? prev.selectedSupplements.filter((x) => x !== id)
                : [...prev.selectedSupplements, id],
        }))
    }

    const servicePrice = Number(selectedService.price) || 0
    const supplementsTotal = formData.selectedSupplements
        .map((id) => {
            const s = supplements.find((x) => x.id === id)
            return Number(s?.price) || 0
        })
        .reduce((a, b) => a + b, 0)

    const total = servicePrice + supplementsTotal

    const formatEUR = (n: number) =>
        new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number.isFinite(n) ? n : 0)

    // ---------- SUBMIT + STRIPE ----------
    const buildStartsAtWithOffset = (date: string, time: string) => {
        const local = new Date(`${date}T${time}:00`)
        const offsetMin = -local.getTimezoneOffset()
        const sign = offsetMin >= 0 ? "+" : "-"
        const hh = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, "0")
        const mm = String(Math.abs(offsetMin) % 60).padStart(2, "0")
        return `${date}T${time}:00${sign}${hh}:${mm}`
    }

    const handleSubmit = async () => {
        const required = ["firstName", "lastName", "email", "phone", "appointmentDate", "appointmentTime"] as const
        const missing = required.filter((k) => !formData[k])
        if (missing.length) {
            alert("Veuillez remplir tous les champs obligatoires.")
            return
        }

        if (!isDateAllowed(formData.appointmentDate)) {
            alert("La date choisie n'est pas disponible.")
            return
        }
        const allSlots = buildSlotsForDate(formData.appointmentDate, selectedService.duration_minutes)
        if (!allSlots.includes(formData.appointmentTime) || takenSlots.has(formData.appointmentTime)) {
            alert("Le créneau choisi n'est plus disponible. Merci d'en sélectionner un autre.")
            return
        }

        const phoneE164 = normalizePhoneFR(formData.phone)
        if (!phoneE164.startsWith("+33")) {
            console.warn("[BOOKING] téléphone non reconnu comme FR", { raw: formData.phone, phoneE164 })
            alert("Le numéro de téléphone semble invalide.")
            // si tu veux être strict, tu peux `return` ici
            // return
        }

        setLoading(true)
        try {
            const startsAt = buildStartsAtWithOffset(formData.appointmentDate, formData.appointmentTime)

            // 🔥 On ne crée PLUS la réservation ici
            // On construit juste le payload qu'on ENVOIE à Stripe
            const bookingPayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: phoneE164 || null,
                serviceId: selectedService.id,
                startsAt,
                notes: formData.notes?.trim() || "Pas de commentaire.",
                supplementIds: formData.selectedSupplements,
            }

            const stripeResp = await fetch("/api/payment/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingPayload,          // 🔥 tout ce qu’on envoyait avant à /api/public/booking
                    totalAmount: total,      // service + suppléments
                    title: selectedService.name,
                }),
            })

            if (!stripeResp.ok) {
                console.error("Erreur Stripe checkout:", await stripeResp.text())
                alert(
                    "Une erreur est survenue lors du démarrage du paiement en ligne. Merci de réessayer dans quelques instants."
                )
                return
            }

            const stripeData = await stripeResp.json()

            if (stripeData?.url) {
                // 🔥 Redirection vers Stripe Checkout
                window.location.href = stripeData.url
                return
            } else {
                console.error("Pas d'URL Stripe retournée", stripeData)
                alert(
                    "Impossible de démarrer le paiement en ligne pour le moment. Merci de réessayer plus tard."
                )
            }
        } catch (e: any) {
            console.error(e)
            alert(e?.message || "Erreur lors de l’envoi du formulaire.")
        } finally {
            setLoading(false)
        }
    }

    const canGoStep2 = !!(
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.address
    )
    const canGoStep3 = !!(
        formData.appointmentDate &&
        formData.appointmentTime &&
        isDateAllowed(formData.appointmentDate)
    )

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        Réserver — {selectedService.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-center my-6 space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step >= (s as 1 | 2 | 3) ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">Vos informations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Prénom *
                                    </Label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Nom *</Label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email *
                                    </Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Téléphone *
                                    </Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Adresse *
                                </Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Notes (optionnel)</Label>
                                <Textarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                    placeholder="Information supplémentaire…"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!canGoStep2}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    Continuer <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">Choisir la date et l'heure</h3>

                            {/* Rappel service */}
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-900 mb-1">{selectedService.name}</h4>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {selectedService.duration_minutes} minutes
                                            </div>
                                            <div className="flex items-center gap-1 font-bold text-orange-600">
                                                <Euro className="w-4 h-4" />
                                                {formatEUR(servicePrice)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Date *</Label>
                                    <Input
                                        type="date"
                                        value={formData.appointmentDate}
                                        onChange={async (e) => {
                                            const v = e.target.value
                                            handleInputChange("appointmentDate", v)
                                            if (!isDateAllowed(v)) {
                                                setSlots([])
                                                setTakenSlots(new Set())
                                                handleInputChange("appointmentTime", "")
                                                return
                                            }
                                            await refreshSlots(v)
                                        }}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                        className={
                                            !formData.appointmentDate || isDateAllowed(formData.appointmentDate)
                                                ? ""
                                                : "border-red-500"
                                        }
                                    />
                                    {formData.appointmentDate && !isDateAllowed(formData.appointmentDate) && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Date indisponible (jour fermé, délai mini ou trop lointain).
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Heure *</Label>
                                    <Select
                                        value={formData.appointmentTime}
                                        onValueChange={(v) => handleInputChange("appointmentTime", v)}
                                        disabled={loadingSlots || slots.length === 0}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={loadingSlots ? "Chargement..." : "Choisir un créneau"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {slots.map((time) => (
                                                <SelectItem key={time} value={time} disabled={takenSlots.has(time)}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {slots.length === 0 && !loadingSlots && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Aucun créneau disponible pour cette date.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="text-xs text-gray-500">
                                * Règles: délai min {RULES.minLeadHours}h • avance max {RULES.maxAdvanceDays} jours.
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Retour
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                    disabled={!canGoStep3}
                                >
                                    Continuer <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">
                                Options supplémentaires (facultatif)
                            </h3>

                            {suppsError && <p className="text-sm text-red-600">{suppsError}</p>}
                            {loadingSupps && <p className="text-sm text-gray-600">Chargement des options…</p>}

                            <div className="space-y-3">
                                {!loadingSupps && supplements.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        Aucun supplément proposé pour ce service.
                                    </p>
                                ) : (
                                    supplements.map((s) => {
                                        const idNum = Number(s.id)
                                        const checked = formData.selectedSupplements.includes(idNum)
                                        return (
                                            <button
                                                key={idNum}
                                                type="button"
                                                onClick={() => toggleSupplement(idNum)}
                                                className={[
                                                    "group relative w-full text-left rounded-xl border p-4 transition",
                                                    "bg-white shadow-sm hover:shadow-md",
                                                    checked
                                                        ? "border-orange-300 ring-1 ring-orange-200 bg-orange-50"
                                                        : "border-gray-200 hover:border-gray-300",
                                                ].join(" ")}
                                            >
                        <span
                            className={[
                                "absolute left-0 top-0 h-full w-1 rounded-l-xl transition",
                            ].join(" ")}
                        />

                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="pr-2">
                                                        <div className="flex items-center gap-2">
                              <span
                                  className={[
                                      "inline-flex h-5 w-5 items-center justify-center rounded-full border text-white text-[11px]",
                                      checked
                                          ? "bg-orange-600 border-orange-600"
                                          : "bg-gray-200 border-gray-300",
                                  ].join(" ")}
                              >
                                {checked ? "✓" : ""}
                              </span>
                                                            <span className="font-semibold text-gray-900">{s.name}</span>
                                                        </div>
                                                        {s.description && (
                                                            <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                                                        )}
                                                    </div>

                                                    <span className="shrink-0 rounded-full border px-3 py-1 text-sm font-medium text-orange-600 border-orange-200 bg-orange-50">
                            +{formatEUR(Number(s.price) || 0)}
                          </span>
                                                </div>
                                            </button>
                                        )
                                    })
                                )}
                            </div>

                            <Separator />

                            {/* Récapitulatif */}
                            <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Service :</span>
                                    <span className="font-medium">
                    {selectedService.name} — {formatEUR(servicePrice)}
                  </span>
                                </div>
                                {formData.selectedSupplements.map((id) => {
                                    const s = supplements.find((x) => x.id === id)
                                    if (!s) return null
                                    return (
                                        <div key={id} className="flex justify-between">
                                            <span>{s.name} :</span>
                                            <span className="font-medium">
                        +{formatEUR(Number(s.price) || 0)}
                      </span>
                                        </div>
                                    )
                                })}
                                <Separator />
                                <div className="flex justify-between text-lg font-bold text-orange-600">
                                    <span>Total estimé :</span>
                                    <span>{formatEUR(total)}</span>
                                </div>

                                <div className="pt-2 text-xs text-gray-500">
                                    * Le total inclura les options choisies, mentionnées dans vos notes pour le coach.
                                </div>
                            </div>

                            {/* Mini récap infos/rdv */}
                            <div className="bg-gray-50 p-6 rounded-lg space-y-1">
                                <div>
                                    <strong>Nom :</strong> {formData.firstName} {formData.lastName}
                                </div>
                                <div>
                                    <strong>Contact :</strong> {formData.email}
                                    {formData.phone ? ` • ${formData.phone}` : ""}
                                </div>
                                <div>
                                    <strong>Date :</strong> {formData.appointmentDate} •{" "}
                                    <strong>Heure :</strong> {formData.appointmentTime}
                                </div>
                                <div>
                                    <strong>Notes :</strong> {formData.notes || "Pas de commentaire."}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(2)}>
                                    Retour
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    {loading ? "Redirection vers le paiement..." : "Confirmer et payer en ligne"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}