import type { Metadata } from 'next'
import MentionsLegalesClient from "@/app/mentions-legales/LegalsClient";

export const metadata: Metadata = {
    title: "Mentions Légales",
    description: "Mentions légales du site movi-lab : informations sur l’éditeur, l’hébergement et les droits liés à l’utilisation du site.",
    alternates: {
    canonical: "https://movi-lab.fr/mentions-legales",
    },
    openGraph: {
        title: "Mentions Légales",
        description: "Mentions légales du site movi-lab : informations sur l’éditeur, l’hébergement et les droits liés à l’utilisation du site.",
        url: "https://movi-lab.fr/mentions-legales",
        siteName: "movi-lab",
    },
}
export default function MentionsLegalesPage() {
    return <MentionsLegalesClient />
}