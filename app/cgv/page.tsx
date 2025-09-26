import type { Metadata } from 'next'
import CgvClient from "@/app/cgv/CgvClient";

export const metadata: Metadata = {
    title: "Conditions Générales de Vente",
    description: "Consultez nos conditions générales de vente : modalités de réservation, paiement et annulation pour les services Movi-Lab.",
    alternates: {
    canonical: "https://movi-lab.fr/cgv",
    },
    openGraph: {
        title: "Condition Générales de Vente",
        description: "Consultez nos conditions générales de vente : modalités de réservation, paiement et annulation pour les services Movi-Lab.",
        url: "https://movi-lab.fr/cgv",
        siteName: "Movi-Lab",
    }
}
export default function CgvPage() {
    return <CgvClient />
}