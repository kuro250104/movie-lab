import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const coachId = Number.parseInt(params.id, 10)
    if (!Number.isFinite(coachId)) {
        return NextResponse.json({ error: "Invalid coach id" }, { status: 400 })
    }

    const rows = await sql/* sql */`
        SELECT
            id,
            date::text      AS date,
            start_minute,
            end_minute,
            is_available,
            note,
            created_at
        FROM public.coach_availability_exceptions
        WHERE coach_id = ${coachId}
        ORDER BY date DESC, start_minute NULLS FIRST
    `
    return NextResponse.json(rows)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const coachId = Number.parseInt(params.id, 10)
    if (!Number.isFinite(coachId)) {
        return NextResponse.json({ error: "Invalid coach id" }, { status: 400 })
    }

    const { date, startMinute = null, endMinute = null, isAvailable, note = null } = await req.json()

    if (!date) {
        return NextResponse.json({ error: "date is required (YYYY-MM-DD)" }, { status: 400 })
    }

    if (isAvailable === true) {
        if (typeof startMinute !== "number" || typeof endMinute !== "number" || endMinute <= startMinute) {
            return NextResponse.json({ error: "startMinute/endMinute required for isAvailable=true" }, { status: 400 })
        }
    }

    // 🔁 On force "1 ligne par coach + date" sans ON CONFLICT :
    await sql/* sql */`
        DELETE FROM public.coach_availability_exceptions
        WHERE coach_id = ${coachId} AND date = ${date}::date
    `

    const rows = await sql/* sql */`
        INSERT INTO public.coach_availability_exceptions
            (coach_id, date, start_minute, end_minute, is_available, note)
        VALUES
            (${coachId}, ${date}::date, ${startMinute}, ${endMinute}, ${!!isAvailable}, ${note})
        RETURNING
            id,
            date::text      AS date,
            start_minute,
            end_minute,
            is_available,
            note,
            created_at
    `
    return NextResponse.json(rows[0], { status: 201 })
}