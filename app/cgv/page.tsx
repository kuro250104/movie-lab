"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, FileText, Calendar, Euro } from "lucide-react"

export default function CGVPage() {
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
                <FileText className="w-4 h-4" />
                Conditions Générales
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
            >
              Conditions Générales de Vente
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Dernière mise à jour : Aout 2025
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
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  Article 1 - Objet
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre la
                  société movi-lab, SARL au capital de 10 000 euros, immatriculée au RCS de Toulouse sous le numéro 123
                  456 789, dont le siège social est situé 2 Rue Lieutenant Guy Dedieu, 31400 Toulouse, et ses clients
                  dans le cadre de la vente de services d'analyse biomécanique et de coaching sportif.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Euro className="w-6 h-6 text-orange-600" />
                  </div>
                  Article 2 - Prix et Paiement
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>2.1 Prix :</strong> Les prix de nos services sont indiqués en euros TTC :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>M-Starter : 119€ TTC</li>
                    <li>M-Pacer : 139€ TTC</li>
                    <li>M-Finisher : 159€ TTC</li>
                  </ul>
                  <p>
                    <strong>2.2 Modalités de paiement :</strong> Le paiement s'effectue par carte bancaire, virement ou
                    espèces. Le règlement est exigible à la commande pour les prestations ponctuelles.
                  </p>
                  <p>
                    <strong>2.3 Retard de paiement :</strong> Tout retard de paiement entraîne l'exigibilité immédiate
                    de l'intégralité des sommes dues et l'application de pénalités de retard au taux de 3 fois le taux
                    légal.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  Article 3 - Prestations et Délais
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>3.1 Description des prestations :</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>M-Starter :</strong> Analyse 3D de la foulée, diagnostic personnalisé (1h)
                    </li>
                    <li>
                      <strong>M-Pacer :</strong> M-Starter + analyse musculaire + évaluation chaussures (1h30)
                    </li>
                    <li>
                      <strong>M-Finisher :</strong> M-Pacer + plan d'entraînement + suivi 12 semaines
                    </li>
                  </ul>
                  <p>
                    <strong>3.2 Délais :</strong> Les rendez-vous sont programmés selon nos disponibilités. Un rapport
                    détaillé est remis dans les 48h suivant la séance.
                  </p>
                  <p>
                    <strong>3.3 Annulation :</strong> Toute annulation doit intervenir au moins 24h avant le
                    rendez-vous. En cas d'annulation tardive, la séance sera due intégralement.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Article 4 - Droit de Rétractation</h2>
                <p className="text-gray-700 leading-relaxed">
                  Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être
                  exercé pour les prestations de services pleinement exécutées avant la fin du délai de rétractation et
                  dont l'exécution a commencé avec l'accord préalable exprès du consommateur.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Article 5 - Responsabilité</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    movi-lab s'engage à fournir des prestations conformes aux règles de l'art et aux normes en vigueur.
                    Notre responsabilité est limitée aux dommages directs et prévisibles.
                  </p>
                  <p>
                    Le client s'engage à signaler tout problème de santé susceptible de contre-indiquer la pratique
                    sportive. movi-lab ne saurait être tenu responsable des conséquences d'une information erronée ou
                    incomplète.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Article 6 - Protection des Données</h2>
                <p className="text-gray-700 leading-relaxed">
                  Les données personnelles collectées sont traitées conformément à notre politique de confidentialité et
                  au RGPD. Elles sont utilisées uniquement dans le cadre de nos prestations et ne sont jamais transmises
                  à des tiers sans consentement.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Article 7 - Litiges</h2>
                <p className="text-gray-700 leading-relaxed">
                  En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les
                  tribunaux de Toulouse seront seuls compétents. Le droit français est applicable.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <p className="text-gray-700">
                  <strong>Contact :</strong> Pour toute question relative aux présentes CGV, vous pouvez nous contacter
                  à l'adresse info@movi-lab.fr ou au +33 (0)1 23 45 67 89.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
