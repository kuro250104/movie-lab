"use client"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Users, Calendar, Euro, TrendingUp, Clock, UserPlus, CalendarPlus, LogOut, PackagePlus} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
    totalClients: number
    totalAppointments: number
    monthlyRevenue: number
    todayAppointments: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalClients: 0,
        totalAppointments: 0,
        monthlyRevenue: 0,
        todayAppointments: 0,
    })
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setStats({
                totalClients: 45,
                totalAppointments: 128,
                monthlyRevenue: 3420,
                todayAppointments: 3,
            })
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {method: "POST"})
            router.push("/admin/login")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
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
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                            <p className="text-gray-600">Bienvenue dans l'administration movi-lab</p>
                        </div>
                        <Button onClick={handleLogout} variant="outline"
                                className="flex items-center gap-2 bg-transparent">
                            <LogOut className="w-4 h-4"/>
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">*/}
                {/*    <Card>*/}
                {/*        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
                {/*            <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>*/}
                {/*            <Users className="h-4 w-4 text-orange-600"/>*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div className="text-2xl font-bold text-gray-900">{stats.totalClients}</div>*/}
                {/*            <p className="text-xs text-green-600 mt-1">+12% ce mois</p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}

                {/*    <Card>*/}
                {/*        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
                {/*            <CardTitle className="text-sm font-medium text-gray-600">RDV Total</CardTitle>*/}
                {/*            <Calendar className="h-4 w-4 text-orange-600"/>*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>*/}
                {/*            <p className="text-xs text-green-600 mt-1">+8% ce mois</p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}

                {/*    <Card>*/}
                {/*        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
                {/*            <CardTitle className="text-sm font-medium text-gray-600">CA Mensuel</CardTitle>*/}
                {/*            <Euro className="h-4 w-4 text-orange-600"/>*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue}€</div>*/}
                {/*            <p className="text-xs text-green-600 mt-1">+15% ce mois</p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}

                {/*    <Card>*/}
                {/*        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
                {/*            <CardTitle className="text-sm font-medium text-gray-600">RDV Aujourd'hui</CardTitle>*/}
                {/*            <Clock className="h-4 w-4 text-orange-600"/>*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</div>*/}
                {/*            <p className="text-xs text-gray-600 mt-1">3 séances prévues</p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}
                {/*</div>*/}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-600"/>
                                Gestion coach
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Gérer les coachs et affiliations
                            </p>
                            <div className="flex gap-2">
                                <Link href="/admin/coach">
                                    <Button className="bg-orange-600 hover:bg-orange-700">Voir les coach</Button>
                                </Link>
                                <Link href="/admin/services/new">
                                    <Button className="bg-orange-600 hover:bg-orange-700">
                                        <PackagePlus className="w-4 h-4 mr-2"/>
                                        Nouveau service
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-600"/>
                                Rendez-vous
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">Planifier, modifier et gérer tous les rendez-vous
                                clients.</p>
                            <div className="flex gap-2">
                                <Link href="/admin/appointments">
                                    <Button className="bg-orange-600 hover:bg-orange-700">Planning</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
