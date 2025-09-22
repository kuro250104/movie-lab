"use client"

import { useEffect, useMemo, useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, CalendarPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CLIENTS_ENDPOINT = "/api/admin/clients"
const SERVICES_ENDPOINT = "/api/admin/services"
const APPOINTMENTS_ENDPOINT = "/api/admin/appointments"

type Client = { id: number | string; name: string; email: string }
type Service = { id: number | string; name: string; price: number; duration: number }

export default function NewAppointmentPage() {
    const router = useRouter()

    // form state
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        clientId: "",
        serviceId: "",
        date: "",
        time: "",
        notes: "",
        paymentStatus: "En attente" as "En attente" | "Payé" | "Remboursé",
    })

    const [clients, setClients] = useState<Client[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [fetching, setFetching] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        const load = async () => {
            setFetching(true)
            setFetchError(null)
            try {
                const [cRes, sRes] = await Promise.all([
                    fetch(CLIENTS_ENDPOINT, { cache: "no-store" }),
                    fetch(SERVICES_ENDPOINT, { cache: "no-store" }),
                ])
                if (!cRes.ok) throw new Error(`Clients fetch failed (${cRes.status})`)
                if (!sRes.ok) throw new Error(`Services fetch failed (${sRes.status})`)
                const cJson = await cRes.json()
                const sJson = await sRes.json()
                if (!isMounted) return
                setClients(Array.isArray(cJson) ? cJson : [])
                setServices(Array.isArray(sJson) ? sJson : [])
            } catch (err: any) {
                if (!isMounted) return
                setFetchError(err?.message ?? "Erreur de chargement")
                setClients([])
                setServices([])
            } finally {
                if (isMounted) setFetching(false)
            }
        }
        load()
        return () => {
            isMounted = false
        }
    }, [])

    const selectedService = useMemo(
        () => services.find((s) => String(s.id) === formData.serviceId),
        [services, formData.serviceId]
    )

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // simple validation
    const validate = () => {
        if (!formData.clientId) return "Sélectionne un client."
        if (!formData.serviceId) return "Sélectionne un service."
        if (!formData.date) return "Choisis une date."
        if (!formData.time) return "Choisis une heure."
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const err = validate()
        if (err) {
            alert(err)
            return
        }
        setLoading(true)
        try {
            // combine date + time to ISO (local)
            const datetimeLocal = new Date(`${formData.date}T${formData.time}:00`)
            const payload = {
                clientId: Number.isNaN(Number(formData.clientId)) ? formData.clientId : Number(formData.clientId),
                serviceId: Number.isNaN(Number(formData.serviceId)) ? formData.serviceId : Number(formData.serviceId),
                datetime: datetimeLocal.toISOString(), // backend: stocke en UTC
                notes: formData.notes || null,
                paymentStatus: formData.paymentStatus, // "En attente" | "Payé" | "Remboursé"
            }

            const res = await fetch(APPOINTMENTS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const msg = await res.text().catch(() => "")
                throw new Error(msg || `Échec création RDV (${res.status})`)
            }

            alert("Rendez-vous créé avec succès !")
            router.push("/admin/appointments")
        } catch (err: any) {
            alert(err?.message ?? "Erreur lors de la création du rendez-vous")
        } finally {
            setLoading(false)
        }
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
                {/* Erreur de fetch */}
                {fetchError && (
                    <Card className="mb-6 border-red-300 bg-red-50">
                        <CardContent className="py-4 text-sm text-red-700">
                            Erreur de chargement des données: {fetchError}
                        </CardContent>
                    </Card>
                )}

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
                                    <Select
                                        value={formData.clientId}
                                        onValueChange={(value) => handleInputChange("clientId", value)}
                                    >
                                        <SelectTrigger aria-required>
                                            <SelectValue placeholder={fetching ? "Chargement..." : "Sélectionner un client"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={String(client.id)}>
                                                    {client.name} — {client.email}
                                                </SelectItem>
                                            ))}
                                            {!fetching && clients.length === 0 && (
                                                <SelectItem value="__none" disabled>Aucun client</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="service">Service *</Label>
                                    <Select
                                        value={formData.serviceId}
                                        onValueChange={(value) => handleInputChange("serviceId", value)}
                                    >
                                        <SelectTrigger aria-required>
                                            <SelectValue placeholder={fetching ? "Chargement..." : "Sélectionner un service"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {services.map((service) => (
                                                <SelectItem key={service.id} value={String(service.id)}>
                                                    {service.name} — {service.price}€ ({service.duration}min)
                                                </SelectItem>
                                            ))}
                                            {!fetching && services.length === 0 && (
                                                <SelectItem value="__none" disabled>Aucun service</SelectItem>
                                            )}
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
                                    onValueChange={(value) =>
                                        handleInputChange("paymentStatus", value as typeof formData.paymentStatus)
                                    }
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
                                        <span className="text-gray-500">Service :</span>
                                        <p className="font-medium">{selectedService.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Prix :</span>
                                        <p className="font-medium">{selectedService.price}€</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Durée :</span>
                                        <p className="font-medium">{selectedService.duration} minutes</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Statut :</span>
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
                            {loading ? "Enregistrement..." : (
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