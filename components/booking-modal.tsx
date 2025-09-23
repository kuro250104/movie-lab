"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"          // 👈 ajout
import { Calendar, Check, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "Pas de commentaire.",            // 👈 valeur par défaut
    })

    // ----- RULES (business opening hours, lead time, etc.) -----
    const RULES = {
        openingHours: {
            // 0=Dimanche, 1=Lundi, ... 6=Samedi
            1: [],
            2: [],
            3: [],
            4: [],
            5: [["14:00","17:00"]],
            6: [["09:00","12:00"]],
            0: [],
        } as Record<number, string[][]>,
        minLeadHours: 12,
        maxAdvanceDays: 60,
        bufferMinutes: 60,
        blackoutDates: new Set<string>([
            // "2025-12-25"
        ]),
    }

    // ----- Time helpers -----
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

    // ----- Availability state -----
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
            if (formData.appointmentTime && (!all.includes(formData.appointmentTime) || taken.includes(formData.appointmentTime))) {
                setFormData(prev => ({ ...prev, appointmentTime: "" }))
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

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const buildStartsAtWithOffset = (date: string, time: string) => {
        const local = new Date(`${date}T${time}:00`)
        const offsetMin = -local.getTimezoneOffset()
        const sign = offsetMin >= 0 ? "+" : "-"
        const hh = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, "0")
        const mm = String(Math.abs(offsetMin) % 60).padStart(2, "0")
        return `${date}T${time}:00${sign}${hh}:${mm}`
    }

    const handleSubmit = async () => {
        const requiredFields = ["firstName", "lastName", "email", "appointmentDate", "appointmentTime"]
        const missing = requiredFields.filter((f) => !formData[f as keyof typeof formData])
        if (missing.length > 0) {
            alert("Veuillez remplir tous les champs obligatoires.")
            return
        }

        // Final validation against business rules and availability
        if (!isDateAllowed(formData.appointmentDate)) {
            alert("La date choisie n'est pas disponible.")
            return
        }
        const allSlots = buildSlotsForDate(formData.appointmentDate, selectedService.duration_minutes)
        if (!allSlots.includes(formData.appointmentTime) || takenSlots.has(formData.appointmentTime)) {
            alert("Le créneau choisi n'est plus disponible. Merci d'en sélectionner un autre.")
            return
        }

        setLoading(true)
        try {
            const startsAt = buildStartsAtWithOffset(formData.appointmentDate, formData.appointmentTime)

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone || null,
                serviceId: selectedService.id,
                startsAt,                       // ex: "2025-09-20T10:00:00+02:00"
                notes: formData.notes?.trim() || "Pas de commentaire.",   // 👈 envoyé à l’API
            }

            const response = await fetch("/api/public/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                let msg = "Erreur lors de l'envoi du formulaire"
                try {
                    const errorData = await response.json()
                    msg = errorData?.error ?? msg
                    console.error("Erreur API:", errorData)
                } catch {}
                throw new Error(msg)
            }

            alert("Votre réservation a bien été enregistrée !")
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                appointmentDate: "",
                appointmentTime: "",
                notes: "Pas de commentaire.",         // 👈 reset par défaut
            })
            setStep(1)
            onClose()
        } catch (err: any) {
            console.error("Erreur soumission formulaire:", err)
            alert(err.message || "Erreur lors de l’envoi du formulaire.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        Réserver votre séance {selectedService.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-center my-6 space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    step >= s ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
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
                                    <Label htmlFor="firstName">Prénom *</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Nom *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes (optionnel)</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                    placeholder="Écrivez un message pour le coach…"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={() => setStep(2)} className="bg-orange-600 hover:bg-orange-700">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="appointmentDate">Date *</Label>
                                    <Input
                                        id="appointmentDate"
                                        type="date"
                                        value={formData.appointmentDate}
                                        onChange={async (e) => {
                                            const v = e.target.value
                                            handleInputChange("appointmentDate", v)
                                            if (!isDateAllowed(v)) {
                                                setSlots([])
                                                setTakenSlots(new Set())
                                                setFormData(prev => ({ ...prev, appointmentTime: "" }))
                                                return
                                            }
                                            await refreshSlots(v)
                                        }}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                        className={!formData.appointmentDate || isDateAllowed(formData.appointmentDate) ? "" : "border-red-500"}
                                    />
                                    {formData.appointmentDate && !isDateAllowed(formData.appointmentDate) && (
                                        <p className="text-xs text-red-600 mt-1">Date indisponible (jour fermé, délai minimum, ou trop lointain).</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        * Règles: délai min {RULES.minLeadHours}h, avance max {RULES.maxAdvanceDays} jours, week-end fermé.
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="appointmentTime">Heure *</Label>
                                    <Select
                                        value={formData.appointmentTime}
                                        onValueChange={(value) => handleInputChange("appointmentTime", value)}
                                        disabled={loadingSlots || slots.length === 0}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingSlots ? "Chargement..." : "Choisir un créneau"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {slots.map((time) => (
                                                <SelectItem
                                                    key={time}
                                                    value={time}
                                                    disabled={(Array.isArray(takenSlots) ? takenSlots : []).includes(time)}
                                                >
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {slots.length === 0 && !loadingSlots && (
                                        <p className="text-sm text-gray-500 mt-1">Aucun créneau disponible pour cette date.</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Retour
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                    disabled={!formData.appointmentDate || !formData.appointmentTime || !isDateAllowed(formData.appointmentDate)}
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
                            <h3 className="text-xl font-semibold text-gray-900">Récapitulatif</h3>
                            <div className="bg-gray-50 p-6 rounded-xl space-y-2">
                                <p><strong>Service :</strong> {selectedService.name}</p>
                                <p><strong>Prix :</strong> {selectedService.price} €</p>
                                <p><strong>Durée :</strong> {selectedService.duration_minutes} minutes</p>
                                <p><strong>Date :</strong> {formData.appointmentDate}</p>
                                <p><strong>Heure :</strong> {formData.appointmentTime}</p>
                                <p><strong>Notes :</strong> {formData.notes || "Pas de commentaire."}</p> {/* 👈 recap */}
                            </div>
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(2)}>
                                    Retour
                                </Button>
                                <Button onClick={handleSubmit} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                                    {loading ? "Envoi..." : "Confirmer"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}