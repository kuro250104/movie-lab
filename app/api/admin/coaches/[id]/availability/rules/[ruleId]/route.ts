import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: { id: string, ruleId: string } }) {
    const coachId = Number(params.id)
    const ruleId = Number(params.ruleId)
    const body = await req.json()
    const { weekday, startMinute, endMinute, isActive } = body ?? {}

    const rows = await sql/* sql */`
        UPDATE public.coach_availability_rules
        SET
            weekday = COALESCE(${weekday}::int, weekday),
            start_minute = COALESCE(${startMinute}::int, start_minute),
            end_minute   = COALESCE(${endMinute}::int, end_minute),
            is_active    = COALESCE(${isActive}::boolean, is_active)
        WHERE id = ${ruleId} AND coach_id = ${coachId}
            RETURNING id, weekday, start_minute, end_minute, is_active
    `
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(rows[0])
}

export async function DELETE(_: Request, { params }: { params: { id: string, ruleId: string } }) {
    const coachId = Number(params.id)
    const ruleId = Number(params.ruleId)
    const r = await sql/* sql */`
        DELETE FROM public.coach_availability_rules
        WHERE id = ${ruleId} AND coach_id = ${coachId}
            RETURNING id
    `
    if (!r[0]) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ ok: true })
}