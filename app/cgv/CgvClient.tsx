"use client"
import { FileText } from "lucide-react"
import LegalLayout from "@/components/legal-layout"

export default function CgvClient() {
    return (
        <LegalLayout
            label="Conditions Générales"
            title="Conditions Générales de Vente (CGV)"
            updatedAt="19/09/2025"
            descContent="Applicable à partir du 19/09/2025. Les présentes Conditions Générales de Vente régissent les relations contractuelles entre movi-lab et ses clients, particuliers ou professionnels."
            icon={<FileText className="w-4 h-4" />}
        >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Identification de la société</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>SIRET (siège) : 938 183 654 000 12</li>
                <li>Forme Juridique : SASU, société par actions simplifiée unipersonnelle</li>
                <li>Numéro de TVA : FR41938183654</li>
                <li>Inscription au RCS : Greffe de Toulouse, le 09/12/2024</li>
                <li>Inscription au RNE : Inscrit</li>
                <li>Numéro RCS : 938 183 654 R.C.S. Toulouse</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Objet</h2>
            <p>
                Les présentes Conditions Générales de Vente (CGV) définissent les conditions contractuelles applicables à toute
                commande passée auprès de movi-lab par un client consommateur ou professionnel (ci-après « le Client »),
                concernant les services d’analyse biomécanique et vidéo proposés par movi-lab.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services proposés</h2>
            <p>movi-lab propose plusieurs formules de services, dont notamment :</p>
            <h3 className="text-2xl font-semibold mt-6 mb-2">Pack Prévention</h3>
            <ul className="list-disc pl-6 space-y-1">
                <li>Analyse de la course</li>
                <li>Analyse posturale</li>
                <li>Proposition de chaussures et conseil technique</li>
                <li>Proposition des exercices musculaires</li>
                <li>Évaluation des gestes mal adaptés à la douleur</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-6 mb-2">Pack Performance</h3>
            <ul className="list-disc pl-6 space-y-1">
                <li>Analyse course corps complet</li>
                <li>Analyse posturale</li>
                <li>Analyse chaussures et recommandations, conseils techniques</li>
                <li>Bilan musculaire</li>
                <li>Restitution personnalisée</li>
            </ul>

            <p className="mt-4">
                Les prestations de movi-lab sont proposées à des tarifs compris entre 180 € et 280 € TTC selon la formule
                choisie. Le prix exact est communiqué avant la réservation. Le règlement s’effectue par carte bancaire ou en
                espèces, à l’issue de la séance. Aucun escompte pour paiement anticipé n’est accordé.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Commande</h2>
            <p>
                Toute commande est réputée ferme et définitive dès la réservation de la séance. Le Prestataire se réserve le
                droit de refuser une commande si les informations fournies par le Client sont manifestement incomplètes ou
                erronées.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prix et modalités de paiement</h2>
            <p>
                Les prix applicables sont ceux en vigueur au jour de la commande, exprimés en euros TTC. Le règlement s’effectue
                par carte bancaire ou en espèces, à l’issue de la séance. Aucun escompte pour paiement anticipé n’est accordé.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exécution des prestations</h2>
            <p>
                Les prestations sont réalisées au centre 2 rue du Lieutenant Guy Dedieu, 31300 Toulouse à la date et l’heure
                convenues. Pour chaque formule, le compte rendu est remis dans un délai de 14 jours après la séance.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Annulation et report</h2>
            <p>
                Toute annulation par le Client doit être notifiée au moins 48h avant la date prévue. Un report peut être accepté
                sans frais s’il est demandé au moins 24h avant la séance.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Droit de rétractation</h2>
            <p>
                Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client consommateur dispose d’un
                délai de 14 jours à compter de la conclusion du contrat pour exercer son droit de rétractation, sauf si le
                service a été pleinement exécuté avant la fin de ce délai avec l’accord exprès du Client et son renoncement à ce
                droit.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Responsabilité</h2>
            <p>
                movi-lab s’engage à fournir un service conforme aux règles de l’art. Les prestations ont une finalité d’analyse
                et de conseil, et ne constituent pas un diagnostic médical. movi-lab ne pourra être tenu responsable des
                blessures, incidents ou conséquences liées à la pratique sportive du Client. La responsabilité du Prestataire est
                limitée, tous préjudices confondus, au montant payé pour la prestation concernée.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p>
                movi-lab est propriétaire exclusif de tous les droits de propriété intellectuelle relatifs au Site et aux
                Services. Le Client bénéficie d’un droit d’utilisation strictement personnel et non cessible. Toute reproduction,
                diffusion ou exploitation sans autorisation est interdite.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Données personnelles et vidéos</h2>
            <p>
                movi-lab collecte et traite les données personnelles du Client conformément au RGPD. Les vidéos et données
                biomécaniques sont conservées 5 ans. Toute utilisation à des fins scientifiques, pédagogiques ou promotionnelles
                nécessite l’accord écrit du Client. Le Client dispose d’un droit d’accès, de rectification et de suppression de
                ses données en contactant <a href="mailto:info@movi-lab.fr">info@movi-lab.fr</a>.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Force majeure</h2>
            <p>
                movi-lab ne pourra être tenu responsable en cas d’inexécution ou de retard dû à un cas de force majeure au sens
                de l’article 1218 du Code civil.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Litiges et droit applicable</h2>
            <p>
                En cas de litige, le Client est invité à rechercher une solution amiable. Conformément à l’article L.612-1 du
                Code de la consommation, il peut recourir gratuitement à un médiateur de la consommation. À défaut, compétence
                exclusive est attribuée aux tribunaux du ressort de Toulouse. Les présentes CGV sont régies par le droit
                français.
            </p>
        </LegalLayout>
    )
}