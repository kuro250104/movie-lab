import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const serviceId = Number(params.id)
    if (!serviceId) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    const body = await request.json()
    const { name, description, price, duration_minutes, is_active, color, items } = body ?? {}

    try {
        const updated = await sql.begin(async (trx) => {
            // 1) PATCH du service
            const srv = await trx/* sql */`
        UPDATE services SET
          name = COALESCE(${name}, name),
          description = COALESCE(${description}, description),
          price = COALESCE(${price}, price),
          duration_minutes = COALESCE(${duration_minutes}, duration_minutes),
          is_active = COALESCE(${is_active}, is_active),
          color = COALESCE(${color}, color)
        WHERE id = ${serviceId}
        RETURNING id
      `
            if (srv.length === 0) throw new Error("NOT_FOUND")

            // 2) UPSERT + DELETE des service_items
            let keptIds: number[] = []
            if (Array.isArray(items)) {
                for (const raw of items) {
                    const itemId = raw?.id != null ? Number(raw.id) : null
                    const icon = raw?.icon ?? null
                    const title = raw?.title ?? null
                    const desc  = raw?.description ?? null

                    if (itemId) {
                        // Update si l'item appartient au service; sinon on insère (sécurité)
                        const upd = await trx/* sql */`
              UPDATE service_items
              SET icon = ${icon}, title = ${title}, description = ${desc}
              WHERE id = ${itemId} AND service_id = ${serviceId}
              RETURNING id
            `
                        if (upd.length === 0) {
                            const ins = await trx/* sql */`
                INSERT INTO service_items (service_id, icon, title, description)
                VALUES (${serviceId}, ${icon}, ${title}, ${desc})
                RETURNING id
              `
                            keptIds.push(Number(ins[0].id))
                        } else {
                            keptIds.push(Number(upd[0].id))
                        }
                    } else {
                        const ins = await trx/* sql */`
              INSERT INTO service_items (service_id, icon, title, description)
              VALUES (${serviceId}, ${icon}, ${title}, ${desc})
              RETURNING id
            `
                        keptIds.push(Number(ins[0].id))
                    }
                }

                // Delete tout ce qui n'est pas listé
                if (keptIds.length > 0) {
                    await trx/* sql */`
                        DELETE FROM service_items
                        WHERE service_id = ${serviceId}
                          AND id NOT IN ${trx(keptIds)}
                    `
                } else {
                    await trx/* sql */`
                        DELETE FROM service_items
                        WHERE service_id = ${serviceId}
                    `
                }
            }

            // 3) Retour payload complet (même shape que GET)
            const full = await trx/* sql */`
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
        WHERE s.id = ${serviceId}
        GROUP BY s.id
      `
            return full[0]
        })

        return NextResponse.json(updated)
    } catch (e: any) {
        if (e?.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }
        console.error("[PATCH SERVICE UPSERT+DELETE ERROR]", e)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

    await sql/* sql */`DELETE FROM services WHERE id = ${id}`
    return NextResponse.json({ ok: true })
}