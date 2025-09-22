import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAdminFromRequest } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const rows = await sql/* sql */`
            WITH ap AS (
                SELECT
                    a.id,
                    a.service_id,
                    a.starts_at,
                    a.status,
                    a.notes
                FROM public.appointments a
            )
            SELECT
                ap.id,
                to_char(ap.starts_at AT TIME ZONE 'Europe/Paris', 'YYYY-MM-DD') AS "date",
                to_char(ap.starts_at AT TIME ZONE 'Europe/Paris', 'HH24:MI')    AS "time",
                COALESCE(split_part(ar.customer_name, ' ', 1), '')              AS "firstName",
                COALESCE(NULLIF(regexp_replace(ar.customer_name, '^[^ ]+\\s*', ''), ''), '') AS "lastName",
                COALESCE(ar.customer_email, '')                                 AS "clientEmail",
                COALESCE(s.name, '')                                            AS "service",
                COALESCE(s.price, 0)::float8                                    AS "price",
                CASE ap.status
                    WHEN 'confirmed' THEN 'Confirmé'
                    WHEN 'pending'   THEN 'En attente'
                    WHEN 'completed' THEN 'Terminé'
                    WHEN 'canceled'  THEN 'Annulé'
                    ELSE COALESCE(ap.status,'')
                    END                                                             AS "status",
                NULL::text                                                      AS "paymentStatus",
                ap.notes                                                        AS "notes"
            FROM ap
                     LEFT JOIN public.services s ON s.id = ap.service_id
                     LEFT JOIN LATERAL (
                SELECT ar.customer_name, ar.customer_email
                FROM public.appointment_requests ar
                WHERE ar.service_id = ap.service_id
                  AND ar.starts_at  = ap.starts_at
                ORDER BY ar.id DESC
                    LIMIT 1
      ) ar ON TRUE
            ORDER BY ap.starts_at DESC
        `
        return NextResponse.json(rows)
    } catch (error) {
        console.error("[GET APPOINTMENTS ERROR]", error)
        return NextResponse.json({ error: "Erreur lors du chargement des rendez-vous" }, { status: 500 })
    }
}