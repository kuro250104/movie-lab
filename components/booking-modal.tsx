"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Euro, User, MapPin, Mail, Phone, Check, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    selectedService: {
        name: string
        price: number
        duration: number
    }
}

const baseServices = [
    {
        id: "pack-initial-initial",
        name: "Pack initial",
        description: "Analyse quantifiée de la course à pied en...",
        price: 99,
        duration: 60,
        unit: "1 heure",
    },
    {
        id: "coaching-running",
        name: "Restitution",
        description: "Conseils personnalisés sur la course à pi...",
        price: 50,
        duration: 40,
        unit: "40 minutes",
    },
]

const supplements = [
    {
        id: "bilan-musculaire",
        name: "Bilan musculaire",
        price: 20,
        options: [
            { value: "none", label: "--sélectionner une option--", price: 0 },
            { value: "basic", label: "Bilan musculaire de base", price: 20 },
            { value: "advanced", label: "Bilan musculaire avancé", price: 35 },
        ],
    },
    {
        id: "bilan-corps-complet",
        name: "Bilan corps complet",
        price: 20,
        options: [
            { value: "none", label: "--sélectionner une option--", price: 0 },
            { value: "standard", label: "Bilan corps standard", price: 20 },
            { value: "premium", label: "Bilan corps premium", price: 40 },
        ],
    },
    {
        id: "bilans-chaussures",
        name: "Bilans des chaussures",
        price: 20,
        options: [
            { value: "none", label: "--sélectionner une option--", price: 0 },
            { value: "analysis", label: "Analyse des chaussures", price: 20 },
            { value: "recommendation", label: "Analyse + recommandations", price: 30 },
        ],
    },
    {
        id: "pas-option",
        name: "Pas d'option complémentaire",
        price: 0,
        options: [
            { value: "none", label: "--sélectionner une option--", price: 0 },
            { value: "no-supplement", label: "Aucun supplément", price: 0 },
        ],
    },
]

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // Informations personnelles
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",

        // Service et date
        baseService: "",
        appointmentDate: "",
        appointmentTime: "",

        // Suppléments
        supplements: {} as Record<string, string>,
    })

    const [loading, setLoading] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSupplementChange = (supplementId: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            supplements: { ...prev.supplements, [supplementId]: value },
        }))
    }

    const calculateTotal = () => {
        const baseServicePrice = baseServices.find((s) => s.id === formData.baseService)?.price || 0
        const supplementsPrice = Object.entries(formData.supplements).reduce((total, [supplementId, optionValue]) => {
            const supplement = supplements.find((s) => s.id === supplementId)
            const option = supplement?.options.find((o) => o.value === optionValue)
            return total + (option?.price || 0)
        }, 0)

        return baseServicePrice + supplementsPrice
    }

    const handleSubmit = async () => {
        setLoading(true)

        // Simulation d'envoi
        setTimeout(() => {
            setLoading(false)
            alert("Demande de réservation envoyée avec succès ! Nous vous contacterons sous 24h.")
            onClose()
            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                baseService: "",
                appointmentDate: "",
                appointmentTime: "",
                supplements: {},
            })
            setStep(1)
        }, 2000)
    }

    const canProceedToStep2 = formData.firstName && formData.lastName && formData.email && formData.phone
    const canProceedToStep3 = formData.baseService && formData.appointmentDate
    const canSubmit = Object.keys(formData.supplements).length > 0

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        Réserver votre séance {selectedService.name}
                    </DialogTitle>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3, 4].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step >= stepNumber ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                                </div>
                                {stepNumber < 4 && (
                                    <ChevronRight className={`w-4 h-4 mx-2 ${step > stepNumber ? "text-orange-600" : "text-gray-400"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Étape 1: Informations personnelles */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vos informations</h3>
                                <p className="text-gray-600">Renseignez vos coordonnées pour la prise de rendez-vous</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Prénom *
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        placeholder="Votre prénom"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Nom *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        placeholder="Votre nom"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        placeholder="votre@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Téléphone *
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        placeholder="06 12 34 56 78"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Adresse
                                </Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    placeholder="Votre adresse complète"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!canProceedToStep2}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    Continuer
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Étape 2: Sélection du service */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sélectionner un service</h3>
                                <p className="text-gray-600">Choisissez le service qui correspond à vos besoins</p>
                            </div>

                            <RadioGroup
                                value={formData.baseService}
                                onValueChange={(value) => handleInputChange("baseService", value)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {baseServices.map((service) => (
                                    <div key={service.id} className="relative">
                                        <RadioGroupItem value={service.id} id={service.id} className="sr-only" />
                                        <Label
                                            htmlFor={service.id}
                                            className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                                formData.baseService === service.id
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-semibold text-lg text-gray-900">{service.name}</h4>
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 ${
                                                        formData.baseService === service.id ? "border-orange-500 bg-orange-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    {formData.baseService === service.id && (
                                                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {service.unit}
                                                </div>
                                                <div className="flex items-center gap-1 font-bold text-lg text-orange-600">
                                                    <Euro className="w-4 h-4" />
                                                    {service.price}
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Retour
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.baseService}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    Continuer
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Étape 3: Date et heure */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choisir une date</h3>
                                <p className="text-gray-600">Sélectionnez votre créneau préféré</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="appointmentDate" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Date souhaitée *
                                    </Label>
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
                                    <Label htmlFor="appointmentTime" className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Heure souhaitée
                                    </Label>
                                    <Select onValueChange={(value) => handleInputChange("appointmentTime", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un créneau" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="09:00">09:00</SelectItem>
                                            <SelectItem value="10:00">10:00</SelectItem>
                                            <SelectItem value="11:00">11:00</SelectItem>
                                            <SelectItem value="14:00">14:00</SelectItem>
                                            <SelectItem value="15:00">15:00</SelectItem>
                                            <SelectItem value="16:00">16:00</SelectItem>
                                            <SelectItem value="17:00">17:00</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(2)}>
                                    Retour
                                </Button>
                                <Button
                                    onClick={() => setStep(4)}
                                    disabled={!canProceedToStep3}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    Continuer
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Étape 4: Suppléments */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Options supplémentaires</h3>
                                <p className="text-gray-600">Personnalisez votre séance avec des options additionnelles</p>
                            </div>

                            <div className="space-y-4">
                                {supplements.map((supplement) => (
                                    <div key={supplement.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-900">{supplement.name}</h4>
                                            {supplement.price > 0 && (
                                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                                    +{supplement.price}€ TTC
                                                </Badge>
                                            )}
                                        </div>
                                        <Select onValueChange={(value) => handleSupplementChange(supplement.id, value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="--sélectionner une option--" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {supplement.options.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center justify-between w-full">
                                                            <span>{option.label}</span>
                                                            {option.price > 0 && (
                                                                <span className="ml-2 text-orange-600 font-medium">+{option.price}€</span>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {/* Récapitulatif */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-4">Récapitulatif de votre réservation</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Service de base:</span>
                                        <span className="font-medium">
                      {baseServices.find((s) => s.id === formData.baseService)?.name} -
                                            {baseServices.find((s) => s.id === formData.baseService)?.price}€
                    </span>
                                    </div>
                                    {Object.entries(formData.supplements).map(([supplementId, optionValue]) => {
                                        const supplement = supplements.find((s) => s.id === supplementId)
                                        const option = supplement?.options.find((o) => o.value === optionValue)
                                        if (!option || option.price === 0) return null
                                        return (
                                            <div key={supplementId} className="flex justify-between">
                                                <span>{option.label}:</span>
                                                <span className="font-medium">+{option.price}€</span>
                                            </div>
                                        )
                                    })}
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold text-orange-600">
                                        <span>Total:</span>
                                        <span>{calculateTotal()}€ TTC</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(3)}>
                                    Retour
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit || loading}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    {loading ? "Envoi en cours..." : "Confirmer la réservation"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
