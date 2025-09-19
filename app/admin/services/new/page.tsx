"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Users, Search, Plus, Edit, Trash2, ArrowLeft, Settings, Target} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type Service = {
    id: number
    name: string
    description: string
    price: number
    duration_minutes: number
    is_active: boolean
    color?: string
}
const api = {
    async getServices(): Promise<Service[]> {
        const res = await fetch("/api/admin/services", { credentials: "include" })
        if (!res.ok) throw new Error("Erreur chargement services")
        const rows = await res.json()
        return rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? "",
            price: typeof r.price === "string" ? parseFloat(r.price) : (r.price ?? 0),
            duration_minutes: r.duration_minutes ?? r.durationMinutes ?? 60,
            is_active: Boolean(r.is_active ?? r.isActive ?? r.active),
            color: r.color ?? "bg-gray-500",
        }))
    },

    async createService(payload: Partial<Service>) {
        const body = {
            name: payload.name,
            description: payload.description ?? "",
            price: payload.price ?? 0,
            duration_minutes: payload.duration_minutes ?? 60,
            is_active: payload.is_active ?? true,
            color: payload.color ?? "bg-gray-500",
        }
        const res = await fetch("/api/admin/services", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Création service échouée")
        return this.getServices()
    },

    async updateService(id: number, payload: Partial<Service>) {
        const body = {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            duration_minutes: payload.duration_minutes,
            is_active: payload.is_active,
            color: payload.color,
        }
        const res = await fetch(`/api/admin/services/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Mise à jour service échouée")
        return this.getServices()
    },

    async deleteService(id: number) {
        const res = await fetch(`/api/admin/services/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        if (!res.ok) throw new Error("Suppression service échouée")
    },
}

export default function CoachesServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")

    const [openServiceModal, setOpenServiceModal] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const srv = await api.getServices()
                setServices(srv)
            } catch (e: any) {
                console.error(e)
                setError(e?.message ?? "Erreur inconnue")
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const filteredServices = useMemo(() => {
          const term = searchTerm.trim().toLowerCase()
              return services.filter((s) => {
                    if (!term) return true
                        return (
                             s.name.toLowerCase().includes(term) ||
                             s.description.toLowerCase().includes(term) ||
                              String(s.price).toLowerCase().includes(term) ||
                             String(s.duration_minutes).toLowerCase().includes(term) ||
                             (s.color?.toLowerCase().includes(term) ?? false)
                            )
                      })
            }, [services, searchTerm])

    const openNewService = () => {
        setEditingService({
            id: 0,
            name: "",
            description: "",
            price: 0,
            duration_minutes: 60,
            is_active: true,
            color: "bg-gray-500",
        })
        setOpenServiceModal(true)
    }

    const openEditService = (s: Service) => {
        setEditingService({ ...s })
        setOpenServiceModal(true)
    }

    const saveService = async () => {
        if (!editingService) return
        try {
            setLoading(true)
            if (editingService.id === 0) {
                const updated = await api.createService(editingService)
                setServices(updated)
            } else {
                const updated = await api.updateService(editingService.id, editingService)
                setServices(updated)
            }
            setOpenServiceModal(false)
            setEditingService(null)
        } catch (e: any) {
            alert(e?.message ?? "Erreur sauvegarde service")
        } finally {
            setLoading(false)
        }
    }

    const deleteService = async (id: number) => {
        if (!confirm("Supprimer ce service ?")) return
        try {
            setLoading(true)
            await api.deleteService(id)
            setServices((prev) => prev.filter((s) => s.id !== id))
        } catch (e: any) {
            alert(e?.message ?? "Erreur suppression service")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-orange-600" /> Services
                                </h1>
                                <p className="text-gray-600">
                                    {services.length} services
                                    {loading ? " (chargement…)" : ""}
                                    {error ? ` — ${error}` : ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={openNewService}>
                                <Settings className="w-4 h-4 mr-2" /> Nouveau Service
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Filtres */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Rechercher un service…"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste services */}
                <div className="grid gap-6">
                    {filteredServices.map((s) => (
                        <Card key={s.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{s.name}</h3>
                                                {s.description && <p className="mt-2 text-sm text-gray-600">{s.description}</p>}
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge className={s.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                                    {s.is_active ? "Actif" : "Inactif"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="outline" className={`border ${s.color ?? "bg-gray-100"} text-gray-900`}>
                                                {s.price}€ • {s.duration_minutes} min
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditService(s)}>
                                            <Edit className="w-4 h-4 mr-2" /> Modifier
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 bg-transparent"
                                            onClick={() => deleteService(s.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!filteredServices.length && !loading && (
                    <Card className="mt-6">
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
                            <p className="text-gray-600 mb-4">{searchTerm ? "Modifiez votre recherche" : "Ajoutez votre premier service"}</p>
                            <Button className="bg-orange-600 hover:bg-orange-700" onClick={openNewService}>
                                <Plus className="w-4 h-4 mr-2" /> Ajouter un service
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modal service (create / edit) */}
            <Dialog open={openServiceModal} onOpenChange={setOpenServiceModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingService?.id ? "Modifier le service" : "Nouveau service"}</DialogTitle>
                    </DialogHeader>

                    {editingService && (
                        <div className="space-y-4">
                            {/* Nom */}
                            <div>
                                <Label>Nom du service</Label>
                                <Input
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={editingService.description ?? ""}
                                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                />
                            </div>

                            {/* Prix */}
                            <div>
                                <Label>Prix (€)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={editingService.price}
                                    onChange={(e) =>
                                        setEditingService({
                                            ...editingService,
                                            price: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            {/* Durée */}
                            <div>
                                <Label>Durée (minutes)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={editingService.duration_minutes}
                                    onChange={(e) =>
                                        setEditingService({
                                            ...editingService,
                                            duration_minutes: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            {/* Couleur */}
                            <div>
                                <Label>Couleur (badge)</Label>
                                <Select
                                    value={editingService.color ?? "bg-gray-500"}
                                    onValueChange={(v) => setEditingService({ ...editingService, color: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Couleur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bg-emerald-500">Vert (Bilan)</SelectItem>
                                        <SelectItem value="bg-pink-500">Rose (Nutrition)</SelectItem>
                                        <SelectItem value="bg-indigo-500">Indigo</SelectItem>
                                        <SelectItem value="bg-orange-500">Orange</SelectItem>
                                        <SelectItem value="bg-gray-500">Gris</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Actif */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={editingService.is_active}
                                    onCheckedChange={(ch) => setEditingService({ ...editingService, is_active: Boolean(ch) })}
                                />
                                <Label>Actif</Label>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        {editingService?.id ? (
                            <Button
                                variant="outline"
                                className="text-red-600 mr-auto"
                                onClick={async () => {
                                    try {
                                        await deleteService(editingService.id)
                                        setOpenServiceModal(false)
                                    } catch {}
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </Button>
                        ) : (
                            <div />
                        )}
                        <Button variant="outline" onClick={() => setOpenServiceModal(false)}>
                            Annuler
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={saveService} disabled={loading}>
                            {loading ? "Enregistrement…" : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}