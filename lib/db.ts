import postgres from "postgres"

const sql = postgres({
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT || "5432"),
    database: process.env.DATABASE_NAME!,
    username: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    ssl: process.env.PG_SSLMODE ? { rejectUnauthorized: false } : undefined,
    max: 10,
})

export { sql }

//
// export interface Client {
//     id: number
//     first_name: string
//     last_name: string
//     email: string
//     phone?: string
//     date_of_birth?: string
//     address?: string
//     city?: string
//     postal_code?: string
//     emergency_contact?: string
//     emergency_phone?: string
//     medical_notes?: string
//     running_experience?: string
//     goals?: string
//     created_at: string
//     updated_at: string
// }
//
// export interface Service {
//     id: number
//     name: string
//     description?: string
//     price: number
//     duration_minutes: number
//     is_active: boolean
//     created_at: string
// }
//
// export interface Appointment {
//     id: number
//     client_id: number
//     service_id: number
//     appointment_date: string
//     status: "scheduled" | "completed" | "cancelled" | "no_show"
//     notes?: string
//     price?: number
//     payment_status: "pending" | "paid" | "refunded"
//     created_at: string
//     updated_at: string
//     client?: Client
//     service?: Service
// }
//
// export interface AnalysisReport {
//     id: number
//     appointment_id: number
//     client_id: number
//     report_data?: any
//     recommendations?: string
//     file_path?: string
//     created_at: string
// }