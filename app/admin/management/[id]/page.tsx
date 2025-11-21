"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    Users,
    Shield,
    UserCog,
    Eye,
    EyeOff,
    Trash2,
} from "lucide-react"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

type AdminRole = "admin" | "coach"

type AdminAccount = {
    id: number
    email: string
    name: string
    role: AdminRole
    createdAt: string
}

export default function EditManagementAccountPage() {
    const params = useParams() as { id: string }
    const id = params.id
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [role, setRole] = useState<AdminRole>("coach")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(`/api/admin/management/${id}`, {
                    credentials: "include",
                })
                const body = await res.json()
                if (!res.ok) {
                    throw new Error(body.error || "Erreur chargement compte")
                }
                const acc = body as AdminAccount
                setRole(acc.role)
                setName(acc.name)
                setEmail(acc.email)
            } catch (e: any) {
                console.error(e)
                setError(e?.message ?? "Erreur inconnue")
            } finally {
                setLoading(false)
            }
        })()
    }, [id])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password || passwordConfirm) {
            if (password !== passwordConfirm) {
                setError("Les mots de passe ne correspondent pas")
                return
            }
            if (password.length < 8) {
                setError("Le mot de passe doit faire au moins 8 caractères")
                return
            }
        }

        try {
            setSaving(true)
            setError(null)

            const payload: any = {
                role,
                name,
                email,
            }

            if (password) {
                payload.password = password
            }

            const res = await fetch(`/api/admin/management/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            })
            const body = await res.json()

            if (!res.ok) {
                throw new Error(body.error || "Erreur mise à jour compte")
            }

            router.push("/admin/management")
        } catch (e: any) {
            setError(e?.message ?? "Erreur inconnue")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Supprimer ce compte ?")) return
        try {
            setDeleting(true)
            setError(null)
            const res = await fetch(`/api/admin/management/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            const body = await res.json().catch(() => ({}))
            if (!res.ok) {
                throw new Error(body.error || "Erreur suppression compte")
            }
            router.push("/admin/management")
        } catch (e: any) {
            setError(e?.message ?? "Erreur inconnue")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/management">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />{" "}
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-orange-600" />{" "}
                                    Modifier le compte
                                </h1>
                                <p className="text-gray-600">
                                    ID #{id} — Admin / Coach
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-10">
                <Card>
                    <CardContent className="p-6 md:p-8">
                        {loading ? (
                            <p className="text-sm text-gray-500">
                                Chargement…
                            </p>
                        ) : (
                            <form
                                className="space-y-6"
                                onSubmit={handleSave}
                            >
                                {/* Rôle */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Rôle</Label>
                                        <Select
                                            value={role}
                                            onValueChange={(v: AdminRole) =>
                                                setRole(v)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un rôle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="coach">
                                                    <div className="flex items-center gap-2">
                                                        <UserCog className="w-4 h-4 text-emerald-600" />
                                                        <span>Coach</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="w-4 h-4 text-purple-600" />
                                                        <span>Admin</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Infos de base */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nom complet</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Mot de passe (optionnel) */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>
                                            Nouveau mot de passe (optionnel)
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Laisser vide pour ne pas changer"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword((s) => !s)
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Confirmation (si mot de passe)
                                        </Label>
                                        <Input
                                            type="password"
                                            value={passwordConfirm}
                                            onChange={(e) =>
                                                setPasswordConfirm(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Laisser vide si pas de changement"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <div className="flex justify-between gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-red-600 border-red-200"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {deleting
                                            ? "Suppression…"
                                            : "Supprimer le compte"}
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                router.push(
                                                    "/admin/management",
                                                )
                                            }
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-orange-600 hover:bg-orange-700"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Enregistrement…"
                                                : "Mettre à jour"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}