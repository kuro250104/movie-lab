"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calendar, Plus, Edit, Trash2, Clock, ArrowLeft, ChevronLeft, ChevronRight, Euro,
} from "lucide-react"
import Link from "next/link"
import { debugLog, isDebugEnabled } from "@/lib/debugLog"

type Appointment = {
    id: number
    date: string
    time: string
    lastName: string
    firstName: string
    clientEmail: string
    serviceName: string
    price: number
    status: string
    paymentStatus: string | null
    notes: string | null
}

const daysOfWeek = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]
const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]

const SERVICE_COLOR_CLASSES = [
    "bg-emerald-500","bg-sky-500","bg-violet-500","bg-amber-500",
    "bg-pink-500","bg-indigo-500","bg-cyan-500","bg-lime-500"
]
function colorForService(name: string) {
    if (!name) return "bg-gray-500"
    let h = 0
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
    return SERVICE_COLOR_CLASSES[h % SERVICE_COLOR_CLASSES.length]
}

function getStatusColor(status: string) {
    switch (status) {
        case "Confirmé":
        case "Confirmed":
            return "bg-green-100 text-green-800 border-green-200"
        case "En attente":
        case "Pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "Terminé":
        case "Completed":
            return "bg-blue-100 text-blue-800 border-blue-200"
        case "Annulé":
        case "Canceled":
            return "bg-red-100 text-red-800 border-red-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

function toLocalYMD(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

export default function AppointmentsCalendarPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showDebug, setShowDebug] = useState(false)

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true)
                setError(null)
                debugLog("DEBUG: fetch /api/admin/appointments")
                const res = await fetch("/api/admin/appointments", { method: "GET", credentials: "include" })
                debugLog("status:", res.status)
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    debugLog("body:", err)
                    throw new Error(err?.error || "Erreur réseau")
                }

                const raw = await res.json()
                debugLog("received length:", Array.isArray(raw) ? raw.length : "(not array)")
                debugLog("sample[0]:", raw?.[0])

                const data: Appointment[] = (raw ?? []).map((r: any) => {
                    let dateStr = r.date
                    let timeStr = r.time
                    if (!dateStr || !timeStr) {
                        const d = new Date(r.startsAt ?? r.starts_at)
                        dateStr = isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10)
                        timeStr = isNaN(d.getTime()) ? "" : d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                    }
                    return {
                        id: Number(r.id),
                        date: String(dateStr || ""),
                        time: String(timeStr || ""),
                        firstName: String(r.firstName ?? r.first_name ?? ""),
                        lastName:  String(r.lastName  ?? r.last_name  ?? ""),
                        clientEmail: String(r.clientEmail ?? r.client_email ?? ""),
                        serviceName: String(r.serviceName ?? r.service ?? ""),
                        price: Number(r.price ?? r.servicePrice ?? 0),
                        status: String(r.status ?? ""),
                        paymentStatus: r.paymentStatus ?? null,
                        notes: r.notes ?? null,
                    }
                })

                setAppointments(Array.isArray(data) ? data : [])
            } catch (e: any) {
                console.error("Erreur chargement appointments:", e)
                setError(e?.message ?? "Erreur inconnue")
            } finally {
                setLoading(false)
            }
        }
        fetchAppointments()
    }, [])

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const firstDay = new Date(year, month, 1)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1))
        const days: Date[] = []
        const cur = new Date(startDate)
        for (let i = 0; i < 42; i++) {
            days.push(new Date(cur))
            cur.setDate(cur.getDate() + 1)
        }
        return days
    }

    const getAppointmentsForDate = (date: Date) => {
        const dateString = toLocalYMD(date)
        const filtered = appointments.filter((apt) => apt.date === dateString)
        if (filtered.length > 0) {
            debugLog(
                `DEBUG: day ${dateString} -> ${filtered.length} rdv`,
                filtered.map(a => ({
                    id: a.id,
                    time: a.time,
                    client: `${a.firstName} ${a.lastName}`,
                    service: a.serviceName
                }))
            )
        }
        return filtered
    }

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const nd = new Date(prev)
            direction === "prev" ? nd.setMonth(prev.getMonth() - 1) : nd.setMonth(prev.getMonth() + 1)
            return nd
        })
    }

    const isToday = (date: Date) => new Date().toDateString() === date.toDateString()
    const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth()

    const calendarDays = useMemo(() => generateCalendarDays(), [currentDate])

    const selectedDateAppointments = useMemo(
        () => (selectedDate ? appointments.filter((apt) => apt.date === selectedDate) : []),
        [appointments, selectedDate]
    )

    const stats = useMemo(() => {
        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2,"0")}`
        const inMonth = appointments.filter(a => a.date.startsWith(monthKey))
        const total = inMonth.length
        const confirmed = inMonth.filter(a => ["Confirmé","Confirmed"].includes(a.status)).length
        const pending = inMonth.filter(a => ["En attente","Pending"].includes(a.status)).length
        const revenue = inMonth.reduce((sum, a) => sum + (Number(a.price) || 0), 0)
        return { total, confirmed, pending, revenue }
    }, [appointments, currentDate])

    return (
        <div className="min-h-screen bg-gray-50">
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
                        <div className="flex items-center gap-2">
                            {isDebugEnabled && (
                                <Button variant="outline" size="sm" onClick={() => setShowDebug(v => !v)}>
                                    {showDebug ? "Masquer debug" : "Afficher debug"}
                                </Button>
                            )}
                            <Link href="/admin/appointments/new">
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouveau RDV
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading && <p className="text-sm text-gray-600">Chargement des rendez-vous…</p>}
                {error && !loading && <p className="text-sm text-red-600">Erreur : {error}</p>}

                {showDebug && (
                    <Card className="mb-6">
                        <CardContent className="p-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="font-semibold mb-1">Résumé</div>
                                    <pre className="whitespace-pre-wrap">
{`count=${appointments.length}
selectedDate=${selectedDate || "(none)"}
currentMonth=${currentDate.getMonth()+1}/${currentDate.getFullYear()}`}
                  </pre>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="font-semibold mb-1">Échantillon (5)</div>
                                    <pre className="overflow-auto max-h-40 bg-gray-50 p-2 rounded">
{JSON.stringify(appointments.slice(0,5), null, 2)}
                  </pre>
                                </div>
                            </div>
                            {selectedDate && (
                                <>
                                    <div className="font-semibold mt-3 mb-1">Rdv du {selectedDate}</div>
                                    <pre className="overflow-auto max-h-40 bg-gray-50 p-2 rounded">
{JSON.stringify(selectedDateAppointments, null, 2)}
                  </pre>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <Card>
                            <CardContent className="p-6">
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

                                <div className="grid grid-cols-7 gap-1">
                                    {daysOfWeek.map((day) => (
                                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                                            {day}
                                        </div>
                                    ))}

                                    {calendarDays.map((date, index) => {
                                        const dayAppointments = getAppointmentsForDate(date)
                                        const dateString = toLocalYMD(date)
                                        const isSelected = selectedDate === dateString

                                        return (
                                            <div
                                                key={index}
                                                className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                                                    isCurrentMonth(date) ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"
                                                } ${isToday(date) ? "ring-2 ring-orange-500 bg-orange-50" : ""} ${
                                                    isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                                                }`}
                                                onClick={() => {
                                                    debugLog("DEBUG: click day", { dateString, count: dayAppointments.length, items: dayAppointments })
                                                    setSelectedDate(dateString)
                                                }}
                                            >
                                                <div
                                                    className={`text-sm font-medium mb-1 ${
                                                        isToday(date) ? "text-orange-600" : isCurrentMonth(date) ? "text-gray-900" : "text-gray-400"
                                                    }`}
                                                >
                                                    {date.getDate()}
                                                </div>

                                                <div className="space-y-1">
                                                    {dayAppointments.slice(0, 3).map((apt, aptIndex) => (
                                                        <div
                                                            key={aptIndex}
                                                            className={`text-xs p-1 rounded text-white truncate ${colorForService(apt.serviceName)}`}
                                                            title={`${apt.time} - ${apt.firstName} ${apt.lastName} (${apt.serviceName})`}
                                                        >
                                                            {apt.time} {(apt.firstName || apt.lastName) ? `${apt.firstName} ${apt.lastName}`.trim() : "Client"}
                                                        </div>
                                                    ))}
                                                    {dayAppointments.length > 3 && (
                                                        <div className="text-xs text-gray-500 font-medium">+{dayAppointments.length - 3} autres</div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
                                {(() => {
                                    const uniqueServices = Array.from(new Set(appointments.map(a => a.serviceName))).filter(Boolean)
                                    if (uniqueServices.length === 0) {
                                        return <p className="text-sm text-gray-500">Aucun service à afficher pour la période.</p>
                                    }
                                    return (
                                        <div className="space-y-2">
                                            {uniqueServices.map(svc => (
                                                <div key={svc} className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded ${colorForService(svc)}`} />
                                                    <span className="text-sm">{svc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })()}
                            </CardContent>
                        </Card>

                        {selectedDate && (
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        {(() => {
                                            const [y, m, d] = selectedDate.split("-").map(Number)
                                            const localDate = new Date(y, m - 1, d)
                                            return localDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                                        })()}
                                    </h3>

                                    {selectedDateAppointments.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Aucun rendez-vous ce jour</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedDateAppointments.map((apt) => (
                                                <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <div className="font-medium text-sm">
                                                                {(apt.firstName || apt.lastName) ? `${apt.firstName} ${apt.lastName}`.trim() : "Client"}
                                                            </div>
                                                            <div className="text-xs text-gray-600 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {apt.time}
                                                            </div>
                                                        </div>
                                                        <Badge className={getStatusColor(apt.status)} variant="outline">
                                                            {apt.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <Badge className={`${colorForService(apt.serviceName)} text-white`} variant="outline">
                                                            {apt.serviceName || "Service"}
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

                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Ce mois</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total RDV:</span>
                                        <span className="font-medium">{stats.total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Confirmés:</span>
                                        <span className="font-medium text-green-600">{stats.confirmed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">En attente:</span>
                                        <span className="font-medium text-yellow-600">{stats.pending}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">CA prévu:</span>
                                        <span className="font-medium">{stats.revenue}€</span>
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