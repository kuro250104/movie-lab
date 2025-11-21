"use client"

import {ReactNode, useEffect, useMemo, useState} from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Users, Search, Plus, Edit, Trash2, ArrowLeft, Settings, Target, Icon, Zap} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {sneaker} from "@lucide/lab";
import {Barbell, Note, PersonSimple, PersonSimpleRun, SneakerMove} from "@phosphor-icons/react"
import {GiBackPain, GiLeg} from "react-icons/gi";
import {ImStatsDots} from "react-icons/im";
import {LiaUserFriendsSolid} from "react-icons/lia";
import * as Icons from "lucide-react"

type ServiceItem = { id?: number; service_id?: number; icon: string; title: string; description?: string }

type Service = {
    id: number
    name: string
    description: string
    price: number
    duration_minutes: number
    is_active: boolean
    color?: string
    items?: ServiceItem[]
}


const iconMap: Record<string, ReactNode> = {
    sneaker: <Icon iconNode={sneaker} className="w-5 h-5" />,
    target: <Target className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    runningMan: <PersonSimpleRun className="w-5 h-5" />,
    simpleMan: <PersonSimple className="w-5 h-5" />,
    shoes: <SneakerMove className="w-5 h-5" />,
    note: <Note className="w-5 h-5" />,
    leg: <GiLeg className="w-5 h-5" />,
    chart: <ImStatsDots className="w-5 h-5" />,
    barbell: <Barbell className="w-5 h-5" />,
    backpain: <GiBackPain className="w-5 h-5" />,
    userfriend: <LiaUserFriendsSolid className="w-5 h-5" />,
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
            items: Array.isArray(r.items)
                ? r.items.map((it: any) => ({
                    id: it.id,
                    service_id: it.service_id,
                    icon: String(it.icon ?? "").trim(),
                    title: String(it.title ?? "").trim(),
                    description: String(it.description ?? ""), // NEW
                }))
                : [],
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
            items: (payload.items ?? [])
                .filter((i) => i && i.icon && i.title)
                .map((i) => ({
                    icon: i.icon,
                    title: i.title,
                    description: i.description ?? "", // NEW
                })),
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
            items: (payload.items ?? [])
                .filter((i) => i && i.icon && i.title)
                .map((i) => ({
                    icon: i.icon,
                    title: i.title,
                    description: i.description ?? "", // NEW
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
        const res = await fetch(`/api/admin/services/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        if (!res.ok) throw new Error("Suppression service échouée")
    },
}

export function IconSelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue>
                    <div className="flex items-center gap-2">
                        {iconMap[value]} <span className="capitalize">{value || "Choisir une icône"}</span>
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {Object.entries(iconMap).map(([key, icon]) => (
                    <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                            {icon}
                            <span className="capitalize">{key}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
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
            items: [], // NEW
        })
        setOpenServiceModal(true)
    }

    const openEditService = (s: Service) => {
        setEditingService({ ...s, items: s.items ?? [] })
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

    // ---- Items UI helpers (sans position) ----
    const addItem = () =>
        setEditingService((prev) =>
            prev ? { ...prev, items: [...(prev.items ?? []), { icon: "", title: "", description: "" }] } : prev
        )

    const updateItem = (idx: number, patch: Partial<ServiceItem>) =>
        setEditingService((prev) => {
            if (!prev) return prev
            const items = [...(prev.items ?? [])]
            items[idx] = { ...items[idx], ...patch }
            return { ...prev, items }
        })

    const removeItem = (idx: number) =>
        setEditingService((prev) => {
            if (!prev) return prev
            const items = (prev.items ?? []).filter((_, i) => i !== idx)
            return { ...prev, items }
        })

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

                                                {/* Aperçu des items */}
                                                {s.items?.length > 0 && (
                                                    <ul className="mt-3 space-y-1 text-sm text-gray-700">
                                                        {s.items.map((it, i) => {

                                                            const icon = iconMap[it.icon] ?? (
                                                                <span className="w-5 h-5 opacity-50">•</span>
                                                            )

                                                            return (
                                                                <li
                                                                    key={`${it.id ?? i}-${it.title}`}
                                                                    className="flex items-start gap-2"
                                                                >
                                                                    {/* Icône */}
                                                                    <span className="mt-0.5">{icon}</span>

                                                                    <div>
                                                                        <span className="font-medium">{it.title}</span>

                                                                        {it.description && (
                                                                            <span className="block text-gray-600">
                                {it.description}
                            </span>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                )}
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
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Modifiez votre recherche" : "Ajoutez votre premier service"}
                            </p>
                            <Button className="bg-orange-600 hover:bg-orange-700" onClick={openNewService}>
                                <Plus className="w-4 h-4 mr-2" /> Ajouter un service
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={openServiceModal} onOpenChange={setOpenServiceModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingService?.id ? "Modifier le service" : "Nouveau service"}</DialogTitle>
                    </DialogHeader>

                    {editingService && (
                        <div className="space-y-4">
                            <div>
                                <Label>Nom du service</Label>
                                <Input
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={editingService.description ?? ""}
                                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>Prix (€)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={editingService.price}
                                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <Label>Durée (minutes)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={editingService.duration_minutes}
                                    onChange={(e) =>
                                        setEditingService({ ...editingService, duration_minutes: Number(e.target.value) })
                                    }
                                />
                            </div>

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

                            {/* ---- Items (icône + titre + description) ---- */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between">
                                    <Label>Items</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        <Plus className="w-4 h-4 mr-1" /> Ajouter un item
                                    </Button>
                                </div>
                                <div className="mt-2 space-y-2">
                                    {(editingService.items ?? []).map((it, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start border rounded p-2">
                                            <div className="md:col-span-3">
                                                <Label className="text-xs">Icône</Label>
                                                <IconSelect
                                                    value={it.icon}
                                                    onChange={(val) => updateItem(idx, { icon: val })}
                                                />
                                            </div>
                                            <div className="md:col-span-4">
                                                <Label className="text-xs">Titre</Label>
                                                <Input value={it.title} onChange={(e) => updateItem(idx, { title: e.target.value })} />
                                            </div>
                                            <div className="md:col-span-4">
                                                <Label className="text-xs">Description</Label>
                                                <Input
                                                    placeholder="(facultatif)"
                                                    value={it.description ?? ""}
                                                    onChange={(e) => updateItem(idx, { description: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-1 flex justify-end">
                                                <Button type="button" variant="outline" size="icon" onClick={() => removeItem(idx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(editingService.items?.length ?? 0) === 0 && (
                                        <p className="text-sm text-gray-500">Aucun item. Cliquez sur “Ajouter un item”.</p>
                                    )}
                                </div>
                            </div>

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