// app/api/services/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const runtime = "nodejs"

export async function GET() {
    try {
        const rows = await sql/* sql */`
            SELECT
                s.id,
                s.name,
                s.slug,             -- ✅ ajouté
                s.description,
                s.duration_minutes,
                s.price,
                s.is_active,
                s.color,
                s.icon,
                s.created_at,
                s.updated_at
            FROM public.services AS s
            WHERE s.is_active = true
            ORDER BY s.name ASC;
        `

        return NextResponse.json(rows, { status: 200 })
    } catch (err) {
        console.error("Erreur services:", err)
        return NextResponse.json({ error: "Erreur lors de la récupération des services" }, { status: 500 })
    }
}