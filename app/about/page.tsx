import type { Metadata } from 'next'
import AboutClient from "@/app/about/AboutClient";

export const metadata: Metadata = {
    title: "À propos de movi-lab",
    description: "Découvrez l'histoire et la mission de movi-lab, spécialiste de l'analyse biomécanique 3D de la course à pied.",
    alternates: {
        canonical: "https://movi-lab.fr/about",
    },
    openGraph: {
        title: "À propos de movi-lab",
        description: "Découvrez l'histoire et la mission de movi-lab, spécialiste de l'analyse biomécanique 3D de la course à pied.",
        url: "https://movi-lab.fr/about",
        siteName: "movi-lab",
    },
}
export default function AboutPage() {
    return <AboutClient />
}