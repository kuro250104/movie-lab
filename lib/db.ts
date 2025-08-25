import { neon } from "@neondatabase/serverless"
export const dynamic = "force-dynamic"
console.log("🧪 URL BDD utilisée :", process.env.DATABASE_URL)
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL doit être définie dans .env.local")
}

export const sql = neon(process.env.DATABASE_URL)


export interface Client {
    id: number
    first_name: string
    last_name: string
    email: string
    phone?: string
    date_of_birth?: string
    address?: string
    city?: string
    postal_code?: string
    emergency_contact?: string
    emergency_phone?: string
    medical_notes?: string
    running_experience?: string
    goals?: string
    created_at: string
    updated_at: string
}

export interface Service {
    id: number
    name: string
    description?: string
    price: number
    duration_minutes: number
    is_active: boolean
    created_at: string
}

export interface Appointment {
    id: number
    client_id: number
    service_id: number
    appointment_date: string
    status: "scheduled" | "completed" | "cancelled" | "no_show"
    notes?: string
    price?: number
    payment_status: "pending" | "paid" | "refunded"
    created_at: string
    updated_at: string
    client?: Client
    service?: Service
}

export interface AnalysisReport {
    id: number
    appointment_id: number
    client_id: number
    report_data?: any
    recommendations?: string
    file_path?: string
    created_at: string
}