"use client"
import { ShieldCheck } from "lucide-react"
import LegalLayout from "@/components/legal-layout"

export default function PrivacyPolicyPage() {
    return (
        <LegalLayout
            label="Protection des données"
            title="Politique de confidentialité (RGPD) – Movi-Lab"
            updatedAt="19/09/2025"
            descContent="Chez Movi-Lab, la protection de vos données personnelles est une priorité. Cette politique explique de façon transparente comment nous collectons, utilisons et protégeons vos données, ainsi que vos droits."
            icon={<ShieldCheck className="w-4 h-4" />}
        >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
                Dans le cadre de notre activité (analyses biomécaniques, accompagnement sportif et gestion de nos services), nous
                collectons et traitons certaines données personnelles. La présente politique a pour but de vous informer de
                manière claire sur nos pratiques et sur vos droits.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Responsable du traitement</h2>
            <p>
                <strong>Movi-Lab – SASU</strong>
                <br />
                2 rue du Lieutenant Guy Dedieu, 31300 Toulouse
                <br />
                Contact : <a href="mailto:info@movi-lab.fr">info@movi-lab.fr</a>
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Données collectées</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                    <strong>Données d’identification :</strong> nom, prénom, coordonnées (email, téléphone), âge.
                </li>
                <li>
                    <strong>Données de facturation :</strong> adresse postale, informations de paiement.
                </li>
                <li>
                    <strong>Données liées aux prestations :</strong> vidéos motion-capture, données biomécaniques, résultats
                    d’évaluation.
                </li>
                <li>
                    <strong>Échanges :</strong> emails, formulaires de contact, messages lors de prises de rendez-vous, SMS de rappel.
                </li>
                <li>
                    <strong>Données de navigation :</strong> cookies, statistiques anonymisées de fréquentation.
                </li>
            </ul>
            <p>Nous ne collectons aucune donnée sensible sans votre consentement explicite.</p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Finalités du traitement</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Exécution de nos prestations (réservations, analyses, bilans personnalisés).</li>
                <li>Communication avec vous (confirmations, comptes rendus, suivi).</li>
                <li>Gestion administrative et comptable (facturation, obligations légales).</li>
                <li>Amélioration de nos services (statistiques internes, suivi de progression).</li>
                <li>Utilisation pédagogique, scientifique ou promotionnelle (uniquement avec votre accord écrit).</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Base légale du traitement</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                    <strong>Exécution du contrat</strong> (art. 6.1.b RGPD) pour la fourniture des services.
                </li>
                <li>
                    <strong>Consentement</strong> (art. 6.1.a) pour les usages optionnels (ex. vidéos à des fins pédagogiques/marketing).
                </li>
                <li>
                    <strong>Obligation légale</strong> (art. 6.1.c) pour la facturation et la conservation comptable.
                </li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Durée de conservation</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Données clients :</strong> 5 ans après la fin de la relation contractuelle.</li>
                <li><strong>Données comptables :</strong> 10 ans (obligation légale).</li>
                <li><strong>Vidéos et analyses biomécaniques :</strong> 5 ans maximum (ou suppression anticipée sur demande).</li>
                <li><strong>Cookies :</strong> durée maximale de 13 mois.</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Destinataires des données</h2>
            <p>
                Vos données sont destinées exclusivement à Movi-Lab et, le cas échéant, à nos prestataires techniques de confiance
                (hébergeur, outils de réservation, solution de paiement) ou, avec votre accord préalable, à nos partenaires
                d’accompagnement dans le cadre du coaching (données d’identification et bilans). Nous ne revendons jamais vos
                données à des tiers.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Droits des utilisateurs</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Droit d’accès</strong> : obtenir une copie de vos données.</li>
                <li><strong>Droit de rectification</strong> : corriger ou mettre à jour.</li>
                <li><strong>Droit d’effacement</strong> (« droit à l’oubli »).</li>
                <li><strong>Droit à la limitation</strong> du traitement.</li>
                <li><strong>Droit d’opposition</strong> à certains traitements.</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible.</li>
            </ul>
            <p className="mt-2">
                Pour exercer vos droits :{" "}
                <a href="mailto:info@movi-lab.fr">info@movi-lab.fr</a>. En cas de litige, vous pouvez également saisir la CNIL
                (<a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-orange-600">www.cnil.fr</a>).
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Sécurité des données</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Hébergement sécurisé en Europe.</li>
                <li>Accès limité aux seules personnes autorisées.</li>
                <li>Confidentialité des échanges (SSL/HTTPS).</li>
                <li>Sauvegarde et conservation contrôlée des vidéos.</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Cookies</h2>
            <p>
                Le site Movi-Lab utilise des cookies nécessaires à son bon fonctionnement et des cookies statistiques pour
                améliorer l’expérience utilisateur. Vous pouvez gérer vos préférences via les paramètres de votre navigateur ou
                via le bandeau de consentement affiché lors de votre première visite.
            </p>
        </LegalLayout>
    )
}