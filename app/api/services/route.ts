export const dynamic = "force-dynamic"

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
console.log("🌐 Connected to DB URL:", process.env.DATABASE_URL)
export async function GET()  {
    try {
        const services = await sql`SELECT * FROM services WHERE is_active = true ORDER BY id ASC`
        return NextResponse.json(services)
    } catch (e) {
        return new NextResponse("Erreur services", { status: 500 })
    }
}