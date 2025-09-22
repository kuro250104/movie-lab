"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Settings, Search, Plus, Edit, Trash2, ArrowLeft, Filter, Timer, Euro, PackagePlus
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type Service = {
    id: number
    name: string
    description: string | null
    price: number
    duration_minutes: number
    is_active: boolean
    color?: string | null
}

const COLOR_CHOICES = [
    { val: "bg-emerald-500", label: "Vert (Bilan)" },
    { val: "bg-pink-500", label: "Rose (Nutrition)" },
    { val: "bg-indigo-500", label: "Indigo" },
    { val: "bg-orange-500", label: "Orange" },
    { val: "bg-gray-500", label: "Gris" },
]

const api = {
    async getServices(): Promise<Service[]> {
        const res = await fetch("/api/admin/services", { credentials: "include" })
        if (!res.ok) throw new Error("Erreur API services")
        const rows = await res.json()
        return rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? null,
            price: typeof r.price === "string" ? parseFloat(r.price) : (r.price ?? 0),
            duration_minutes: r.duration_minutes ?? 60,
            is_active: Boolean(r.is_active ?? r.active),
            color: r.color ?? "bg-gray-500",
        }))
    },
    async createService(payload: Partial<Service>) {
        const body = {
            name: payload.name,
            description: payload.description ?? null,
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

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<"Tous" | "Actif" | "Inactif">("Tous")

    const [openModal, setOpenModal] = useState(false)
    const [editing, setEditing] = useState<Service | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const srv = await api.getServices()
                setServices(srv)
            } catch (e: any) {
                setError(e?.message ?? "Erreur inconnue")
                console.error(e)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const getStatusColor = (s: boolean) =>
        s ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return services.filter(s => {
            const match =
                !term ||
                s.name.toLowerCase().includes(term) ||
                (s.description ?? "").toLowerCase().includes(term)
            const filt = filterStatus === "Tous" || (s.is_active ? "Actif" : "Inactif") === filterStatus
            return match && filt
        })
    }, [services, searchTerm, filterStatus])

    const openNew = () => {
        setEditing({
            id: 0,
            name: "",
            description: "",
            price: 0,
            duration_minutes: 60,
            is_active: true,
            color: "bg-gray-500",
        })
        setOpenModal(true)
    }

    const openEdit = (s: Service) => {
        setEditing({ ...s })
        setOpenModal(true)
    }

    const save = async () => {
        if (!editing) return
        try {
            setLoading(true)
            if (editing.id === 0) {
                const updated = await api.createService(editing)
                setServices(updated)
            } else {
                const updated = await api.updateService(editing.id, editing)
                setServices(updated)
            }
            setOpenModal(false)
            setEditing(null)
        } catch (e: any) {
            alert(e?.message ?? "Erreur sauvegarde service")
        } finally {
            setLoading(false)
        }
    }

    const remove = async (id: number) => {
        if (!confirm("Supprimer ce service ?")) return
        try {
            setLoading(true)
            await api.deleteService(id)
            setServices(prev => prev.filter(s => s.id !== id))
        } catch (e: any) {
            alert(e?.message ?? "Erreur suppression service")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
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
                                    <PackagePlus className="w-6 h-6 text-orange-600" /> Services
                                </h1>
                                <p className="text-gray-600">
                                    {filtered.length} services
                                    {loading ? " (chargement…)" : ""}
                                    {error ? ` — ${error}` : ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button className="bg-orange-600 hover:bg-orange-700" onClick={openNew}>
                                <Plus className="w-4 h-4 mr-2" /> Nouveau service
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Rechercher un feu…"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={filterStatus === "Tous" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("Tous")}
                                >
                                    <Filter className="w-4 h-4 mr-2" /> Tous
                                </Button>
                                <Button
                                    size="sm"
                                    variant={filterStatus === "Actif" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("Actif")}
                                >
                                    Actifs
                                </Button>
                                <Button
                                    size="sm"
                                    variant={filterStatus === "Inactif" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("Inactif")}
                                >
                                    Inactifs
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    {filtered.map(s => (
                        <Card key={s.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{s.name}</h3>
                                                {!!s.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                                                )}
                                                <div className="flex gap-2 mt-3">
                                                    <Badge variant="outline" className={`border ${s.color ?? "bg-gray-100"} text-gray-900`}>
                                                        Couleur
                                                    </Badge>
                                                    <Badge className={getStatusColor(s.is_active)}>
                                                        {s.is_active ? "Actif" : "Inactif"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-right min-w-[150px]">
                                                <div className="flex items-center justify-end gap-1 text-gray-700">
                                                    <Euro className="w-4 h-4" />
                                                    <span className="text-lg font-semibold">{Number(s.price).toFixed(0)}€</span>
                                                </div>
                                                <div className="flex items-center justify-end gap-1 text-gray-500">
                                                    <Timer className="w-4 h-4" />
                                                    <span>{s.duration_minutes} min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                                            <Edit className="w-4 h-4 mr-2" /> Modifier
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 bg-transparent"
                                            onClick={() => remove(s.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!filtered.length && !loading && (
                    <Card className="mt-6">
                        <CardContent className="p-12 text-center">
                            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Modifiez votre recherche" : "Créez votre premier service"}
                            </p>
                            <Button className="bg-orange-600 hover:bg-orange-700" onClick={openNew}>
                                <Plus className="w-4 h-4 mr-2" /> Nouveau service
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing?.id ? "Modifier le service" : "Nouveau service"}</DialogTitle>
                    </DialogHeader>

                    {editing && (
                        <div className="space-y-4">
                            <div>
                                <Label>Nom du service</Label>
                                <Input
                                    value={editing.name}
                                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={editing.description ?? ""}
                                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Prix (€)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={Number(editing.price)}
                                        onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Durée (minutes)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={Number(editing.duration_minutes)}
                                        onChange={e =>
                                            setEditing({ ...editing, duration_minutes: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Couleur (badge)</Label>
                                <Select
                                    value={editing.color ?? "bg-gray-500"}
                                    onValueChange={v => setEditing({ ...editing, color: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Couleur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLOR_CHOICES.map(c => (
                                            <SelectItem key={c.val} value={c.val}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={editing.is_active}
                                    onCheckedChange={ch =>
                                        setEditing({ ...editing, is_active: Boolean(ch) })
                                    }
                                />
                                <Label>Actif</Label>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        {editing?.id ? (
                            <Button
                                variant="outline"
                                className="text-red-600 mr-auto"
                                onClick={async () => {
                                    if (!editing?.id) return
                                    try {
                                        await remove(editing.id)
                                        setOpenModal(false)
                                    } catch {}
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </Button>
                        ) : (
                            <div />
                        )}
                        <Button variant="outline" onClick={() => setOpenModal(false)}>
                            Annuler
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={save} disabled={loading}>
                            {loading ? "Enregistrement…" : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}