"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, ArrowLeft, Shield, UserCog } from "lucide-react"

type AdminRole = "admin" | "coach"

type AdminAccount = {
    id: number
    email: string
    name: string
    role: AdminRole
    createdAt: string
}

export default function ManagementPage() {
    const router = useRouter()
    const [accounts, setAccounts] = useState<AdminAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch("/api/admin/management", {
                    credentials: "include",
                })
                if (!res.ok) {
                    throw new Error("Erreur chargement comptes")
                }
                const rows = await res.json()
                setAccounts(rows)
            } catch (e: any) {
                console.error(e)
                setError(e?.message ?? "Erreur inconnue")
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const filteredAccounts = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return accounts
        return accounts.filter((a) => {
            return (
                a.name.toLowerCase().includes(term) ||
                a.email.toLowerCase().includes(term) ||
                a.role.toLowerCase().includes(term)
            )
        })
    }, [accounts, searchTerm])

    const countAdmins = accounts.filter((a) => a.role === "admin").length
    const countCoaches = accounts.filter((a) => a.role === "coach").length

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
                                    <Users className="w-6 h-6 text-orange-600" /> Management
                                </h1>
                                <p className="text-gray-600">
                                    {accounts.length} compte
                                    {accounts.length > 1 ? "s" : ""} • {countAdmins} admin
                                    {countAdmins > 1 ? "s" : ""} • {countCoaches} coach
                                    {countCoaches > 1 ? "s" : ""}{" "}
                                    {loading ? " (chargement…)" : ""}
                                    {error ? ` — ${error}` : ""}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/admin/management/new")}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Nouveau compte
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Rechercher un compte (nom, email, rôle)…"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des comptes */}
                <div className="grid gap-4">
                    {filteredAccounts.map((a) => (
                        <Card
                            key={a.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                                            {a.role === "admin" ? (
                                                <Shield className="w-5 h-5 text-orange-700" />
                                            ) : (
                                                <UserCog className="w-5 h-5 text-orange-700" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {a.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                ID #{a.id} • Créé le{" "}
                                                {new Date(
                                                    a.createdAt,
                                                ).toLocaleString("fr-FR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700">
                                        {a.email}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <Badge
                                        className={
                                            a.role === "admin"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-emerald-100 text-emerald-800"
                                        }
                                    >
                                        {a.role === "admin" ? "Admin" : "Coach"}
                                    </Badge>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/admin/management/${a.id}`)}
                                    >
                                        Modifier
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!filteredAccounts.length && !loading && (
                    <Card className="mt-6">
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucun compte trouvé
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? "Modifiez votre recherche"
                                    : "Ajoutez votre premier compte admin ou coach"}
                            </p>
                            <Button
                                className="bg-orange-600 hover:bg-orange-700"
                                onClick={() =>
                                    router.push("/admin/management/new")
                                }
                            >
                                <Plus className="w-4 h-4 mr-2" /> Ajouter un
                                compte
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}