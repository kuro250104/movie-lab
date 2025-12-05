"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    UserSearch,
    Calendar,
    Euro,
    TrendingUp,
    Clock,
    LogOut,
    PackagePlus,
    ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { FaUserLock } from "react-icons/fa"

interface DashboardStats {
    totalClients: number
    totalAppointments: number
    monthlyRevenue: number
    todayAppointments: number
}

type AdminRole = "admin" | "coach"

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalClients: 0,
        totalAppointments: 0,
        monthlyRevenue: 0,
        todayAppointments: 0,
    })
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<AdminRole | null>(null)

    const router = useRouter()

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)


            // 🔥 Récupérer le rôle depuis l'API
            const res = await fetch("/api/admin/me", {
                credentials: "include",
            })
            if (res.ok) {
                const me = await res.json()
                if (me.role === "admin" || me.role === "coach") {
                    setRole(me.role)
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            router.push("/admin/login")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const isAdmin = role === "admin"

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Dashboard admin
                            </h1>
                            <p className="text-gray-600">
                                Bienvenue dans l'administration movi-lab
                                {role === "coach" && " — mode coach (accès limité)"}
                            </p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="flex items-center gap-2 bg-transparent"
                        >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gestion coach / comptes */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-600" />
                                Gestion coach
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Gestion des comptes et disponibilités
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {/* Toujours visible pour les coachs et admins */}
                                <Link href="/admin/coach">
                                    <Button className="bg-orange-600 hover:bg-orange-700">
                                        <FaUserLock className="w-4 h-4 mr-2" />
                                        Voir les coach
                                    </Button>
                                </Link>

                                {isAdmin && (
                                    <Link href="/admin/management">
                                        <Button className="bg-orange-600 hover:bg-orange-700">
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Ajouter un compte admin
                                        </Button>
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link href="/admin/services/new">
                                        <Button className="bg-orange-600 hover:bg-orange-700">
                                            <PackagePlus className="w-4 h-4 mr-2" />
                                            Nouveau service
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* RDV */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-600" />
                                Rendez-vous
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Planifier, modifier et gérer tous les rendez-vous
                                clients.
                            </p>
                            <div className="flex gap-2">
                                <Link href="/admin/appointments">
                                    <Button className="bg-orange-600 hover:bg-orange-700">
                                        Planning
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    {isAdmin && (
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserSearch className="w-5 h-5 text-orange-600" />
                                        Client
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">
                                        Afficher les clients inscrits sur le site.
                                    </p>
                                    <div className="flex gap-2">
                                        <Link href="/admin/clients">
                                            <Button className="bg-orange-600 hover:bg-orange-700">
                                                Voir les clients
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                    )}
                </div>
            </div>
        </div>
    )
}