export const dynamic = "force-dynamic"

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

console.log("🌐 Connected to DB URL:", process.env.DATABASE_NAME)

export async function GET() {
    try {
        const services = await sql/*sql*/`
            SELECT id, name, slug, description, price, duration_minutes, is_active, color
            FROM services
            WHERE is_active = true
            ORDER BY id ASC
        `
        return NextResponse.json({ services })
    } catch (e: any) {
        console.error("Erreur services:", e)
        return new NextResponse("Erreur services", { status: 500 })
    }
}