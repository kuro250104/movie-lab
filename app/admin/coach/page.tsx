"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Edit, Trash2, Phone, Mail, Calendar, ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"

// Données mockées
const mockClients = [
    {
        id: 1,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "06 12 34 56 78",
        dateOfBirth: "1985-03-15",
        city: "Toulouse",
        runningExperience: "Débutant",
        lastAppointment: "2024-01-15",
        totalAppointments: 3,
        status: "Actif",
    },
    {
        id: 2,
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@email.com",
        phone: "06 98 76 54 32",
        dateOfBirth: "1990-07-22",
        city: "Montpellier",
        runningExperience: "Intermédiaire",
        lastAppointment: "2024-01-20",
        totalAppointments: 7,
        status: "Actif",
    },
    {
        id: 3,
        firstName: "Pierre",
        lastName: "Durand",
        email: "pierre.durand@email.com",
        phone: "06 45 67 89 12",
        dateOfBirth: "1978-11-08",
        city: "Toulouse",
        runningExperience: "Avancé",
        lastAppointment: "2023-12-10",
        totalAppointments: 12,
        status: "Inactif",
    },
    {
        id: 4,
        firstName: "Sophie",
        lastName: "Bernard",
        email: "sophie.bernard@email.com",
        phone: "06 23 45 67 89",
        dateOfBirth: "1992-05-30",
        city: "Carcassonne",
        runningExperience: "Débutant",
        lastAppointment: "2024-01-25",
        totalAppointments: 1,
        status: "Actif",
    },
]

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("Tous")

    const filteredClients = mockClients.filter((client) => {
        const matchesSearch =
            client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterStatus === "Tous" || client.status === filterStatus

        return matchesSearch && matchesFilter
    })

    const getStatusColor = (status: string) => {
        return status === "Actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
    }

    const getExperienceColor = (experience: string) => {
        switch (experience) {
            case "Débutant":
                return "bg-blue-100 text-blue-800"
            case "Intermédiaire":
                return "bg-orange-100 text-orange-800"
            case "Avancé":
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
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
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-orange-600" />
                                    Gestion des Clients
                                </h1>
                                <p className="text-gray-600">{filteredClients.length} clients trouvés</p>
                            </div>
                        </div>
                        <Link href="/admin/clients/new">
                            <Button className="bg-orange-600 hover:bg-orange-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau Client
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Filtres et recherche */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Rechercher par nom ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={filterStatus === "Tous" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("Tous")}
                                    size="sm"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Tous
                                </Button>
                                <Button
                                    variant={filterStatus === "Actif" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("Actif")}
                                    size="sm"
                                >
                                    Actifs
                                </Button>
                                <Button
                                    variant={filterStatus === "Inactif" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("Inactif")}
                                    size="sm"
                                >
                                    Inactifs
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des clients */}
                <div className="grid gap-6">
                    {filteredClients.map((client) => (
                        <Card key={client.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {client.firstName} {client.lastName}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="w-4 h-4" />
                                                        {client.email}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-4 h-4" />
                                                        {client.phone}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                                                <Badge className={getExperienceColor(client.runningExperience)}>
                                                    {client.runningExperience}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Ville:</span>
                                                <p className="font-medium">{client.city}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Âge:</span>
                                                <p className="font-medium">
                                                    {new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()} ans
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Dernier RDV:</span>
                                                <p className="font-medium">{new Date(client.lastAppointment).toLocaleDateString("fr-FR")}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Total RDV:</span>
                                                <p className="font-medium">{client.totalAppointments}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/clients/${client.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Modifier
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/appointments/new?client=${client.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                RDV
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredClients.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par ajouter votre premier client"}
                            </p>
                            <Link href="/admin/clients/new">
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter un client
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
