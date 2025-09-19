import { type NextRequest, NextResponse } from "next/server"
import { authenticateAdmin, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
        }

        const admin = await authenticateAdmin(email, password)

        if (!admin) {
            return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
        }

        const token = await generateToken(admin)

        const response = NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        })

        response.cookies.set("admin-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60,
        })

        return response
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}