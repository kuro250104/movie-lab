export const dynamic = "force-dynamic"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supplements = await sql
            `SELECT * FROM supplements`
        console.log("📦 Supplements reçus :", supplements)
        return NextResponse.json(Array.isArray(supplements) ? supplements : supplements.rows)
    } catch (e) {
        console.error("❌ Erreur récupération supplements :", e)
        return NextResponse.json({error: "Erreur supplements"}, { status: 500 })
    }
}