import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

type DbClientRow = {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string | null
    created_at: Date
}

export async function GET() {
    try {
        // await requireAdmin()

        const rows = await sql<DbClientRow[]>`
      SELECT id, first_name, last_name, email, phone, created_at
      FROM clients
      ORDER BY created_at DESC
    `

        const data = rows.map((c) => ({
            id: c.id,
            firstName: c.first_name,
            lastName: c.last_name,
            email: c.email,
            phone: c.phone,
            createdAt: c.created_at.toISOString(),
        }))

        return NextResponse.json(data)
    } catch (e: any) {
        console.error("GET /api/admin/clients error:", e)
        return NextResponse.json(
            { error: "Erreur chargement clients" },
            { status: 500 }
        )
    }
}
//
// export async function POST(req: Request) {
//     try {
//         // await requireAdmin()
//
//         const body = await req.json()
//         const { firstName, lastName, email, phone } = body
//
//         if (!firstName || !lastName || !email) {
//             return NextResponse.json(
//                 { error: "firstName, lastName et email sont obligatoires" },
//                 { status: 400 }
//             )
//         }
//
//         await sql`
//       INSERT INTO clients (first_name, last_name, email, phone)
//       VALUES (${firstName}, ${lastName}, ${email}, ${phone ?? null})
//     `
//
//         // On renvoie la liste à jour
//         return GET()
//     } catch (e: any) {
//         console.error("POST /api/admin/clients error:", e)
//         return NextResponse.json(
//             { error: "Erreur création client" },
//             { status: 500 }
//         )
//     }
// }