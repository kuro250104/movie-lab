"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, RefreshCw } from "lucide-react"

type Rule = {
    id: number
    weekday: number
    startMinute: number
    endMinute: number
    isActive: boolean
    createdAt?: string
}

type Exception = {
    id: number
    date: string // YYYY-MM-DD
    start_minute: number | null
    end_minute: number | null
    is_available: boolean
    note: string | null
    created_at?: string
}

const WEEKDAYS = [
    { value: 0, label: "Dimanche" },
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
]

const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return 0
    return h * 60 + m
}
const toHHMM = (min: number) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0")
    const m = String(min % 60).padStart(2, "0")
    return `${h}:${m}`
}

export function AvailabilityManager({ coachId }: { coachId: number }) {
    const [loading, setLoading] = useState(true)

    // rules
    const [rules, setRules] = useState<Rule[]>([])
    const [ruleWeekday, setRuleWeekday] = useState<number>(1)
    const [ruleStart, setRuleStart] = useState("09:00")
    const [ruleEnd, setRuleEnd] = useState("18:00")

    // exceptions
    const [exceptions, setExceptions] = useState<Exception[]>([])
    const [excDate, setExcDate] = useState<string>("")
    const [excWholeDayBlocked, setExcWholeDayBlocked] = useState<boolean>(false)
    const [excAvailable, setExcAvailable] = useState<boolean>(true) // true=fenêtre dispo ; false=jour bloqué
    const [excStart, setExcStart] = useState("10:00")
    const [excEnd, setExcEnd] = useState("12:00")
    const [excNote, setExcNote] = useState<string>("")

    const base = useMemo(() => `/api/admin/coaches/${coachId}/availability`, [coachId])

    async function reloadAll() {
        setLoading(true)
        try {
            const [r1, r2] = await Promise.all([
                fetch(`${base}/rules`),
                fetch(`${base}/exceptions`)
            ])
            if (!r1.ok) throw new Error("load rules failed")
            if (!r2.ok) throw new Error("load exceptions failed")

            const rulesData = await r1.json()
            const excData = await r2.json()
            setRules(rulesData)
            setExceptions(excData)
        } catch (e) {
            console.error(e)
            alert("Erreur chargement des disponibilités.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        reloadAll()
    }, [coachId])

    const addRule = async () => {
        const start_minute = toMin(ruleStart)
        const end_minute = toMin(ruleEnd)
        if (end_minute <= start_minute) {
            alert("Heure de fin doit être > heure de début.")
            return
        }
        try {
            const r = await fetch(`${base}/rules`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    weekday: ruleWeekday,
                    startMinute: start_minute,
                    endMinute: end_minute,
                    isActive: true,
                }),
            })
            if (!r.ok) throw new Error("create rule failed")
            const newRule = await r.json()
            setRules((prev) => [...prev, newRule].sort(sortRules))
        } catch (e) {
            console.error(e)
            alert("Erreur lors de l’ajout de la règle.")
        }
    }

    const toggleRule = async (rule: Rule) => {
        try {
            const r = await fetch(`${base}/rules/${rule.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !rule.isActive }),
            })
            if (!r.ok) throw new Error("toggle rule failed")
            const updated = await r.json()
            setRules((prev) => prev.map((x) => (x.id === rule.id ? updated : x)).sort(sortRules))
        } catch (e) {
            console.error(e)
            alert("Erreur lors du changement d’état de la règle.")
        }
    }

    const deleteRule = async (ruleId: number) => {
        if (!confirm("Supprimer cette règle ?")) return
        try {
            const r = await fetch(`${base}/rules/${ruleId}`, { method: "DELETE" })
            if (!r.ok) throw new Error("delete rule failed")
            setRules((prev) => prev.filter((x) => x.id !== ruleId))
        } catch (e) {
            console.error(e)
            alert("Erreur lors de la suppression.")
        }
    }

    // ---- EXCEPTIONS handlers ----
    const addException = async () => {
        if (!excDate) {
            alert("Choisis une date.")
            return
        }

        let payload: any = { date: excDate, isAvailable: excAvailable, note: excNote || null }
        if (excAvailable) {
            // fenêtre dispo requise
            const start_minute = toMin(excStart)
            const end_minute = toMin(excEnd)
            if (end_minute <= start_minute) {
                alert("Heure de fin doit être > heure de début.")
                return
            }
            payload.startMinute = start_minute
            payload.endMinute = end_minute
        } else {
            // journée bloquée
            payload.startMinute = null
            payload.endMinute = null
        }

        try {
            const r = await fetch(`${base}/exceptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!r.ok) throw new Error("create exception failed")
            const row = await r.json()
            // upsert (le POST fait un upsert côté API)
            setExceptions((prev) => {
                const idx = prev.findIndex((x) => x.id === row.id)
                if (idx === -1) return [row, ...prev].sort(sortExceptions)
                const copy = [...prev]
                copy[idx] = row
                return copy.sort(sortExceptions)
            })
            // reset form
            setExcNote("")
        } catch (e) {
            console.error(e)
            alert("Erreur lors de l’enregistrement de l’exception.")
        }
    }

    const deleteException = async (excId: number) => {
        if (!confirm("Supprimer cette exception ?")) return
        try {
            const r = await fetch(`${base}/exceptions/${excId}`, { method: "DELETE" })
            if (!r.ok) throw new Error("delete exception failed")
            setExceptions((prev) => prev.filter((x) => x.id !== excId))
        } catch (e) {
            console.error(e)
            alert("Erreur lors de la suppression.")
        }
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Règles hebdo */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Règles hebdomadaires</CardTitle>
                    <Button variant="ghost" size="icon" onClick={reloadAll} title="Recharger">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Formulaire ajout règle */}
                    <div className="grid sm:grid-cols-5 gap-3 items-end">
                        <div className="sm:col-span-2">
                            <Label>Jour</Label>
                            <Select
                                value={String(ruleWeekday)}
                                onValueChange={(v) => setRuleWeekday(Number(v))}
                            >
                                <SelectTrigger><SelectValue placeholder="Jour" /></SelectTrigger>
                                <SelectContent>
                                    {WEEKDAYS.map((d) => (
                                        <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Début</Label>
                            <Input type="time" value={ruleStart} onChange={(e) => setRuleStart(e.target.value)} />
                        </div>
                        <div>
                            <Label>Fin</Label>
                            <Input type="time" value={ruleEnd} onChange={(e) => setRuleEnd(e.target.value)} />
                        </div>
                        <div className="sm:col-span-1">
                            <Button onClick={addRule} className="w-full">
                                <Plus className="w-4 h-4 mr-2" /> Ajouter
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
                        {!loading && rules.length === 0 && (
                            <p className="text-sm text-muted-foreground">Aucune règle pour l’instant.</p>
                        )}
                        {!loading && rules.map((r) => (
                            <div key={r.id} className="flex items-center justify-between border rounded-xl p-3">
                                <div>
                                    <div className="font-medium">
                                        {WEEKDAYS.find((d) => d.value === r.weekday)?.label}{" "}
                                        <span className="text-muted-foreground">
                                            ({toHHMM(r.startMinute)}–{toHHMM(r.endMinute)})
                                        </span>
                                        <div className="text-xs text-muted-foreground">
                                            Créé le {new Date(r.createdAt ?? Date.now()).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Actif</span>
                                        <Switch checked={r.isActive} onCheckedChange={() => toggleRule(r)} />
                                    </div>
                                    <Button variant="outline" size="icon" onClick={() => deleteRule(r.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Exceptions ponctuelles */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Exceptions ponctuelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Formulaire ajout exception */}
                    <div className="grid sm:grid-cols-6 gap-3 items-end">
                        <div className="sm:col-span-2">
                            <Label>Date</Label>
                            <Input type="date" value={excDate} onChange={(e) => setExcDate(e.target.value)} />
                        </div>

                        <div className="sm:col-span-2">
                            <Label>Type</Label>
                            <Select
                                value={excAvailable ? "window" : "blocked"}
                                onValueChange={(v) => {
                                    const avail = v === "window"
                                    setExcAvailable(avail)
                                    setExcWholeDayBlocked(!avail)
                                }}
                            >
                                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="window">Fenêtre disponible</SelectItem>
                                    <SelectItem value="blocked">Journée bloquée</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {excAvailable ? (
                            <>
                                <div>
                                    <Label>Début</Label>
                                    <Input type="time" value={excStart} onChange={(e) => setExcStart(e.target.value)} />
                                </div>
                                <div>
                                    <Label>Fin</Label>
                                    <Input type="time" value={excEnd} onChange={(e) => setExcEnd(e.target.value)} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="sm:col-span-2">
                                    <Label>Bloqué toute la journée</Label>
                                    <div className="h-10 flex items-center"><span className="text-sm text-muted-foreground">Oui</span></div>
                                </div>
                            </>
                        )}

                        <div className="sm:col-span-6">
                            <Label>Note (optionnel)</Label>
                            <Input placeholder="Ex : Fermé pour formation" value={excNote} onChange={(e) => setExcNote(e.target.value)} />
                        </div>

                        <div className="sm:col-span-6">
                            <Button onClick={addException} className="w-full sm:w-auto">
                                <Plus className="w-4 h-4 mr-2" /> Enregistrer l’exception
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Liste exceptions */}
                    <div className="space-y-2">
                        {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
                        {!loading && exceptions.length === 0 && (
                            <p className="text-sm text-muted-foreground">Aucune exception pour l’instant.</p>
                        )}
                        {!loading && exceptions.map((e) => (
                            <div key={e.id} className="flex items-center justify-between border rounded-xl p-3">
                                <div className="space-y-0.5">
                                    <div className="font-medium">{formatDate(e.date)}</div>
                                    {e.is_available ? (
                                        <div className="text-sm text-muted-foreground">
                                            Disponible {toHHMM(e.start_minute ?? 0)}–{toHHMM(e.end_minute ?? 0)}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">Journée bloquée</div>
                                    )}
                                    {e.note && <div className="text-xs text-muted-foreground">Note : {e.note}</div>}
                                </div>
                                <Button variant="outline" size="icon" onClick={() => deleteException(e.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// ----- helpers -----
const sortRules = (a: Rule, b: Rule) =>
    a.weekday - b.weekday || a.startMinute - b.startMinute

const sortExceptions = (a: Exception, b: Exception) =>
    (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)

function formatDate(d: string) {
    if (!d) return "—"
    const iso = d.includes("T") ? d : `${d}T00:00:00`
    const dt = new Date(iso)
    return Number.isNaN(dt.getTime())
        ? d
        : dt.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
}