import { type NextRequest, NextResponse } from "next/server"
import { sql, ensureDatabaseInitialized } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  await ensureDatabaseInitialized()

  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const clients = await sql`
      SELECT * FROM clients 
      ORDER BY created_at DESC
    `

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await ensureDatabaseInitialized()

  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const data = await request.json()

    const result = await sql`
      INSERT INTO clients (
        first_name, last_name, email, phone, date_of_birth,
        address, city, postal_code, emergency_contact, emergency_phone,
        medical_notes, running_experience, goals
      ) VALUES (
        ${data.first_name}, ${data.last_name}, ${data.email}, ${data.phone}, ${data.date_of_birth},
        ${data.address}, ${data.city}, ${data.postal_code}, ${data.emergency_contact}, ${data.emergency_phone},
        ${data.medical_notes}, ${data.running_experience}, ${data.goals}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Erreur lors de la création du client" }, { status: 500 })
  }
}
