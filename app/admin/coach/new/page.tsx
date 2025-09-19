"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"

// mock services (remplace par fetch)
const services = [
    { id: 1, name: "Bilan course à pied", price: 120 },
    { id: 2, name: "Coaching nutrition", price: 90 },
]

export default function NewCoachPage() {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "", city: "",
        status: "Actif", runningExperience: "Intermédiaire", serviceIds: [] as number[]
    })

    const toggleService = (id: number, checked: boolean) => {
        setForm(s => ({
            ...s,
            serviceIds: checked ? [...s.serviceIds, id] : s.serviceIds.filter(x => x !== id)
        }))
    }

    const submit = async () => {
        // TODO: POST /api/admin/coaches
        console.log("SUBMIT NEW COACH", form)
        history.back()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/admin/coach">
                        <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Nouveau coach</h1>
                    <div />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-8">
                <Card>
                    <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label>Prénom</Label><Input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
                            <div><Label>Nom</Label><Input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
                            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                            <div><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                            <div><Label>Ville</Label><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
                            <div>
                                <Label>Statut</Label>
                                <Select value={form.status} onValueChange={(v) => setForm({...form, status: v})}>
                                    <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
                                    <SelectContent><SelectItem value="Actif">Actif</SelectItem><SelectItem value="Inactif">Inactif</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Niveau course</Label>
                                <Select value={form.runningExperience} onValueChange={(v) => setForm({...form, runningExperience: v})}>
                                    <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Débutant">Débutant</SelectItem>
                                        <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                                        <SelectItem value="Avancé">Avancé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Services</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {services.map(s => (
                                    <label key={s.id} className="flex items-center gap-2 p-2 rounded border bg-white">
                                        <Checkbox checked={form.serviceIds.includes(s.id)} onCheckedChange={(ch) => toggleService(s.id, Boolean(ch))} />
                                        <span className="flex-1 font-medium">{s.name} <span className="text-gray-500">({s.price}€)</span></span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => history.back()}>Annuler</Button>
                            <Button className="bg-orange-600 hover:bg-orange-700" onClick={submit}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}