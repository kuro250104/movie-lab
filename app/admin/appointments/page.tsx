"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Edit, Trash2, Clock, ArrowLeft, ChevronLeft, ChevronRight, Euro } from "lucide-react"
import Link from "next/link"

const mockAppointments = [
    {
        id: 1,
        clientName: "Jean Dupont",
        clientEmail: "jean.dupont@email.com",
        service: "M-Starter",
        date: "2024-02-15",
        time: "09:00",
        duration: 60,
        price: 119,
        status: "Confirmé",
        paymentStatus: "Payé",
        notes: "Premier rendez-vous, analyse complète",
    },
    {
        id: 2,
        clientName: "Marie Martin",
        clientEmail: "marie.martin@email.com",
        service: "M-Pacer",
        date: "2024-02-15",
        time: "14:30",
        duration: 90,
        price: 139,
        status: "Confirmé",
        paymentStatus: "En attente",
        notes: "Suivi après blessure au genou",
    },
    {
        id: 3,
        clientName: "Pierre Durand",
        clientEmail: "pierre.durand@email.com",
        service: "M-Finisher",
        date: "2024-02-16",
        time: "10:00",
        duration: 120,
        price: 159,
        status: "En attente",
        paymentStatus: "En attente",
        notes: "Préparation marathon",
    },
    {
        id: 4,
        clientName: "Sophie Bernard",
        clientEmail: "sophie.bernard@email.com",
        service: "M-Starter",
        date: "2024-02-16",
        time: "16:00",
        duration: 60,
        price: 119,
        status: "Annulé",
        paymentStatus: "Remboursé",
        notes: "Annulation client",
    },
    {
        id: 5,
        clientName: "Thomas Petit",
        clientEmail: "thomas.petit@email.com",
        service: "M-Pacer",
        date: "2024-02-17",
        time: "11:00",
        duration: 90,
        price: 139,
        status: "Terminé",
        paymentStatus: "Payé",
        notes: "Séance réussie, bon progrès",
    },
    {
        id: 6,
        clientName: "Emma Rousseau",
        clientEmail: "emma.rousseau@email.com",
        service: "M-Starter",
        date: "2024-02-19",
        time: "09:30",
        duration: 60,
        price: 119,
        status: "Confirmé",
        paymentStatus: "Payé",
        notes: "Nouvelle cliente",
    },
    {
        id: 7,
        clientName: "Lucas Moreau",
        clientEmail: "lucas.moreau@email.com",
        service: "M-Finisher",
        date: "2024-02-20",
        time: "15:00",
        duration: 120,
        price: 159,
        status: "Confirmé",
        paymentStatus: "En attente",
        notes: "Suivi performance",
    },
    {
        id: 8,
        clientName: "Camille Leroy",
        clientEmail: "camille.leroy@email.com",
        service: "M-Pacer",
        date: "2024-02-22",
        time: "10:30",
        duration: 90,
        price: 139,
        status: "En attente",
        paymentStatus: "En attente",
        notes: "Première séance complète",
    },
]

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
]

