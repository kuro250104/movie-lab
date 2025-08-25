"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewClientPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        city: "",
        postalCode: "",
        emergencyContact: "",
        emergencyPhone: "",
        medicalNotes: "",
        runningExperience: "",
        goals: "",
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulation d'une sauvegarde
        setTimeout(() => {
            setLoading(false)
            alert("Client créé avec succès !")
            router.push("/admin/clients")
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/clients">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <UserPlus className="w-6 h-6 text-orange-600" />
                                Nouveau Client
                            </h1>
                            <p className="text-gray-600">Ajouter un nouveau client à la base de données</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">Prénom *</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Nom *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="dateOfBirth">Date de naissance</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Adresse */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Adresse</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">Ville</Label>
                                    <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="postalCode">Code postal</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact d'urgence */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact d'urgence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="emergencyContact">Nom du contact</Label>
                                    <Input
                                        id="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="emergencyPhone">Téléphone d'urgence</Label>
                                    <Input
                                        id="emergencyPhone"
                                        value={formData.emergencyPhone}
                                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations sportives */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations sportives</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="runningExperience">Niveau de course</Label>
                                <Select onValueChange={(value) => handleInputChange("runningExperience", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Débutant">Débutant</SelectItem>
                                        <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                                        <SelectItem value="Avancé">Avancé</SelectItem>
                                        <SelectItem value="Expert">Expert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="goals">Objectifs</Label>
                                <Textarea
                                    id="goals"
                                    value={formData.goals}
                                    onChange={(e) => handleInputChange("goals", e.target.value)}
                                    placeholder="Décrivez les objectifs du client..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="medicalNotes">Notes médicales</Label>
                                <Textarea
                                    id="medicalNotes"
                                    value={formData.medicalNotes}
                                    onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
                                    placeholder="Blessures, contre-indications, remarques médicales..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/clients">
                            <Button variant="outline">Annuler</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                            {loading ? (
                                "Enregistrement..."
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
