"use client"
import { useState } from "react"
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

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Construit un ISO avec le décalage local (+02:00, etc.)
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

                            {/* 👇 Nouvelle zone Notes */}
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
                                        onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="appointmentTime">Heure *</Label>
                                    <Select
                                        value={formData.appointmentTime}
                                        onValueChange={(value) => handleInputChange("appointmentTime", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un créneau" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Retour
                                </Button>
                                <Button onClick={() => setStep(3)} className="bg-orange-600 hover:bg-orange-700">
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