"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calendar,
    Plus,
    Edit,
    Trash2,
    Clock,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Euro,
    RefreshCcw,
    CalendarDays
} from "lucide-react"
import Link from "next/link"
import { debugLog, isDebugEnabled } from "@/lib/debugLog"
import { LoadingPage } from "@/components/loading-spinner"

type SourceType = "appointment" | "request"

type Appointment = {
    id: number
    date: string        // YYYY-MM-DD (local)
    time: string        // HH:mm (local)
    lastName: string
    firstName: string
    clientEmail: string
    serviceName: string
    price: number
    status: string
    paymentStatus: string | null
    notes: string | null
    source: SourceType   // <- NEW: "appointment" ou "request"
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
        case "En attente coach":                // <- NEW label
            return "bg-amber-100 text-amber-800 border-amber-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

function getPaymentColor(status?: string | null) {
    switch ((status || "").toLowerCase()) {
        case "paid":
        case "payé":
            return "bg-emerald-100 text-emerald-800 border-emerald-200"
        case "refunded":
        case "remboursé":
            return "bg-blue-100 text-blue-800 border-blue-200"
        case "failed":
        case "échoué":
            return "bg-red-100 text-red-800 border-red-200"
        case "pending":
        case "en attente":
        case "unpaid":
        case "impayé":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
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

function tryDate(value: any): Date | null {
    if (!value) return null
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
}

function euro(n: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number.isFinite(n) ? n : 0)
}

export default function AppointmentsCalendarPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showDebug, setShowDebug] = useState(false)
    const [showRequests, setShowRequests] = useState(true) // <- NEW toggle

    useEffect(() => {
      setSelectedDate(toLocalYMD(new Date()))
    }, [])

    const mapAppointment = (r: any): Appointment => {
        const startsAt =
            tryDate(r.startsAt) ||
            tryDate(r.starts_at) ||
            tryDate(r.start) ||
            tryDate(r.begin_at)

        const dateStr = r.date || (startsAt ? toLocalYMD(startsAt) : "")
        const timeStr =
            r.time ||
            (startsAt
                ? startsAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                : "")

        return {
            id: Number(r.id),
            date: String(dateStr || ""),
            time: String(timeStr || ""),
            firstName: String(r.firstName ?? r.first_name ?? r.clientFirstName ?? r.customer_first_name ?? ""),
            lastName:  String(r.lastName  ?? r.last_name  ?? r.clientLastName  ?? r.customer_last_name  ?? ""),
            clientEmail: String(r.clientEmail ?? r.client_email ?? r.customer_email ?? ""),
            serviceName: String(r.serviceName ?? r.service ?? r.service_name ?? ""),
            price: Number(r.price ?? r.servicePrice ?? r.total ?? 0),
            status: String(r.status ?? ""),
            paymentStatus: (r.paymentStatus ?? r.payment_status ?? null) || null,
            notes: r.notes ?? r.comment ?? null,
            source: "appointment",
        }
    }

    // Map des demandes (appointment_requests pending) vers le même type
    const mapRequest = (r: any): Appointment => {
        const startsAt =
            tryDate(r.startsAt) ||
            tryDate(r.starts_at)

        const dateStr = r.date || (startsAt ? toLocalYMD(startsAt) : "")
        const timeStr =
            r.time ||
            (startsAt
                ? startsAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                : "")

        // r.customer_name, r.customer_email, r.service_name
        const customerName: string = String(r.customer_name ?? r.customerName ?? "")
        const [firstName, ...rest] = customerName.split(" ")
        const lastName = rest.join(" ")

        return {
            id: Number(r.id),
            date: String(dateStr || ""),
            time: String(timeStr || ""),
            firstName: firstName || "",
            lastName: lastName || "",
            clientEmail: String(r.customer_email ?? r.client_email ?? r.email ?? ""),
            serviceName: String(r.service_name ?? r.serviceName ?? ""),
            price: Number(r.service_price ?? r.price ?? 0),
            status: "En attente coach",
            paymentStatus: null,
            notes: r.notes ?? null,
            source: "request",
        }
    }

// 1) remplace ta fonction fetchAppointments par :
    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // Fenêtre du mois courant (optionnel mais recommandé)
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            const pad = (n: number) => String(n).padStart(2, "0")
            const from = `${monthStart.getFullYear()}-${pad(monthStart.getMonth()+1)}-01`
            const to   = `${monthEnd.getFullYear()}-${pad(monthEnd.getMonth()+1)}-01`

            const include = showRequests ? "1" : "0"
            const url = `/api/admin/appointments?includeRequests=${include}&from=${from}&to=${to}&order=asc&limit=1000`

            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
                headers: { "Accept": "application/json" }
            })
            if (!res.ok) {
                let msg = "Erreur réseau (appointments)"
                try { msg = (await res.json())?.error || msg } catch {}
                throw new Error(msg)
            }

            const raw = await res.json()

            // Le backend renvoie déjà `source: "appointment" | "request"`
            const mapped: Appointment[] = (Array.isArray(raw) ? raw : []).map((r: any) => {
                const startsAt = r.startsAt || r.starts_at
                const d = startsAt ? new Date(startsAt) : null
                const date = d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` : (r.date || "")
                const time = d ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : (r.time || "")

                const isRequest = r.source === "request"
                // Nom client côté requests : r.customerName (string "Prénom Nom")
                let firstName = String(r.firstName ?? r.first_name ?? "")
                let lastName  = String(r.lastName  ?? r.last_name  ?? "")
                if (isRequest && !firstName && !lastName) {
                    const full = String(r.customerName ?? r.customer_name ?? "")
                    const [f, ...rest] = full.split(" ")
                    firstName = f || ""
                    lastName = rest.join(" ")
                }

                return {
                    id: Number(r.id),
                    date,
                    time,
                    firstName,
                    lastName,
                    clientEmail: String(r.customerEmail ?? r.customer_email ?? r.clientEmail ?? ""),
                    serviceName: String(r.serviceName ?? r.service_name ?? ""),
                    price: Number(r.servicePrice ?? r.price ?? 0),
                    status: isRequest ? "En attente coach" : String(r.status ?? ""),
                    paymentStatus: isRequest ? null : (r.paymentStatus ?? r.payment_status ?? null),
                    notes: r.notes ?? null,
                    source: isRequest ? "request" : "appointment",
                }
            })

            setAppointments(mapped)
        } catch (e: any) {
            console.error("Erreur chargement:", e)
            setError(e?.message ?? "Erreur inconnue")
        } finally {
            setLoading(false)
        }
    }, [currentDate, showRequests])
    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const firstDay = new Date(year, month, 1)
        const jsDow = firstDay.getDay() // 0=Dim
        const mondayIndex = jsDow === 0 ? 6 : jsDow - 1
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - mondayIndex)
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
                `DEBUG: day ${dateString} -> ${filtered.length} items`,
                filtered.map(a => ({
                    id: a.id,
                    time: a.time,
                    client: `${a.firstName} ${a.lastName}`,
                    service: a.serviceName,
                    source: a.source
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

    const goToday = () => {
        setCurrentDate(new Date())
        setSelectedDate(toLocalYMD(new Date()))
    }

    const calendarDays = useMemo(() => generateCalendarDays(), [currentDate])

    const selectedDateAppointments = useMemo(() => {
      const items = selectedDate ? appointments.filter(a => a.date === selectedDate) : []
      return items.sort((a, b) => (a.time || "").localeCompare((b.time || "")))
    }, [appointments, selectedDate])

    const stats = useMemo(() => {
        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2,"0")}`
        const inMonth = appointments.filter(a => a.date.startsWith(monthKey))
        const total = inMonth.length
        const confirmed = inMonth.filter(a => ["Confirmé","Confirmed"].includes(a.status)).length
        const pending = inMonth.filter(a => ["En attente","Pending","En attente coach"].includes(a.status)).length
        const revenue = inMonth.reduce((sum, a) => sum + (a.source === "appointment" ? (Number(a.price) || 0) : 0), 0)
        return { total, confirmed, pending, revenue }
    }, [appointments, currentDate])

    if (loading) {
        return <LoadingPage message="Chargement des rendez-vous…" variant="bars" size="md" />
    }

    const isToday = (date: Date) => new Date().toDateString() === date.toDateString()
    const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth()

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
                            <Button variant={showRequests ? "default" : "outline"} size="sm" onClick={() => setShowRequests(v => !v)} title="Afficher les demandes en attente">
                                {showRequests ? "Masquer demandes" : "Afficher demandes"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={goToday} title="Aujourd'hui">
                                <CalendarDays className="w-4 h-4 mr-1" />
                                Today
                            </Button>
                            <Button variant="outline" size="sm" onClick={fetchAppointments} title="Recharger">
                                <RefreshCcw className="w-4 h-4 mr-1" />
                                Reload
                            </Button>
                            {isDebugEnabled && (
                                <Button variant="outline" size="sm" onClick={() => setShowDebug(v => !v)}>
                                    {showDebug ? "Masquer debug" : "Afficher debug"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {error && !loading && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">
                        Erreur : {error}
                    </div>
                )}

                {showDebug && (
                    <Card className="mb-6">
                        <CardContent className="p-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="font-semibold mb-1">Résumé</div>
                                    <pre className="whitespace-pre-wrap">{`count=${appointments.length}
selectedDate=${selectedDate || "(none)"}
currentMonth=${currentDate.getMonth()+1}/${currentDate.getFullYear()}`}</pre>
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
                                    <div className="font-semibold mt-3 mb-1">Items du {selectedDate}</div>
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

                                {appointments.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-gray-600 bg-gray-50 rounded-lg">
                                        Aucun rendez-vous ni demande à afficher pour le moment.
                                    </div>
                                ) : (
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
                                                        {dayAppointments.slice(0, 3).map((apt, aptIndex) => {
                                                            const isRequest = apt.source === "request"
                                                            return (
                                                                <div
                                                                    key={`${apt.source}-${apt.id}-${aptIndex}`}
                                                                    className={`text-xs p-1 rounded truncate flex items-center justify-between ${
                                                                        isRequest
                                                                            ? "bg-white text-gray-800 border border-dashed border-amber-400"
                                                                            : `${colorForService(apt.serviceName)} text-white`
                                                                    }`}
                                                                    title={`${apt.time} - ${apt.firstName} ${apt.lastName} (${apt.serviceName})`}
                                                                >
                                  <span className="truncate">
                                    {apt.time} {(apt.firstName || apt.lastName) ? `${apt.firstName} ${apt.lastName}`.trim() : "Client"}
                                  </span>
                                                                    {isRequest && (
                                                                        <span className="ml-2 text-[10px] px-1 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                      En attente coach
                                    </span>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                        {dayAppointments.length > 3 && (
                                                            <div className="text-xs text-gray-500 font-medium">+{dayAppointments.length - 3} autres</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded border border-dashed border-amber-500 bg-white" />
                                        <span className="text-sm">Demande en attente de coach</span>
                                    </div>
                                    {(() => {
                                        const uniqueServices = Array.from(new Set(appointments
                                            .filter(a => a.source === "appointment")
                                            .map(a => a.serviceName))).filter(Boolean)
                                        if (uniqueServices.length === 0) {
                                            return <p className="text-sm text-gray-500">Aucun service confirmé à afficher.</p>
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
                                </div>
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
                                        <p className="text-gray-500 text-sm">Aucun élément ce jour</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedDateAppointments.map((apt, idx) => {
                                                const isRequest = apt.source === "request"
                                                return (
                                                    <div key={`${apt.source}-${apt.id}-${idx}`} className={`p-3 rounded-lg ${isRequest ? "bg-amber-50 border border-dashed border-amber-200" : "bg-gray-50"}`}>
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
                                                                {apt.status || (isRequest ? "En attente coach" : "—")}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <Badge className={`${isRequest ? "border-amber-300 text-amber-800 bg-amber-100" : `${colorForService(apt.serviceName)} text-white`}`} variant="outline">
                                                                {apt.serviceName || "Service"}
                                                            </Badge>
                                                            <div className="flex items-center gap-2">
                                                                {!isRequest && apt.paymentStatus && (
                                                                    <Badge className={getPaymentColor(apt.paymentStatus)} variant="outline">
                                                                        {apt.paymentStatus}
                                                                    </Badge>
                                                                )}
                                                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                                                    <Euro className="w-3 h-3" />
                                                                    {euro(apt.price)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {apt.notes && (
                                                            <div className="mt-2 text-xs text-gray-600">
                                                                {apt.notes}
                                                            </div>
                                                        )}

                                                        <div className="flex gap-1 mt-2">
                                                            {isRequest ? (
                                                                <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                                                                    <Plus className="w-3 h-3 mr-1" />
                                                                    Assigner un coach
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                                                                        <Edit className="w-3 h-3 mr-1" />
                                                                        Modifier
                                                                    </Button>
                                                                    <Button size="sm" variant="outline" className="h-6 text-xs text-red-600 bg-transparent">
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
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
                                        <span className="text-gray-600">Total (rdv + demandes):</span>
                                        <span className="font-medium">{stats.total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Confirmés:</span>
                                        <span className="font-medium text-green-600">{stats.confirmed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">En attente (incl. demandes):</span>
                                        <span className="font-medium text-yellow-600">{stats.pending}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">CA prévu (confirmés):</span>
                                        <span className="font-medium">{euro(stats.revenue)}</span>
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