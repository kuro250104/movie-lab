import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE(_: Request, { params }: { params: { id: string, excId: string } }) {
    const coachId = Number(params.id)
    const excId = Number(params.excId)
    const r = await sql/* sql */`
    DELETE FROM public.coach_availability_exceptions
    WHERE id = ${excId} AND coach_id = ${coachId}
    RETURNING id
  `
    if (!r[0]) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ ok: true })
}