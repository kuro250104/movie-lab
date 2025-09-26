"use client"
import { FileText } from "lucide-react"
import LegalLayout from "@/components/legal-layout"

export default function CguClient() {
    return (
        <LegalLayout
            label="Termes et Conditions"
            title="Conditions Générales d’Utilisation (CGU)"
            updatedAt="19/09/2025"
            descContent="Bienvenue sur le site internet de Movi-Lab (ci-après « le Site »). En accédant et en utilisant ce Site, vous acceptez pleinement et sans réserve les présentes conditions d’utilisation."
            icon={<FileText className="w-4 h-4" />}
        >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Objet</h2>
            <p>
                Les présentes Termes et Conditions (ci-après « Conditions ») ont pour objet de définir les règles d’accès et
                d’utilisation du Site de Movi-Lab ainsi que des services qui y sont proposés.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Accès au Site</h2>
            <p>
                L’accès au Site est libre et gratuit. Movi-Lab s’efforce d’assurer un accès continu au Site, mais ne garantit
                pas que celui-ci sera disponible sans interruption ni erreur. L’accès peut être suspendu temporairement pour
                des raisons techniques, de maintenance ou de mise à jour.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Utilisation du Site</h2>
            <p>L’Utilisateur s’engage à utiliser le Site conformément à la loi et aux présentes Conditions. En particulier, il s’interdit :</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>De porter atteinte aux droits de propriété intellectuelle de Movi-Lab ou de tiers,</li>
                <li>D’introduire volontairement des virus ou tout autre élément nuisible,</li>
                <li>D’utiliser le Site à des fins frauduleuses ou contraires à l’ordre public.</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Services proposés</h2>
            <p>
                Le Site présente les activités de Movi-Lab et permet de contacter l’entreprise pour obtenir des informations ou
                réserver une prestation. Certaines informations (contenu, durée, modalités des prestations) sont fournies à
                titre indicatif et peuvent être adaptées aux besoins du Client.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Propriété intellectuelle</h2>
            <p>
                Tous les éléments présents sur le Site (textes, images, vidéos, graphismes, logos, marques, etc.) sont protégés
                par le droit de la propriété intellectuelle et sont la propriété exclusive de Movi-Lab, sauf mention contraire.
                Toute reproduction, représentation ou exploitation sans autorisation préalable est interdite.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Responsabilité</h2>
            <p>
                Movi-Lab s’efforce de fournir sur le Site des informations exactes et mises à jour. Toutefois, Movi-Lab ne
                pourra être tenu responsable :
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>D’éventuelles erreurs ou omissions,</li>
                <li>D’un dysfonctionnement technique indépendant de sa volonté,</li>
                <li>Des conséquences liées à l’utilisation des informations présentes sur le Site.</li>
            </ul>
            <p>
                Le Site peut contenir des liens vers des sites externes ; Movi-Lab n’est pas responsable de leur contenu.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Données personnelles</h2>
            <p>
                Movi-Lab collecte et traite des données personnelles conformément à sa Politique de confidentialité.
                L’Utilisateur peut consulter cette politique à tout moment depuis le Site.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Modification des Conditions</h2>
            <p>
                Movi-Lab se réserve le droit de modifier les présentes Conditions à tout moment. Les nouvelles Conditions
                entreront en vigueur à compter de leur mise en ligne.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Loi applicable et juridiction compétente</h2>
            <p>
                Les présentes Conditions sont régies par le droit français. En cas de litige, compétence exclusive est attribuée
                aux tribunaux du ressort de Toulouse, sous réserve des dispositions légales applicables aux consommateurs.
            </p>
        </LegalLayout>
    )
}