// app/api/services/[id]/supplements/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const serviceId = Number(params.id)
    if (!Number.isFinite(serviceId) || serviceId <= 0) {
        return NextResponse.json({ error: "Invalid serviceId" }, { status: 400 })
    }

    try {
        const rows = await sql/* sql */`
            SELECT
                s.id,
                s.name,
                s.description,
                COALESCE(s.price, 0)::numeric AS price,
                COALESCE(s.is_active, true)  AS is_active
            FROM public.supplements s
                     JOIN public.service_supplements ss
                          ON ss.supplement_id = s.id
            WHERE ss.service_id = ${serviceId}
              AND s.is_active = true
            ORDER BY s.name;
        `
        return NextResponse.json(rows ?? [], { headers: { "Cache-Control": "no-store" } })
    } catch (e) {
        console.error("GET /api/services/[id]/supplements failed:", e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}