"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Building, User, Shield } from "lucide-react"

export default function MentionsLegalesPage() {
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
                <Building className="w-4 h-4" />
                Informations légales
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
            >
              Mentions Légales
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Informations légales et réglementaires
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
                    <Building className="w-6 h-6 text-orange-600" />
                  </div>
                  Éditeur du Site
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Raison sociale :</strong> movi-lab SARL
                  </p>
                  <p>
                    <strong>Capital social :</strong> 10 000 euros
                  </p>
                  <p>
                    <strong>RCS :</strong> Toulouse 123 456 789
                  </p>
                  <p>
                    <strong>SIRET :</strong> 123 456 789 00012
                  </p>
                  <p>
                    <strong>Code APE :</strong> 9319Z (Autres activités liées au sport)
                  </p>
                  <p>
                    <strong>TVA Intracommunautaire :</strong> FR12 123456789
                  </p>
                  <p>
                    <strong>Adresse :</strong> 2 Rue Lieutenant Guy Dedieu, 31400 Toulouse, France
                  </p>
                  <p>
                    <strong>Téléphone :</strong> +33 (0)1 23 45 67 89
                  </p>
                  <p>
                    <strong>Email :</strong> info@movi-lab.fr
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  Directeur de Publication
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Nom :</strong> Galo Maldonado
                  </p>
                  <p>
                    <strong>Qualité :</strong> Gérant
                  </p>
                  <p>
                    <strong>Email :</strong> direction@movi-lab.fr
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Hébergement</h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Hébergeur :</strong> Vercel Inc.
                  </p>
                  <p>
                    <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
                  </p>
                  <p>
                    <strong>Site web :</strong>{" "}
                    <a href="https://vercel.com" className="text-orange-600 hover:underline">
                      vercel.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Conception et Développement</h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Conception :</strong> movi-lab
                  </p>
                  <p>
                    <strong>Développement :</strong> movi-lab
                  </p>
                  <p>
                    <strong>Technologies :</strong> Next.js, React, TypeScript
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  Propriété Intellectuelle
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et
                    la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les
                    documents téléchargeables et les représentations iconographiques et photographiques.
                  </p>
                  <p>
                    La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est
                    formellement interdite sauf autorisation expresse du directeur de publication.
                  </p>
                  <p>
                    Les marques et logos figurant sur le site sont déposés par movi-lab ou éventuellement par ses
                    partenaires. Toute reproduction totale ou partielle de ces marques ou logos effectuée à partir des
                    éléments du site sans l'autorisation expresse de movi-lab est donc prohibée.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Limitation de Responsabilité</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Les informations contenues sur ce site sont aussi précises que possible et le site est
                    périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des
                    lacunes.
                  </p>
                  <p>
                    Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien
                    vouloir le signaler par email à l'adresse info@movi-lab.fr, en décrivant le problème de la manière
                    la plus précise possible.
                  </p>
                  <p>
                    movi-lab ne pourra en aucun cas être tenu responsable de tout dommage de quelque nature qu'il soit
                    résultant de l'interprétation ou de l'utilisation des informations et/ou documents disponibles sur
                    ce site.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Liens Hypertextes</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres
                    ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de movi-lab.
                  </p>
                  <p>
                    De même, movi-lab ne peut être tenu responsable du contenu des sites qui auraient un lien vers le
                    présent site.
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <p className="text-gray-700">
                  <strong>Contact :</strong> Pour toute question concernant ces mentions légales, vous pouvez nous
                  contacter à l'adresse info@movi-lab.fr ou au +33 (0)1 23 45 67 89.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