export default function AppointmentsCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)) // Février 2024
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Confirmé":
                return "bg-green-100 text-green-800 border-green-200"
            case "En attente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "Terminé":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "Annulé":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getServiceColor = (service: string) => {
        switch (service) {
            case "M-Starter":
                return "bg-blue-500"
            case "M-Pacer":
                return "bg-orange-500"
            case "M-Finisher":
                return "bg-purple-500"
            default:
                return "bg-gray-500"
        }
    }

    // Générer les jours du calendrier
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1))

        const days = []
        const currentDay = new Date(startDate)

        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDay))
            currentDay.setDate(currentDay.getDate() + 1)
        }

        return days
    }

    const getAppointmentsForDate = (date: Date) => {
        const dateString = date.toISOString().split("T")[0]
        return mockAppointments.filter((apt) => apt.date === dateString)
    }

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth()
    }

    const calendarDays = generateCalendarDays()
    const selectedDateAppointments = selectedDate ? mockAppointments.filter((apt) => apt.date === selectedDate) : []

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
                                    <Calendar className="w-6 h-6 text-orange-600" />
                                    Planning des Rendez-vous
                                </h1>
                                <p className="text-gray-600">Calendrier interactif des rendez-vous</p>
                            </div>
                        </div>
                        <Link href="/admin/appointments/new">
                            <Button className="bg-orange-600 hover:bg-orange-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau RDV
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Calendrier principal */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardContent className="p-6">
                                {/* Navigation du calendrier */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </h2>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Grille du calendrier */}
                                <div className="grid grid-cols-7 gap-1">
                                    {/* En-têtes des jours */}
                                    {daysOfWeek.map((day) => (
                                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Jours du calendrier */}
                                    {calendarDays.map((date, index) => {
                                        const appointments = getAppointmentsForDate(date)
                                        const dateString = date.toISOString().split("T")[0]
                                        const isSelected = selectedDate === dateString

                                        return (
                                            <div
                                                key={index}
                                                className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                                                    isCurrentMonth(date) ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"
                                                } ${isToday(date) ? "ring-2 ring-orange-500 bg-orange-50" : ""} ${
                                                    isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                                                }`}
                                                onClick={() => setSelectedDate(dateString)}
                                            >
                                                <div
                                                    className={`text-sm font-medium mb-1 ${
                                                        isToday(date) ? "text-orange-600" : isCurrentMonth(date) ? "text-gray-900" : "text-gray-400"
                                                    }`}
                                                >
                                                    {date.getDate()}
                                                </div>

                                                <div className="space-y-1">
                                                    {appointments.slice(0, 3).map((apt, aptIndex) => (
                                                        <div
                                                            key={aptIndex}
                                                            className={`text-xs p-1 rounded text-white truncate ${getServiceColor(apt.service)}`}
                                                            title={`${apt.time} - ${apt.clientName} (${apt.service})`}
                                                        >
                                                            {apt.time} {apt.clientName.split(" ")[0]}
                                                        </div>
                                                    ))}
                                                    {appointments.length > 3 && (
                                                        <div className="text-xs text-gray-500 font-medium">+{appointments.length - 3} autres</div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panneau latéral */}
                    <div className="space-y-6">
                        {/* Légende */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                        <span className="text-sm">M-Starter</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                                        <span className="text-sm">M-Pacer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                                        <span className="text-sm">M-Finisher</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Détails du jour sélectionné */}
                        {selectedDate && (
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        {new Date(selectedDate).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </h3>

                                    {selectedDateAppointments.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Aucun rendez-vous ce jour</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedDateAppointments.map((apt) => (
                                                <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <div className="font-medium text-sm">{apt.clientName}</div>
                                                            <div className="text-xs text-gray-600 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {apt.time} ({apt.duration}min)
                                                            </div>
                                                        </div>
                                                        <Badge className={getStatusColor(apt.status)} variant="outline">
                                                            {apt.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <Badge className={`${getServiceColor(apt.service)} text-white`} variant="outline">
                                                            {apt.service}
                                                        </Badge>
                                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Euro className="w-3 h-3" />
                                                            {apt.price}€
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-1 mt-2">
                                                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                                                            <Edit className="w-3 h-3 mr-1" />
                                                            Modifier
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-6 text-xs text-red-600 bg-transparent">
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Statistiques rapides */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Ce mois</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total RDV:</span>
                                        <span className="font-medium">{mockAppointments.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Confirmés:</span>
                                        <span className="font-medium text-green-600">
                      {mockAppointments.filter((apt) => apt.status === "Confirmé").length}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">En attente:</span>
                                        <span className="font-medium text-yellow-600">
                      {mockAppointments.filter((apt) => apt.status === "En attente").length}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">CA prévu:</span>
                                        <span className="font-medium">{mockAppointments.reduce((sum, apt) => sum + apt.price, 0)}€</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
