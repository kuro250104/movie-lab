import {Metadata} from "next";
import CguClient from "@/app/cgu/CguClient";

export const metadata: Metadata = {
    title: "Condition Générales d'utilisation",
    description: "Découvrez les conditions générales d’utilisation du site movi-lab. Informations légales, droits et responsabilités liés à l’utilisation de nos services d’analyse 3D de la course à pied.",    alternates: {
        canonical: "https://movi-lab.fr/cgu",
    },
    openGraph: {
        title: "Condition Générales d'utilisation",
        description: "Découvrez les conditions générales d’utilisation du site movi-lab. Informations légales, droits et responsabilités liés à l’utilisation de nos services d’analyse 3D de la course à pied.",        url: "https://movi-lab.fr/cgu",
        siteName: "movi-lab",
    }
}
export default function CguPage() {
    return <CguClient />
}