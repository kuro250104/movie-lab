"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

type AdminRole = "admin" | "coach"

export default function NewManagementAccountPage() {
    const router = useRouter()
    const [role, setRole] = useState<AdminRole>("coach")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== passwordConfirm) {
            setError("Les mots de passe ne correspondent pas")
            return
        }

        try {
            setLoading(true)
            setError(null)

            const res = await fetch("/api/admin/management", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    role,
                    name,
                    email,
                    password,
                }),
            })

            const body = await res.json()

            if (!res.ok) {
                throw new Error(body.error || "Erreur création compte")
            }

            router.push("/admin/management")
        } catch (e: any) {
            setError(e?.message ?? "Erreur inconnue")
        } finally {
            setLoading(false)
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
                                    Nouveau compte
                                </h1>
                                <p className="text-gray-600">
                                    Créez un compte admin ou coach pour accéder
                                    à l&apos;interface.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-10">
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                    <p className="text-xs text-gray-500">
                                        Les admins ont accès complet au
                                        dashboard. Les coachs auront un accès
                                        limité (configurable plus tard).
                                    </p>
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
                                        placeholder="Ex : Jean Dupont"
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
                                        placeholder="exemple@domaine.fr"
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mot de passe</Label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            minLength={8}
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
                                    <p className="text-xs text-gray-500">
                                        Minimum 8 caractères.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Confirmation du mot de passe</Label>
                                    <Input
                                        type="password"
                                        value={passwordConfirm}
                                        onChange={(e) =>
                                            setPasswordConfirm(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.push("/admin/management")
                                    }
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-orange-600 hover:bg-orange-700"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Création…"
                                        : "Créer le compte"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}