import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

type AdminRole = "admin" | "coach"
type Params = { params: { id: string } }

function parseId(raw: string): number | null {
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) && n > 0 ? n : null
}

export async function PATCH(req: Request, { params }: Params) {
    const id = parseId(params.id)
    if (!id) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }

    const body = await req.json().catch(() => ({} as any))

    const role = body.role as AdminRole | undefined
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined
    const name = typeof body.name === "string" ? body.name.trim() : undefined
    const password = typeof body.password === "string" ? body.password.trim() : undefined

    if (!role || !["admin", "coach"].includes(role)) {
        return NextResponse.json({ error: "role must be 'admin' or 'coach'" }, { status: 400 })
    }
    if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }
    if (!name) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 })
    }

    let passwordHash: string | null = null
    if (password && password.length > 0) {
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 },
            )
        }
        passwordHash = await bcrypt.hash(password, 12)
    }

    try {
        const rows = await sql/* sql */`
            UPDATE public.admins
            SET
                email         = ${email},
                name          = ${name},
                role          = ${role},
                password_hash = COALESCE(${passwordHash}, password_hash),
                updated_at    = now()
            WHERE id = ${id}
              AND role IN ('admin', 'coach')
            RETURNING
                id,
                email,
                name,
                role,
                created_at AS "createdAt"
        `

        if (!rows.length) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        return NextResponse.json(rows[0])
    } catch (err: any) {
        console.error("[ADMIN_UPDATE_ERROR]", err)
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