import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

type AdminRole = "admin" | "coach"

type AdminAccount = {
    id: number
    email: string
    name: string
    role: AdminRole
    createdAt: string
}

export async function GET() {
    const rows = await sql/* sql */<AdminAccount[]>`
        SELECT
            id,
            email,
            name,
            role,
            created_at AS "createdAt"
        FROM public.admins
        WHERE role IN ('admin', 'coach')
        ORDER BY created_at DESC
    `

    return NextResponse.json(rows)
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const role = (body.role ?? "admin") as AdminRole
        const email = (body.email ?? "").trim().toLowerCase()
        const name = (body.name ?? "").trim()
        const password = (body.password ?? "").trim()

        // 🔎 validations simples
        if (!["admin", "coach"].includes(role)) {
            return NextResponse.json(
                { error: "role must be 'admin' or 'coach'" },
                { status: 400 },
            )
        }

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 },
            )
        }

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 },
            )
        }

        if (!password || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 },
            )
        }

        // 🔐 hash du mot de passe
        const passwordHash = await bcrypt.hash(password, 12)

        const rows = await sql/* sql */<AdminAccount[]>`
            INSERT INTO public.admins (
                email,
                password_hash,
                name,
                role
            ) VALUES (
                ${email},
                ${passwordHash},
                ${name},
                ${role}
            )
            RETURNING
                id,
                email,
                name,
                role,
                created_at AS "createdAt"
        `

        return NextResponse.json(rows[0], { status: 201 })
    } catch (err: any) {
        console.error("[ADMINS_CREATE_ERROR]", err)

        if (err?.code === "23505") {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 },
            )
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}