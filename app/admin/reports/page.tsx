"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Calendar, Euro, ArrowLeft, Download, BarChart3, PieChart, Activity } from "lucide-react"
import Link from "next/link"

// Données mockées pour les statistiques
const stats = {
    totalRevenue: 15420,
    monthlyRevenue: 3420,
    totalClients: 45,
    newClientsThisMonth: 8,
    totalAppointments: 128,
    appointmentsThisMonth: 24,
    averageSessionPrice: 135,
    conversionRate: 78,
}

const monthlyData = [
    { month: "Jan", revenue: 2800, appointments: 18, clients: 6 },
    { month: "Fév", revenue: 3200, appointments: 22, clients: 7 },
    { month: "Mar", revenue: 2950, appointments: 20, clients: 5 },
    { month: "Avr", revenue: 3420, appointments: 24, clients: 8 },
]

const serviceStats = [
    { service: "M-Starter", count: 45, revenue: 5355, percentage: 35 },
    { service: "M-Pacer", count: 38, revenue: 5282, percentage: 30 },
    { service: "M-Finisher", count: 45, revenue: 7155, percentage: 35 },
]

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                    Rapports et Statistiques
                                </h1>
                                <p className="text-gray-600">Analyse des performances et données business</p>
                            </div>
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter PDF
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* KPIs principaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">CA Total</CardTitle>
                            <Euro className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}€</div>
                            <p className="text-xs text-green-600 mt-1">+15% vs mois dernier</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">CA Mensuel</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue.toLocaleString()}€</div>
                            <p className="text-xs text-green-600 mt-1">+8% vs mois dernier</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Clients Total</CardTitle>
                            <Users className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalClients}</div>
                            <p className="text-xs text-green-600 mt-1">+{stats.newClientsThisMonth} ce mois</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">RDV Total</CardTitle>
                            <Calendar className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
                            <p className="text-xs text-green-600 mt-1">+{stats.appointmentsThisMonth} ce mois</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Évolution mensuelle */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-orange-600" />
                                Évolution Mensuelle
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium">{data.month} 2024</div>
                                            <div className="text-sm text-gray-600">
                                                {data.appointments} RDV • {data.clients} nouveaux clients
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg">{data.revenue.toLocaleString()}€</div>
                                            <div className="text-xs text-green-600">
                                                {index > 0
                                                    ? `+${Math.round(((data.revenue - monthlyData[index - 1].revenue) / monthlyData[index - 1].revenue) * 100)}%`
                                                    : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Répartition par service */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-orange-600" />
                                Répartition par Service
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {serviceStats.map((service, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{service.service}</span>
                                            <span className="text-sm text-gray-600">{service.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${service.percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{service.count} séances</span>
                                            <span>{service.revenue.toLocaleString()}€</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Métriques avancées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-orange-600" />
                                Prix Moyen par Séance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.averageSessionPrice}€</div>
                            <p className="text-sm text-gray-600">Basé sur les 30 derniers jours</p>
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-800">+5€ par rapport au mois dernier</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                                Taux de Conversion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.conversionRate}%</div>
                            <p className="text-sm text-gray-600">Prospects → Clients</p>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">Excellent taux de conversion</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-600" />
                                Fidélisation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 mb-2">2.8</div>
                            <p className="text-sm text-gray-600">RDV moyen par client</p>
                            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                                <p className="text-sm text-orange-800">Objectif: 3.5 RDV/client</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions rapides */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                                <Download className="w-6 h-6" />
                                <span>Exporter les données</span>
                                <span className="text-xs text-gray-500">CSV, Excel, PDF</span>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                                <BarChart3 className="w-6 h-6" />
                                <span>Rapport détaillé</span>
                                <span className="text-xs text-gray-500">Analyse complète</span>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                                <TrendingUp className="w-6 h-6" />
                                <span>Prévisions</span>
                                <span className="text-xs text-gray-500">Projections 3 mois</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
