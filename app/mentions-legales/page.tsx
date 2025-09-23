"use client"
import { Globe } from "lucide-react"
import LegalLayout from "@/components/legal-layout"

export default function MentionsLegalesPage() {

    return (
        <LegalLayout
            label="Mentions légales"
            title="Mentions légales – Movi-Lab"
            updatedAt="19/09/2025"
            descContent="Ces mentions légales définissent les informations relatives à l’édition, l’hébergement et l’utilisation du site Movi-Lab."
            icon={<Globe className="w-4 h-4" />}
        >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Éditeur du site</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Société : Movi-Lab</li>
                <li>Forme juridique : SASU (société par actions simplifiée unipersonnelle)</li>
                <li>Capital social : 500 euros</li>
                <li>Siège social : 2 rue du Lieutenant Guy Dedieu, 31300 Toulouse</li>
                <li>SIRET : 938 183 654 000 12</li>
                <li>RCS : 938 183 654 R.C.S. Toulouse</li>
                <li>Numéro de TVA intracommunautaire : FR41938183654</li>
                <li>Email : <a href="mailto:info@movi-lab.fr">info@movi-lab.fr</a></li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Directeur de la publication</h2>
            <p>M. Galo Maldonado</p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hébergement du site</h2>
            <p>
                Le site Movi-Lab est hébergé par :
                <br />
                <strong>Vercel</strong>
                <br />
                Site web : <a href="https://vercel.com/" target="_blank" className="text-orange-600">https://vercel.com/</a>
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p>
                L’ensemble des contenus présents sur le site (textes, images, vidéos, graphismes, logos, icônes, sons,
                logiciels, etc.) est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive de
                Movi-Lab ou de ses partenaires. Toute reproduction, représentation, modification, publication, transmission,
                adaptation totale ou partielle est interdite sans autorisation écrite préalable.
            </p>
            <p>L’utilisateur dispose d’un droit d’usage strictement personnel pour consulter le site.</p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Données personnelles</h2>
            <p>
                Movi-Lab collecte et traite les données personnelles conformément à sa Politique de confidentialité (RGPD).
                Les utilisateurs disposent de droits d’accès, de rectification et de suppression, exercés via
                <a href="mailto:info@movi-lab.fr"> info@movi-lab.fr</a>.
                Plus de détails sont disponibles dans la Politique de confidentialité accessible sur le site.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Limitation de responsabilité</h2>
            <p>
                Movi-Lab s’efforce de fournir des informations fiables et à jour, mais ne garantit pas l’exactitude ou
                l’exhaustivité. Movi-Lab ne peut être tenu responsable des dommages directs ou indirects liés à l’utilisation du
                site. L’utilisateur reconnaît utiliser le site sous sa responsabilité exclusive.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Liens hypertextes</h2>
            <p>
                Le site peut contenir des liens vers des sites tiers. Movi-Lab ne contrôle pas leur contenu et décline toute
                responsabilité quant à leur accessibilité ou leurs services. La création de liens vers ce site est soumise à
                autorisation préalable écrite de Movi-Lab.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookies et traceurs</h2>
            <p>
                Le site utilise des cookies pour améliorer la navigation et proposer des fonctionnalités adaptées. Les cookies
                strictement nécessaires sont indispensables au fonctionnement du site. Des cookies analytiques peuvent être
                utilisés pour suivre la fréquentation, dans le respect de l’anonymat. L’utilisateur peut gérer ses préférences
                via son navigateur ou le bandeau de consentement affiché lors de la première visite.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Responsabilité de l’utilisateur</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Ne pas perturber le fonctionnement du site,</li>
                <li>Ne pas introduire de virus ou logiciels malveillants,</li>
                <li>Ne pas collecter les données personnelles d’autres utilisateurs sans consentement,</li>
                <li>Respecter les droits de propriété intellectuelle et la législation en vigueur.</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Modification du site et des mentions légales</h2>
            <p>
                Movi-Lab se réserve le droit de modifier, suspendre ou supprimer tout ou partie du site et de ses contenus, à
                tout moment et sans préavis. Les présentes mentions légales peuvent également être mises à jour. L’utilisateur
                est invité à consulter régulièrement cette page.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Droit applicable et juridiction compétente</h2>
            <p>
                Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l’accès ou à
                l’utilisation du site sera soumis aux tribunaux compétents de Toulouse, sauf dispositions légales contraires.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact</h2>
            <p>
                Email : <a href="mailto:info@movi-lab.fr">info@movi-lab.fr</a>
                <br />
                Téléphone : <a href="tel:+33979219248">+33 9 79 21 92 48</a>
                <br />
                Adresse postale : 2 rue du Lieutenant Guy Dedieu, 31300 Toulouse
            </p>
        </LegalLayout>
    )
}