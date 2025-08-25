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
    const appointments = await sql`
      SELECT 
        a.*,
        c.first_name, c.last_name, c.email as client_email,
        s.name as service_name, s.duration_minutes
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date DESC
    `

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des rendez-vous" }, { status: 500 })
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
      INSERT INTO appointments (
        client_id, service_id, appointment_date, notes, price, payment_status
      ) VALUES (
        ${data.client_id}, ${data.service_id}, ${data.appointment_date}, 
        ${data.notes}, ${data.price}, ${data.payment_status || "pending"}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Erreur lors de la création du rendez-vous" }, { status: 500 })
  }
}
