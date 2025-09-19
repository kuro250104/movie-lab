import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
}