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
            weekday,
            start_minute AS "startMinute",
            end_minute   AS "endMinute",
            is_active    AS "isActive",
            created_at   AS "createdAt"
        FROM public.coach_availability_rules
        WHERE coach_id = ${coachId}
        ORDER BY weekday, start_minute
    `
    return NextResponse.json(rows)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const coachId = Number.parseInt(params.id, 10)
    if (!Number.isFinite(coachId)) {
        return NextResponse.json({ error: "Invalid coach id" }, { status: 400 })
    }

    const body = await req.json()
    const { weekday, startMinute, endMinute, isActive = true } = body ?? {}

    if (![0,1,2,3,4,5,6].includes(Number(weekday))) {
        return NextResponse.json({ error: "weekday must be 0..6 (0=dimanche)" }, { status: 400 })
    }
    if (typeof startMinute !== "number" || typeof endMinute !== "number" || endMinute <= startMinute) {
        return NextResponse.json({ error: "startMinute/endMinute invalid" }, { status: 400 })
    }

    const rows = await sql/* sql */`
        INSERT INTO public.coach_availability_rules (coach_id, weekday, start_minute, end_minute, is_active)
        VALUES (${coachId}, ${weekday}, ${startMinute}, ${endMinute}, ${isActive})
            RETURNING
      id,
      weekday,
      start_minute AS "startMinute",
      end_minute   AS "endMinute",
      is_active    AS "isActive",
      created_at   AS "createdAt"
    `
    return NextResponse.json(rows[0], { status: 201 })
}