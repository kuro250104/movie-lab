"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users, Search, Plus, Edit, Trash2, Phone, Mail, Calendar, ArrowLeft, Filter, Settings
} from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


type Service = { id: number; description:string; duration_minutes:number; name: string; price: number; is_active: boolean; color?: string }
type Coach = {
    id: number
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    city?: string | null
    dateOfBirth?: string | null
    lastAppointment?: string | null
    totalAppointments?: number | null
    status: "Actif" | "Inactif"
    coachType: "Coach sportif" | "Coach running" | "Préparateur mental" | "Autre" | null
    serviceIds: number[]
}

const COACH_TYPES: Coach["coachType"][] = [
    "Coach sportif",
    "Coach running",
    "Préparateur mental",
    "Autre",
]


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
            duration_minutes: r.duration_minutes ?? 60,
            is_active: Boolean(r.is_active ?? r.active),
            color: r.color ?? "bg-gray-500",
        }))
    },
    async createService(payload: Partial<Service> & { duration_minutes?: number }) {
        const body = {
            name: payload.name,
            price: payload.price ?? 0,
            description: payload.description,
            duration_minutes: payload.duration_minutes,
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

    async getCoaches(): Promise<Coach[]> {
        const res = await fetch("/api/admin/coaches", { credentials: "include" })
        if (!res.ok) throw new Error("Erreur chargement coachs")
        const rows = await res.json()
        return rows.map((r: any) => ({
            id: r.id,
            firstName: r.firstName,
            lastName: r.lastName,
            email: r.email,
            phone: r.phone ?? null,
            city: r.city ?? null,
            dateOfBirth: r.dateOfBirth ?? null,
            lastAppointment: r.lastAppointment ?? null,
            totalAppointments: r.totalAppointments ?? 0,
            status: (r.status === "Inactif" ? "Inactif" : "Actif") as Coach["status"],
            coachType: (r.coachType ?? "Coach") as Coach["coachType"],
            serviceIds: Array.isArray(r.services) ? r.services.map((s: any) => s.id) : [],
        }))
    },
    async createCoach(payload: Coach) {
        const body = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone ?? null,
            city: payload.city ?? null,
            status: payload.status,
            coachType: payload.coachType,
            dateOfBirth: payload.dateOfBirth ?? null,
            serviceIds: payload.serviceIds ?? [],
        }
        const res = await fetch("/api/admin/coaches", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Création coach échouée")
        return this.getCoaches()
    },
    async updateCoach(id: number, payload: Partial<Coach>) {
        const body = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            city: payload.city,
            status: payload.status,
            coachType: payload.coachType,
            dateOfBirth: payload.dateOfBirth,
            serviceIds: payload.serviceIds,
        }
        const res = await fetch(`/api/admin/coaches/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Mise à jour coach échouée")
        return this.getCoaches()
    },
    async deleteCoach(id: number) {
        const res = await fetch(`/api/admin/coaches/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        if (!res.ok) throw new Error("Suppression coach échouée")
    },
}

export default function CoachesServicesPage() {

    const [services, setServices] = useState<Service[]>([])
    const [coaches, setCoaches] = useState<Coach[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<"Tous" | "Actif" | "Inactif">("Tous")

    const [openCoachModal, setOpenCoachModal] = useState(false)
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null)

    const [openServiceModal, setOpenServiceModal] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                setError(null)
                const [srv, cch] = await Promise.all([api.getServices(), api.getCoaches()])
                setServices(srv)
                setCoaches(cch)
            } catch (e: any) {
                setError(e?.message ?? "Erreur inconnue")
                console.error(e)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const getStatusColor = (s: string) =>
        (s === "Actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")

    const getCoachTypeColor = (t?: Coach["coachType"]) => {
        switch (t) {
            case "Coach sportif":
                return "bg-blue-100 text-blue-800"
            case "Coach running":
                return "bg-emerald-100 text-emerald-800"
            case "Préparateur mental":
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }
    const serviceById = useMemo(() => new Map(services.map(s => [s.id, s])), [services])

    const filteredCoaches = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return coaches.filter(c => {
            const match = !term || c.firstName.toLowerCase().includes(term) || c.lastName.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
            const filt = filterStatus === "Tous" || c.status === filterStatus
            return match && filt
        })
    }, [coaches, searchTerm, filterStatus])


    const openNewCoach = () => {
        setEditingCoach({
            id: 0,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            city: "",
            status: "Actif",
            coachType: "",
            serviceIds: [],
            dateOfBirth: null,
            lastAppointment: null,
            totalAppointments: 0,
        })
        setOpenCoachModal(true)
    }

    const openEditCoach = (c: Coach) => { setEditingCoach({ ...c }); setOpenCoachModal(true) }

    const saveCoach = async () => {
        if (!editingCoach) return
        try {
            setLoading(true)
            if (editingCoach.id === 0) {
                const updated = await api.createCoach(editingCoach)
                setCoaches(updated)
            } else {
                const updated = await api.updateCoach(editingCoach.id, editingCoach)
                setCoaches(updated)
            }
            setOpenCoachModal(false)
            setEditingCoach(null)
        } catch (e: any) {
            alert(e?.message ?? "Erreur sauvegarde coach")
        } finally {
            setLoading(false)
        }
    }

    const deleteCoach = async (id: number) => {
        if (!confirm("Supprimer ce coach ?")) return
        try {
            setLoading(true)
            await api.deleteCoach(id)
            setCoaches(prev => prev.filter(c => c.id !== id))
        } catch (e: any) {
            alert(e?.message ?? "Erreur suppression coach")
        } finally {
            setLoading(false)
        }
    }

    //
    // const openNewService = () => {
    //     setEditingService({
    //         id: 0,
    //         name: "",
    //         description: "",
    //         price: 0,
    //         duration_minutes: 0,
    //         is_active: true,
    //         color: "bg-gray-500",
    //     })
    //     setOpenServiceModal(true)
    // }
    // const openEditService = (s: Service) => { setEditingService({ ...s }); setOpenServiceModal(true) }

    const saveService = async () => {
        if (!editingService) return
        try {
            setLoading(true)
            if (editingService.id === 0) {
                const updated = await api.createService({ ...editingService})
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
            setServices(prev => prev.filter(s => s.id !== id))
            setCoaches(prev => prev.map(c => ({ ...c, serviceIds: c.serviceIds.filter(sid => sid !== id) })))
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
                                    <Users className="w-6 h-6 text-orange-600" /> Coachs
                                </h1>
                                <p className="text-gray-600">
                                    {filteredCoaches.length} coachs • {services.length} services
                                    {loading ? " (chargement…)" : ""}
                                    {error ? ` — ${error}` : ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/*<Button variant="outline" onClick={openNewService}>*/}
                            {/*    <Settings className="w-4 h-4 mr-2" /> Nouveau Service*/}
                            {/*</Button>*/}
                            <Button className="bg-orange-600 hover:bg-orange-700" onClick={openNewCoach}>
                                <Plus className="w-4 h-4 mr-2" /> Nouveau Coach
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
                                <Input className="pl-10" placeholder="Rechercher un coach…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant={filterStatus === "Tous" ? "default" : "outline"} onClick={() => setFilterStatus("Tous")}>
                                    <Filter className="w-4 h-4 mr-2" /> Tous
                                </Button>
                                <Button size="sm" variant={filterStatus === "Actif" ? "default" : "outline"} onClick={() => setFilterStatus("Actif")}>Actifs</Button>
                                <Button size="sm" variant={filterStatus === "Inactif" ? "default" : "outline"} onClick={() => setFilterStatus("Inactif")}>Inactifs</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    {filteredCoaches.map(c => {
                        const cServices = c.serviceIds.map(id => serviceById.get(id)).filter(Boolean) as Service[]
                        return (
                            <Card key={c.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">{c.firstName} {c.lastName}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1"><Mail className="w-4 h-4" />{c.email}</div>
                                                        {c.phone && <div className="flex items-center gap-1"><Phone className="w-4 h-4" />{c.phone}</div>}
                                                        {c.city && <span>{c.city}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
                                                    <Badge className={getCoachTypeColor(c.coachType)}>{c.coachType ?? "—"}</Badge>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {cServices.length ? cServices.map(s => (
                                                    <Badge key={s.id} variant="outline" className={`border ${s.color ?? "bg-gray-100"} text-gray-900`}>
                                                        {s.name} • {s.price}€
                                                    </Badge>
                                                )) : <span className="text-sm text-gray-500">Aucun service assigné</span>}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div><span className="text-gray-500">Dernier RDV:</span><p className="font-medium">{c.lastAppointment ? new Date(c.lastAppointment).toLocaleDateString("fr-FR") : "—"}</p></div>
                                                <div><span className="text-gray-500">Total RDV:</span><p className="font-medium">{c.totalAppointments ?? 0}</p></div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditCoach(c)}><Edit className="w-4 h-4 mr-2" />Modifier</Button>
                                            <Link href={`/admin/appointments/new?coach=${c.id}`}>
                                                <Button variant="outline" size="sm"><Calendar className="w-4 h-4 mr-2" />RDV</Button>
                                            </Link>
                                            <Link href={`/admin/coach/${c.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Disponibilités
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="sm" className="text-red-600 bg-transparent" onClick={() => deleteCoach(c.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {!filteredCoaches.length && !loading && (
                    <Card className="mt-6">
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun coach trouvé</h3>
                            <p className="text-gray-600 mb-4">{searchTerm ? "Modifiez votre recherche" : "Ajoutez votre premier coach"}</p>
                            <Button className="bg-orange-600 hover:bg-orange-700" onClick={openNewCoach}><Plus className="w-4 h-4 mr-2" /> Ajouter un coach</Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={openCoachModal} onOpenChange={setOpenCoachModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCoach?.id ? "Modifier le coach" : "Nouveau coach"}</DialogTitle>
                    </DialogHeader>

                    {editingCoach && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Prénom</Label>
                                    <Input
                                        value={editingCoach.firstName}
                                        onChange={e => setEditingCoach({ ...editingCoach, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Nom</Label>
                                    <Input
                                        value={editingCoach.lastName}
                                        onChange={e => setEditingCoach({ ...editingCoach, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={editingCoach.email}
                                        onChange={e => setEditingCoach({ ...editingCoach, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Téléphone</Label>
                                    <Input
                                        type="tel"
                                        value={editingCoach.phone ?? ""}
                                        onChange={e => setEditingCoach({ ...editingCoach, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Ville */}
                            <div>
                                <Label>Ville</Label>
                                <Input
                                    value={editingCoach.city ?? ""}
                                    onChange={e => setEditingCoach({ ...editingCoach, city: e.target.value })}
                                />
                            </div>

                            {/* Statut & expérience */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Statut</Label>
                                    <Select
                                        value={editingCoach.status}
                                        onValueChange={v => setEditingCoach({ ...editingCoach, status: v as Coach["status"] })}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Actif">Actif</SelectItem>
                                            <SelectItem value="Inactif">Inactif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Expérience running</Label>
                                    <Select
                                        value={editingCoach.coachType ?? "Intermédiaire"}
                                        onValueChange={v => setEditingCoach({ ...editingCoach, coachType: v as Coach["coachType"] })}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                                        <SelectContent>
                                            {COACH_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Affectation services */}
                            <div>
                                <Label>Services associés</Label>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {services.map(s => {
                                        const checked = editingCoach.serviceIds.includes(s.id)
                                        return (
                                            <label key={s.id} className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(ch) => {
                                                        setEditingCoach({
                                                            ...editingCoach,
                                                            serviceIds: ch
                                                                ? [...editingCoach.serviceIds, s.id]
                                                                : editingCoach.serviceIds.filter(id => id !== s.id),
                                                        })
                                                    }}
                                                />
                                                <span className="text-sm">
                    {s.name} <span className="text-gray-500">• {s.price}€ • {s.duration_minutes}m</span>
                  </span>
                                            </label>
                                        )
                                    })}
                                    {!services.length && <p className="text-sm text-gray-500">Aucun service disponible</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        {editingCoach?.id ? (
                            <Button
                                variant="outline"
                                className="text-red-600 mr-auto"
                                onClick={() => editingCoach && deleteCoach(editingCoach.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </Button>
                        ) : <div />}

                        <Button variant="outline" onClick={() => setOpenCoachModal(false)}>Annuler</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={saveCoach} disabled={loading}>
                            {loading ? "Enregistrement…" : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={openServiceModal} onOpenChange={setOpenServiceModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingService?.id ? "Modifier le service" : "Nouveau service"}
                        </DialogTitle>
                    </DialogHeader>

                    {editingService && (
                        <div className="space-y-4">
                            {/* Nom */}
                            <div>
                                <Label>Nom du service</Label>
                                <Input
                                    value={editingService.name}
                                    onChange={e =>
                                        setEditingService({ ...editingService, name: e.target.value })
                                    }
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={editingService.description ?? ""}
                                    onChange={e =>
                                        setEditingService({ ...editingService, description: e.target.value })
                                    }
                                />
                            </div>

                            {/* Prix */}
                            <div>
                                <Label>Prix (€)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={editingService.price}
                                    onChange={e =>
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
                                    onChange={e =>
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
                                    onValueChange={v =>
                                        setEditingService({ ...editingService, color: v })
                                    }
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
                                    onCheckedChange={ch =>
                                        setEditingService({ ...editingService, is_active: Boolean(ch) })
                                    }
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
                        <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={saveService}
                        >
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}