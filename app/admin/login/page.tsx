"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, AlertCircle, Info } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/admin/me")
                if (res.ok) {
                    router.push("/admin/dashboard")
                }
            } catch (err) {

            }
        }
        checkAuth()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })

            if (response.ok) {
                console.log("✅ Redirection vers dashboard...")
                router.push("/admin/dashboard")
            } else {
                const data = await response.json()
                setError(data?.error || "Erreur de connexion")
            }
        } catch {
            setError("Erreur de connexion")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="relative h-16 w-16">
                                <Image src="/logo.png" alt="Logo Movilab" fill className="object-contain" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">Administration movi-lab</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="password"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl"
                            >
                                {loading ? "Connexion..." : "Se connecter"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}