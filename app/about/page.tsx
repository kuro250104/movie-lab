"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Target, History, Users, ShieldCheck, HeartHandshake, Hand } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="flex flex-col text-black bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <Image
          src="/image-qui-sommes-nous.jpg"
          alt="Équipe Movi-Lab"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />

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
                <Users className="w-4 h-4" />
                Qui sommes-nous ?
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
            >
              Notre histoire, notre mission, nos valeurs
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl"
            >
              Découvrez l'équipe derrière movi-lab et notre engagement pour votre performance et votre bien-être.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
        <div className="px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              Notre mission
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">All you need is run</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Démocratiser l'analyse du mouvement pour tous les sportifs.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
            >
              <Image
                src="/image-qui-sommes-nous.jpg"
                alt="Qui sommes-nous"
                width={800}
                height={500}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              viewport={{ once: true }}
              className="md:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
            >
              <p className="text-lg leading-relaxed text-gray-700">
                Chez movi-lab, notre mission est de démocratiser l'analyse précise et fiable du mouvement en la rendant
                accessible à tous les sportifs. Nous proposons une solution qui dépasse l'analyse biomécanique vidéo
                traditionnelle en intégrant des technologies 3D avancées.
                <br />
                <br />
                Nous adoptons une approche intégrale, évaluant chaque sportif dans sa globalité et l'accompagnant dans
                l'atteinte de ses objectifs. En combinant technologie de pointe, expertise scientifique et suivi
                personnalisé, nous prévenons les blessures, optimisons les performances et améliorons le bien-être au
                quotidien.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6">
              <History className="w-4 h-4" />
              Notre parcours
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Notre histoire
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comment movi-lab est né de la passion et de la science.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-lg leading-relaxed bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl"
          >
            <p className="text-gray-300 mb-4">
              En France, sur les 12,5 millions de coureurs,{" "}
              <span className="text-orange-400 font-semibold">environ 50 %</span> se blessent chaque année. Ce risque
              est encore plus élevé pour les débutants dont jusqu'à{" "}
              <span className="text-orange-400 font-semibold">80 %</span> se blessent au cours de leur{" "}
              <span className="text-orange-400 font-semibold">première année</span> de pratique.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-orange-400 font-semibold">Pour remédier à cette situation</span>, le docteur en
              robotique et biomécanique Galo Maldonado a créé movi-lab, après plusieurs années de recherche avec le
              médecin du sport Xavier Delannoy.
            </p>
            <p className="text-gray-300">
              Aujourd'hui, movi-lab développe des{" "}
              <span className="text-orange-400 font-semibold">solutions avancées</span> grâce à son{" "}
              <span className="text-orange-400 font-semibold">approche globale</span> alliant technologie, science et
              accompagnement humain, convaincu que cette vision peut{" "}
              <span className="text-orange-400 font-semibold">révolutionner</span> la pratique sportive quotidienne.
            </p>
            <p className="mt-8 text-2xl font-bold text-orange-400 text-center">ALL YOU NEED IS RUN</p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
        <div className="px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Nos experts
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Notre équipe</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des professionnels passionnés au service de votre performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: "GALO MALDONADO",
                image: "/short-haired-man-portrait.png",
                description:
                  "Docteur en robotique et chercheur en biomécanique, il se spécialise dans l’analyse et l’interprétation des données du mouvement. Fondateur de la société, il applique son expertise à l’optimisation de la performance, notamment en course à pied. Ancien footballeur professionnel en Équateur, il allie science et expérience du haut niveau pour affiner l’analyse du geste sportif.",
              },
              {
                name: "XAVIER DELANNOY",
                image: "/xavier.png", // Assuming xavier.png is a valid image
                description:
                  "Médecin du sport et titulaire d’un master en sciences du sport (STAPS), il se spécialise dans la prévention des blessures. Consultant pour la société, il applique son expertise à l’analyse de chaque coureur. Sportif passionné de sports de combat, il allie science et expérience du terrain pour optimiser la performance et réduire les risques.",
              },
              {
                name: "RYAN SAIDANI",
                image: "/young-man-smiling-portrait.png",
                description:
                  "Coach sportif spécialisé en nutrition et course à pied, formé à la Clinique du Coureur, il vous accompagne dans l’analyse des résultats et l’élaboration de plans d’entraînement personnalisés. Sportif passionné de sports de combat et de running, il allie expertise et expérience pour optimiser votre progression.",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-orange-500/50 shadow-md">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{member.name}</h3>
                <p className="text-orange-600 text-sm font-semibold uppercase mb-4">
                  {index === 0
                    ? "Fondateur & Docteur en Robotique"
                    : index === 1
                      ? "Médecin du Sport & Consultant"
                      : "Coach Sportif & Nutritionniste"}
                </p>
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6">
              <HeartHandshake className="w-4 h-4" />
              Nos principes
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Nos valeurs
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Les piliers de notre engagement envers vous.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck className="w-12 h-12" />,
                title: "FIABILITÉ",
                text: "Analyses précises et recommandations fiables pour une qualité constante.",
              },
              {
                icon: <HeartHandshake className="w-12 h-12" />,
                title: "BIEN-ÊTRE",
                text: "Des solutions axées sur la santé et l’épanouissement des sportifs.",
              },
              {
                icon: <Hand className="w-12 h-12" />,
                title: "HONNÊTETÉ",
                text: "Communication transparente avec clients et partenaires pour une confiance durable.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400 w-fit mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
