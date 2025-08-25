"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, CalendarPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Données mockées
const mockClients = [
    { id: 1, name: "Jean Dupont", email: "jean.dupont@email.com" },
    { id: 2, name: "Marie Martin", email: "marie.martin@email.com" },
    { id: 3, name: "Pierre Durand", email: "pierre.durand@email.com" },
    { id: 4, name: "Sophie Bernard", email: "sophie.bernard@email.com" },
]

const services = [
    { id: 1, name: "M-Starter", price: 119, duration: 60 },
    { id: 2, name: "M-Pacer", price: 139, duration: 90 },
    { id: 3, name: "M-Finisher", price: 159, duration: 120 },
]

export default function NewAppointmentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        clientId: "",
        serviceId: "",
        date: "",
        time: "",
        notes: "",
        paymentStatus: "En attente",
    })

    const selectedService = services.find((s) => s.id.toString() === formData.serviceId)

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulation d'une sauvegarde
        setTimeout(() => {
            setLoading(false)
            alert("Rendez-vous créé avec succès !")
            router.push("/admin/appointments")
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/appointments">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <CalendarPlus className="w-6 h-6 text-orange-600" />
                                Nouveau Rendez-vous
                            </h1>
                            <p className="text-gray-600">Planifier un nouveau rendez-vous client</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations du rendez-vous */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Détails du rendez-vous</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="client">Client *</Label>
                                    <Select onValueChange={(value) => handleInputChange("clientId", value)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockClients.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.name} - {client.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="service">Service *</Label>
                                    <Select onValueChange={(value) => handleInputChange("serviceId", value)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {services.map((service) => (
                                                <SelectItem key={service.id} value={service.id.toString()}>
                                                    {service.name} - {service.price}€ ({service.duration}min)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date">Date *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleInputChange("date", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="time">Heure *</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => handleInputChange("time", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="paymentStatus">Statut de paiement</Label>
                                <Select
                                    value={formData.paymentStatus}
                                    onValueChange={(value) => handleInputChange("paymentStatus", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="En attente">En attente</SelectItem>
                                        <SelectItem value="Payé">Payé</SelectItem>
                                        <SelectItem value="Remboursé">Remboursé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                    placeholder="Notes sur le rendez-vous, préparation spéciale, remarques..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Récapitulatif */}
                    {selectedService && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Service:</span>
                                        <p className="font-medium">{selectedService.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Prix:</span>
                                        <p className="font-medium">{selectedService.price}€</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Durée:</span>
                                        <p className="font-medium">{selectedService.duration} minutes</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Statut:</span>
                                        <p className="font-medium">{formData.paymentStatus}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/appointments">
                            <Button variant="outline">Annuler</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                            {loading ? (
                                "Enregistrement..."
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Planifier
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
