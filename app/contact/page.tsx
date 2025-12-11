import type { Metadata } from "next";
import ContactClient from "@/app/contact/ContactClient";


export const metadata: Metadata = {
    title: "Contact",
    description: "Contact page",
    alternates: {
        canonical: "https://movi-lab.fr/contact",
    },
    openGraph: {
        title: "Contact",
        description: "Contact page",
        url: "https://movi-lab.fr/contact",
        siteName: "movi-lab",
    }
}
export default function ContactPage() {
    return <ContactClient />
}