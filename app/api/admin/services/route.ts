import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const rows = await sql/* sql */`
        SELECT
            s.id,
            s.name,
            s.description,
            s.price,
            s.duration_minutes,
            s.is_active,
            s.color,
            s.created_at,
            COALESCE(
                    json_agg(
                            jsonb_build_object(
                                    'id', si.id,
                                    'service_id', si.service_id,
                                    'icon', si.icon,
                                    'title', si.title,
                                    'description', si.description
                            )
                                ORDER BY si.id
                    ) FILTER (WHERE si.id IS NOT NULL),
                    '[]'
            ) AS items
        FROM services s
                 LEFT JOIN service_items si ON si.service_id = s.id
        GROUP BY s.id
        ORDER BY s.name ASC
    `
    return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const {
        name,
        description = "",
        price = "",
        duration_minutes = 60,
        is_active = true,
        color = "bg-gray-500",
        items = []
    } = body ?? {}

    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })

    // nettoyage / validation légère des items (sans position)
    const cleanItems: Array<{ icon: string; title: string; description?: string }> =
        Array.isArray(items)
            ? items
                .filter((i) => i && typeof i.icon === "string" && typeof i.title === "string")
                .map((i) => ({
                    icon: i.icon.trim(),
                    title: i.title.trim(),
                    description: typeof i.description === "string" ? i.description.trim() : "",
                }))
            : []

    // transaction: insert service + items, puis renvoyer le service avec items
    const created = await sql.begin(async (tx) => {
        const [service] = await tx/* sql */`
            INSERT INTO services (name, description, price, duration_minutes, is_active, color)
            VALUES (${name}, ${description}, ${price}, ${duration_minutes}, ${is_active}, ${color})
                RETURNING id, name, description, price, duration_minutes, is_active, color, created_at
        `

        if (cleanItems.length > 0) {
            for (const it of cleanItems) {
                await tx/* sql */`
                    INSERT INTO service_items (service_id, icon, title, description)
                    VALUES (${service.id}, ${it.icon}, ${it.title}, ${it.description ?? ""})
                `
            }
        }

        const [withItems] = await tx/* sql */`
            SELECT
                s.id,
                s.name,
                s.description,
                s.price,
                s.duration_minutes,
                s.is_active,
                s.color,
                s.created_at,
                COALESCE(
                        json_agg(
                                jsonb_build_object(
                                        'id', si.id,
                                        'service_id', si.service_id,
                                        'icon', si.icon,
                                        'title', si.title,
                                        'description', si.description
                                )
                                    ORDER BY si.id
                        ) FILTER (WHERE si.id IS NOT NULL),
                        '[]'
                ) AS items
            FROM services s
                     LEFT JOIN service_items si ON si.service_id = s.id
            WHERE s.id = ${service.id}
            GROUP BY s.id
        `
        return withItems
    })

    return NextResponse.json(created, { status: 201 })
}