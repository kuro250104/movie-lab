import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const { name, description, price, duration_minutes, is_active, color } = body ?? {}

    const rows = await sql/* sql */`
    UPDATE services SET
      name = COALESCE(${name}, name),
      description = COALESCE(${description}, description),
      price = COALESCE(${price}, price),
      duration_minutes = COALESCE(${duration_minutes}, duration_minutes),
      is_active = COALESCE(${is_active}, is_active),
      color = COALESCE(${color}, color)
    WHERE id = ${id}
    RETURNING id, name, description, price, duration_minutes, is_active, color, created_at
  `
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(rows[0])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    await sql/* sql */`DELETE FROM services WHERE id = ${id}`
    return NextResponse.json({ ok: true })
}