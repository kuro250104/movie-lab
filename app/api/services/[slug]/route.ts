export const dynamic = "force-dynamic"

import { NextResponse, NextRequest } from "next/server"
import { sql } from "@/lib/db"

export async function GET(
    _req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const slug = (params.slug ?? "").toString().trim().toLowerCase()

        const rows = await sql/*sql*/`
      SELECT id, name, description, price, duration_minutes, is_active, color, slug
      FROM services
      WHERE slug = ${slug}
      LIMIT 1
    `
        let service = rows[0]

        if (!service) {
            const alt = await sql/*sql*/`
        SELECT id, name, description, price, duration_minutes, is_active, color, slug
        FROM services
        WHERE trim(both '-' from lower(regexp_replace(name, '[^a-z0-9]+', '-', 'g'))) = ${slug}
        LIMIT 1
      `
            service = alt[0]
        }

        if (!service) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        const items = await sql/*sql*/`
      SELECT id, icon, title, description
      FROM service_items
      WHERE service_id = ${service.id} AND is_active = true
      ORDER BY sort_order ASC, id ASC
    `

        const payload = {
            service: {
                id: service.id,
                name: service.name,
                description: service.description ?? "",
                price: service.price,
                duration_minutes: service.duration_minutes ?? service.durationMinutes,
                is_active: service.is_active ?? service.isActive ?? false,
                color: service.color ?? null,
                slug: service.slug,
            },
            items,
        }

        return NextResponse.json(payload)
    } catch (err) {
        console.error("GET /api/services/[slug] error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}