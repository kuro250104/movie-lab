import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: { id: string; ruleId: string } }) {
    const coachId = Number(params.id)
    const ruleId = Number(params.ruleId)
    const body = (await req.json()) as {
        weekday?: number
        startMinute?: number
        endMinute?: number
        isActive?: boolean
    }

    // Construire dynamiquement les assignments (sans undefined)
    const sets: any[] = []
    if (body.weekday !== undefined)     sets.push(sql`weekday = ${body.weekday}`)
    if (body.startMinute !== undefined) sets.push(sql`start_minute = ${body.startMinute}`)
    if (body.endMinute !== undefined)   sets.push(sql`end_minute = ${body.endMinute}`)
    if (body.isActive !== undefined)    sets.push(sql`is_active = ${body.isActive}`)

    if (sets.length === 0) {
        return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 })
    }

    // Concatène les fragments: frag1, frag2, frag3 …
    let setSql = sets[0]
    for (let i = 1; i < sets.length; i++) {
        setSql = sql`${setSql}, ${sets[i]}`
    }

    const rows = await sql/* sql */`
    UPDATE public.coach_availability_rules
    SET ${setSql}
    WHERE id = ${ruleId} AND coach_id = ${coachId}
    RETURNING
      id,
      weekday,
      start_minute AS "startMinute",
      end_minute   AS "endMinute",
      is_active    AS "isActive"
  `
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(rows[0])
}

export async function DELETE(_: Request, { params }: { params: { id: string; ruleId: string } }) {
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