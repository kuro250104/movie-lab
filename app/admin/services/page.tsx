"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Search, Plus, Edit, Trash2, ArrowLeft, Filter, Timer, Euro, PackagePlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

/* === NEW: types === */
type ServiceItem = { id?: number; service_id?: number; icon: string; title: string; position?: number }
type Service = {
    id: number
    name: string
    description: string | null
    price: number
    duration_minutes: number
    is_active: boolean
    color?: string | null
    /* === NEW === */ items?: ServiceItem[]
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
            /* === NEW: map items === */
            items: Array.isArray(r.items)
                ? r.items.map((it: any, idx: number) => ({
                    id: it.id,
                    service_id: it.service_id,
                    icon: String(it.icon ?? "").trim(),
                    title: String(it.title ?? "").trim(),
                    position: Number.isFinite(Number(it.position)) ? Number(it.position) : idx,
                }))
                : [],
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
            items: (payload.items ?? [])
                .filter((i) => i && i.icon && i.title)
                .map((i, idx) => ({ icon: i.icon, title: i.title, position: i.position ?? idx })),
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
            /* === NEW: allow full replace on PUT/PATCH backend si dispo === */
            items: (payload.items ?? []).map((i, idx) => ({
                icon: i.icon,
                title: i.title,
                position: i.position ?? idx,
            })),
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
        const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE", credentials: "include" })
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

    const getStatusColor = (s: boolean) => (s ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return services.filter((s) => {
            const match = !term || s.name.toLowerCase().includes(term) || (s.description ?? "").toLowerCase().includes(term)
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
            items: [],
        })
        setOpenModal(true)
    }

    const openEdit = (s: Service) => {
        setEditing({ ...s, items: s.items ?? [] })
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
            setServices((prev) => prev.filter((s) => s.id !== id))
        } catch (e: any) {
            alert(e?.message ?? "Erreur suppression service")
        } finally {
            setLoading(false)
        }
    }

    const addItem = () => {
        if (!editing) return
        const items = [...(editing.items ?? [])]
        items.push({ icon: "", title: "", position: items.length })
        setEditing({ ...editing, items })
    }
    const updateItem = (idx: number, patch: Partial<ServiceItem>) => {
        if (!editing) return
        const items = [...(editing.items ?? [])]
        items[idx] = { ...items[idx], ...patch }
        setEditing({ ...editing, items })
    }
    const removeItem = (idx: number) => {
        if (!editing) return
        const items = (editing.items ?? []).filter((_, i) => i !== idx).map((it, i) => ({ ...it, position: i }))
        setEditing({ ...editing, items })
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="grid gap-6">
                    {filtered.map((s) => (
                        <Card key={s.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{s.name}</h3>
                                                {!!s.description && <p className="text-sm text-gray-600 mt-1">{s.description}</p>}
                                                <div className="flex gap-2 mt-3">
                                                    <Badge variant="outline" className={`border ${s.color ?? "bg-gray-100"} text-gray-900`}>
                                                        Couleur
                                                    </Badge>
                                                    <Badge className={getStatusColor(s.is_active)}>{s.is_active ? "Actif" : "Inactif"}</Badge>
                                                </div>

                                                {(s.items?.length ?? 0) > 0 && (
                                                    <ul className="mt-3 space-y-1 text-sm text-gray-700">
                                                        {s.items!.map((it) => (
                                                            <li key={`${it.id}-${it.title}`} className="flex items-center gap-2">
                                                                <span className="opacity-70">{it.icon}</span>
                                                                <span>• {it.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
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
                                        <Button variant="outline" size="sm" className="text-red-600 bg-transparent" onClick={() => remove(s.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing?.id ? "Modifier le service" : "Nouveau service"}</DialogTitle>
                    </DialogHeader>

                    {editing && (
                        <div className="space-y-4">

                            <div className="pt-2">
                                <div className="flex items-center justify-between">
                                    <Label>Items (icône + titre)</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        <Plus className="w-4 h-4 mr-1" /> Ajouter un item
                                    </Button>
                                </div>

                                <div className="mt-2 space-y-2">
                                    {(editing.items ?? []).map((it, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center border rounded p-2">
                                            <div className="md:col-span-3">
                                                <Label className="text-xs">Icône</Label>
                                                <Input
                                                    placeholder="ex: runningMan"
                                                    value={it.icon}
                                                    onChange={(e) => updateItem(idx, { icon: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-8">
                                                <Label className="text-xs">Titre</Label>
                                                <Input
                                                    placeholder="ex: Analyse posturale"
                                                    value={it.title}
                                                    onChange={(e) => updateItem(idx, { title: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-1 flex justify-end">
                                                <Button type="button" variant="outline" size="icon" onClick={() => removeItem(idx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(editing.items?.length ?? 0) === 0 && (
                                        <p className="text-sm text-gray-500">Aucun item. Cliquez sur “Ajouter un item”.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox checked={editing.is_active} onCheckedChange={(ch) => setEditing({ ...editing, is_active: Boolean(ch) })} />
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