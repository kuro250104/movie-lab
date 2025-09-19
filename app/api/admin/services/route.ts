import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const rows = await sql/* sql */`
    SELECT id, name, description, price, duration_minutes, is_active, color, created_at
    FROM services
    ORDER BY name ASC
  `
    return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { name, description = "", price = 0, duration_minutes = 60, is_active = true, color = "bg-gray-500" } = body ?? {}

    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })

    const rows = await sql/* sql */`
    INSERT INTO services (name, description, price, duration_minutes, is_active, color)
    VALUES (${name}, ${description}, ${price}, ${duration_minutes}, ${is_active}, ${color})
    RETURNING id, name, description, price, duration_minutes, is_active, color, created_at
  `
    return NextResponse.json(rows[0], { status: 201 })
}