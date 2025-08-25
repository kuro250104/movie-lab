"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Database, UserCheck } from "lucide-react"

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="flex flex-col text-black bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-10 flex flex-col justify-center px-6 max-w-7xl mx-auto text-white"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-8 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium">
                <Shield className="w-4 h-4" />
                Protection des données
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
            >
              Politique de Confidentialité
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Dernière mise à jour : Janvier 2024
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Eye className="w-6 h-6 text-orange-600" />
                  </div>
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  movi-lab s'engage à protéger la confidentialité et la sécurité de vos données personnelles. Cette
                  politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos
                  informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à
                  la loi française.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Database className="w-6 h-6 text-orange-600" />
                  </div>
                  Données Collectées
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>2.1 Données d'identification :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nom, prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse postale</li>
                  </ul>

                  <p>
                    <strong>2.2 Données de santé et sportives :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Antécédents médicaux liés à la course</li>
                    <li>Blessures passées</li>
                    <li>Objectifs sportifs</li>
                    <li>Données d'analyse biomécanique</li>
                    <li>Mesures anthropométriques</li>
                  </ul>

                  <p>
                    <strong>2.3 Données techniques :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Adresse IP</li>
                    <li>Données de navigation</li>
                    <li>Cookies techniques</li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Finalités du Traitement</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>3.1 Prestations de services :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Réalisation des analyses biomécaniques</li>
                    <li>Élaboration de programmes d'entraînement</li>
                    <li>Suivi et accompagnement personnalisé</li>
                  </ul>

                  <p>
                    <strong>3.2 Gestion commerciale :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Gestion des rendez-vous</li>
                    <li>Facturation et comptabilité</li>
                    <li>Service client</li>
                  </ul>

                  <p>
                    <strong>3.3 Communication :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Envoi d'informations sur nos services</li>
                    <li>Newsletter (avec consentement)</li>
                    <li>Enquêtes de satisfaction</li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Base Légale</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Le traitement de vos données personnelles repose sur :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>L'exécution du contrat :</strong> pour la réalisation de nos prestations
                    </li>
                    <li>
                      <strong>L'intérêt légitime :</strong> pour l'amélioration de nos services et la gestion
                      commerciale
                    </li>
                    <li>
                      <strong>Le consentement :</strong> pour l'envoi de communications marketing
                    </li>
                    <li>
                      <strong>L'obligation légale :</strong> pour la conservation des données comptables
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Conservation des Données</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Nous conservons vos données personnelles pendant les durées suivantes :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Données clients actifs :</strong> pendant toute la durée de la relation commerciale + 3
                      ans
                    </li>
                    <li>
                      <strong>Données de santé :</strong> 20 ans après la dernière consultation
                    </li>
                    <li>
                      <strong>Données comptables :</strong> 10 ans
                    </li>
                    <li>
                      <strong>Données de prospection :</strong> 3 ans à compter du dernier contact
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <UserCheck className="w-6 h-6 text-orange-600" />
                  </div>
                  Vos Droits
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles
                    </li>
                    <li>
                      <strong>Droit de rectification :</strong> corriger des données inexactes
                    </li>
                    <li>
                      <strong>Droit à l'effacement :</strong> supprimer vos données dans certains cas
                    </li>
                    <li>
                      <strong>Droit à la limitation :</strong> limiter le traitement de vos données
                    </li>
                    <li>
                      <strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré
                    </li>
                    <li>
                      <strong>Droit d'opposition :</strong> vous opposer au traitement pour motifs légitimes
                    </li>
                    <li>
                      <strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment
                    </li>
                  </ul>
                  <p>
                    Pour exercer ces droits, contactez-nous à : <strong>dpo@movi-lab.fr</strong>
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Sécurité des Données</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos
                    données :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Chiffrement des données sensibles</li>
                    <li>Accès restreint aux données personnelles</li>
                    <li>Sauvegardes régulières et sécurisées</li>
                    <li>Formation du personnel à la protection des données</li>
                    <li>Audits de sécurité réguliers</li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Partage des Données</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement
                    avec :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Prestataires techniques :</strong> hébergement, maintenance (sous contrat de
                      sous-traitance)
                    </li>
                    <li>
                      <strong>Professionnels de santé :</strong> avec votre consentement explicite
                    </li>
                    <li>
                      <strong>Autorités compétentes :</strong> en cas d'obligation légale
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Notre site utilise des cookies pour :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Cookies techniques :</strong> fonctionnement du site (obligatoires)
                    </li>
                    <li>
                      <strong>Cookies analytiques :</strong> amélioration de l'expérience utilisateur (avec
                      consentement)
                    </li>
                  </ul>
                  <p>Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact et Réclamations</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Délégué à la Protection des Données (DPO) :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Email : dpo@movi-lab.fr</li>
                    <li>Courrier : movi-lab - DPO, 2 Rue Lieutenant Guy Dedieu, 31400 Toulouse</li>
                  </ul>
                  <p>
                    Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès
                    de la CNIL :
                    <a href="https://www.cnil.fr" className="text-orange-600 hover:underline ml-1">
                      www.cnil.fr
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <p className="text-gray-700">
                  <strong>Modifications :</strong> Cette politique de confidentialité peut être mise à jour. La version
                  en vigueur est toujours disponible sur notre site web avec la date de dernière modification.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
