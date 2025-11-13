import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

function minutesToPgTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00` // format HH:MM:SS pour Postgres TIME
}

function pgTimeToMinutes(timeStr: string): number {
    const [hh, mm] = timeStr.split(":").map((v) => Number(v) || 0)
    return hh * 60 + mm
}

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

    // Normalisation : si la colonne est de type TIME, on convertit en minutes
    const normalized = rows.map((row: any) => ({
        ...row,
        startMinute:
            typeof row.startMinute === "string"
                ? pgTimeToMinutes(row.startMinute)
                : row.startMinute,
        endMinute:
            typeof row.endMinute === "string"
                ? pgTimeToMinutes(row.endMinute)
                : row.endMinute,
    }))

    return NextResponse.json(normalized)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const coachId = Number.parseInt(params.id, 10)
    if (!Number.isFinite(coachId)) {
        return NextResponse.json({ error: "Invalid coach id" }, { status: 400 })
    }

    const body = await req.json()
    const { weekday, startMinute, endMinute, isActive = true } = body ?? {}

    if (![0, 1, 2, 3, 4, 5, 6].includes(Number(weekday))) {
        return NextResponse.json({ error: "weekday must be 0..6 (0=dimanche)" }, { status: 400 })
    }
    if (typeof startMinute !== "number" || typeof endMinute !== "number" || endMinute <= startMinute) {
        return NextResponse.json({ error: "startMinute/endMinute invalid" }, { status: 400 })
    }

    // ⬇️ conversion minutes → TIME pour Postgres
    const startTime = minutesToPgTime(startMinute)
    const endTime = minutesToPgTime(endMinute)

    const rows = await sql/* sql */`
        INSERT INTO public.coach_availability_rules (coach_id, weekday, start_minute, end_minute, is_active)
        VALUES (${coachId}, ${weekday}, ${startTime}, ${endTime}, ${isActive})
        RETURNING
          id,
          weekday,
          start_minute AS "startMinute",
          end_minute   AS "endMinute",
          is_active    AS "isActive",
          created_at   AS "createdAt"
    `

    // On renvoie aussi les minutes au front, au cas où Postgres renvoie un TIME
    const row = rows[0]
    const responsePayload = {
        ...row,
        startMinute:
            typeof row.startMinute === "string"
                ? pgTimeToMinutes(row.startMinute)
                : row.startMinute,
        endMinute:
            typeof row.endMinute === "string"
                ? pgTimeToMinutes(row.endMinute)
                : row.endMinute,
    }

    return NextResponse.json(responsePayload, { status: 201 })
}