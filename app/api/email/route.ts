import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/email";
import BookingEmail from "@/components/booking-email";
export const runtime = "edge";

const BodySchema = z.object({
    serviceName: z.string().min(1),
    clientName: z.string().min(1),
    dateISO: z.string().min(1),
    notes: z.string().optional(),
    to: z.array(z.string().email()).min(1),
    replyTo: z.string().email().optional()
});

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const body = BodySchema.parse(json);

        const { data, error } = await resend.emails.send({
            from: process.env.MAIL_FROM!,
            to: body.to,
            subject: `Nouvelle réservation • ${body.serviceName}`,
            react: BookingEmail({
                serviceName: body.serviceName,
                clientName: body.clientName,
                dateISO: body.dateISO,
                notes: body.notes
            }),
            reply_to: body.replyTo,
            text: [
                `Nouvelle réservation`,
                `Service: ${body.serviceName}`,
                `Client: ${body.clientName}`,
                `Date: ${body.dateISO}`,
                body.notes ? `Notes: ${body.notes}` : ""
            ].filter(Boolean).join("\n")
        });

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true, id: data?.id });
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: err.message ?? "Invalid request" }, { status: 400 });
    }
}