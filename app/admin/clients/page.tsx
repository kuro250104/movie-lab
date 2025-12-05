"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Search,
    Phone,
    Mail,
    Calendar,
    ArrowLeft,
    UserCircle2,
} from "lucide-react"
import { LoadingPage } from "@/components/loading-spinner"

type Client = {
    id: number
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    createdAt: string
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState<"recent" | "ancien">("recent")

    const fetchClients = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/admin/clients", { credentials: "include" })
            if (!res.ok) throw new Error("Erreur chargement clients")
            const data = await res.json()
            setClients(data)
        } catch (e: any) {
            console.error(e)
            setError(e?.message ?? "Erreur inconnue")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const filteredClients = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        let list = clients

        if (term) {
            list = list.filter(
                (c) =>
                    c.firstName.toLowerCase().includes(term) ||
                    c.lastName.toLowerCase().includes(term) ||
                    c.email.toLowerCase().includes(term)
            )
        }

        list = [...list].sort((a, b) => {
            const da = new Date(a.createdAt).getTime()
            const db = new Date(b.createdAt).getTime()
            return sortOrder === "recent" ? db - da : da - db
        })

        return list
    }, [clients, searchTerm, sortOrder])

    if (loading) {
        return (
            <LoadingPage
                message="Chargement des clients…"
                variant="brand"
                size="md"
            />
        )
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
                                    <Users className="w-6 h-6 text-orange-600" /> Clients
                                </h1>
                                <p className="text-gray-600">
                                    {filteredClients.length} clients
                                    {loading ? " (chargement…)" : ""}
                                    {error ? ` — ${error}` : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {error && (
                    <Card className="mb-6 border-red-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-red-700">Erreur : {error}</p>
                                <Button variant="outline" size="sm" onClick={fetchClients}>
                                    Réessayer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Rechercher un client…"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-sm text-gray-600">Trier par :</span>
                                <Button
                                    size="sm"
                                    variant={sortOrder === "recent" ? "default" : "outline"}
                                    onClick={() => setSortOrder("recent")}
                                >
                                    Plus récents
                                </Button>
                                <Button
                                    size="sm"
                                    variant={sortOrder === "ancien" ? "default" : "outline"}
                                    onClick={() => setSortOrder("ancien")}
                                >
                                    Plus anciens
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    {filteredClients.map((c) => (
                        <Card
                            key={c.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex gap-3">
                                                <div className="mt-1">
                                                    <UserCircle2 className="w-10 h-10 text-gray-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {c.firstName} {c.lastName}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            {c.email}
                                                        </div>
                                                        {c.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-4 h-4" />
                                                                {c.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                ID #{c.id}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <span className="text-gray-500">Créé le :</span>
                                                    <p className="font-medium">
                                                        {new Date(c.createdAt).toLocaleString("fr-FR", {
                                                            dateStyle: "short",
                                                            timeStyle: "short",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*<div className="flex gap-2">*/}
                                    {/*    <Link href={`/admin/appointments/new?client=${c.id}`}>*/}
                                    {/*        <Button variant="outline" size="sm">*/}
                                    {/*            <Calendar className="w-4 h-4 mr-2" />*/}
                                    {/*            Nouveau RDV*/}
                                    {/*        </Button>*/}
                                    {/*    </Link>*/}

                                    {/*    <Link href={`/admin/clients/${c.id}`}>*/}
                                    {/*        <Button variant="outline" size="sm">*/}
                                    {/*            <Users className="w-4 h-4 mr-2" />*/}
                                    {/*            Profil*/}
                                    {/*        </Button>*/}
                                    {/*    </Link>*/}
                                    {/*</div>*/}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!filteredClients.length && !loading && (
                    <Card className="mt-6">
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucun client trouvé
                            </h3>
                            <p className="text-gray-600">
                                Modifiez votre recherche ou vos filtres.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}