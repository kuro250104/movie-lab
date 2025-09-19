"use client"
import Image from "next/image"
import {motion} from "framer-motion"
import Link from "next/link"
import {ArrowLeft, ExternalLink, Target, Users} from "lucide-react"

export default function AboutPage() {
    function toSafeHref(url?: string) {
        if (!url) return undefined
        return /^https?:\/\//i.test(url) ? url : `https://${url}`
    }

    return (
        <main className="flex flex-col text-black bg-white">
            <section className="relative w-full h-[600px] overflow-hidden">
                <Image
                    src="/marathon.jpg"
                    alt="Contactez-nous"
                    fill
                    className="object-cover object-center scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80"/>

                <motion.div
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                    className="absolute inset-0 z-10 flex flex-col justify-center px-6 max-w-7xl mx-auto text-white"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-8 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4"/>
                        Retour à l'accueil
                    </Link>

                    <div className="max-w-4xl">
                        <motion.div
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{delay: 0.3, duration: 0.8}}
                            className="mb-6"
                        >
                            <div
                                className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium">
                                <Users className="w-4 h-4"/>
                                Qui sommes-nous ?
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.5, duration: 1}}
                            className="text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                        >

                            Un brain d'histoire
                        </motion.h1>

                        <motion.p
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.7, duration: 0.8}}
                            className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl"
                        >
                            Découvrez movi-lab et notre engagement pour votre performance et votre
                            bien-être.
                        </motion.p>
                    </div>
                </motion.div>
            </section>
            <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
                <div className="px-6 max-w-7xl mx-auto">
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.6}}
                        className="text-center mb-16"
                    >
                        <div
                            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6">
                            <Target className="w-4 h-4"/>
                            Notre mission
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">All you need is run</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Démocratiser l'analyse du mouvement pour tous les sportifs.
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <motion.div
                            initial={{opacity: 0, x: -50}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.7}}
                            viewport={{once: true}}
                            className="md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
                        >
                            <Image
                                src="/qui-sommes-nous.png"
                                alt="Qui sommes-nous"
                                width={800}
                                height={500}
                                className="object-cover w-full h-full object-[50%_20%]"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </motion.div>
                        <motion.div
                            initial={{opacity: 0, x: 50}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{delay: 0.3, duration: 0.7}}
                            viewport={{once: true}}
                            className="md:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                        >
                            <p className="text-lg leading-relaxed text-gray-700">
                                C’est après des années de recherche et de passion pour la biomécanique dans un petit
                                local au coeur de la ville toulousaine que movi-lab a vu le jour.
                                <br/>
                                <br/>
                                <strong> Movi-lab ? </strong>C’est la réponse de ces 50 % de blessés chaque année parmi les 12,5 millions
                                de coureurs français, un constat qui fait froid dans le dos.
                                Ce risque est d’autant plus présent chez les amateurs, 80 % se blessent au cours de la
                                première année.
                                <br/>
                                <br/>
                                Grace au travaux de recherche effectué par l'équipe de movi-lab,
                                nous développons des solutions avancées grâce a notre approche globale alliant
                                technologie,
                                science et accompagnement humain, convaincu que cette vision peut révolutionner la
                                pratique sportive quotidienne.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white">
                <div className="px-6 max-w-7xl mx-auto">
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.6}}
                        className="text-center mb-16"
                    >
                        <div
                            className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6">
                            <Target className="w-4 h-4"/>
                            Notre parcours
                        </div>
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Notre mission
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Comment movi-lab est né de la passion et de la science.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.7}}
                        viewport={{once: true}}
                        className="max-w-4xl mx-auto text-lg leading-relaxed bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl"
                    >
                        <p className="text-gray-300 mb-4">
                            Nous proposons une solution qui dépasse l'analyse biomécanique vidéo traditionnelle en intégrant des technologies 3D avancées.
                            Cette approche nous permet d'offrir des{" "}
                            <span className="text-orange-400 font-semibold">solutions fiables </span> et des recommandations plus pertinentes, garantissant ainsi la
                            {" "}
                            <span className="text-orange-400 font-semibold">précision</span> et la <span className="text-orange-400 font-semibold">véracité </span>
                            de nos analyses.

                        </p>
                        <p className="text-gray-300 mb-4">
                            Nous adoptons une {""}
                            <span className="text-orange-400 font-semibold">approche intégrale</span>,
                            évaluant chaque sportif dans sa globalité et
                            {" "}<span className="text-orange-400 font-semibold">l'accompagnement </span>
                            dans l'atteinte de ses objectifs spécifiques. En combiantan technologie de pointe, expertise scientifique et suivi personnalisé,
                            nous œuvrons pour prévenir les blessures, optimiser les performances et améliorer le bien-être au quotidien.

                        </p>
                        <p className="mt-8 text-2xl font-bold text-orange-400 text-center">ALL YOU NEED IS RUN</p>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
                <div className="px-6 max-w-7xl mx-auto">
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.6}}
                        className="text-center mb-16"
                    >
                        <div
                            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6">
                            <Users className="w-4 h-4"/>
                            Nos experts
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">Nos collaborateurs</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Des professionnels passionnés au services de votre performance.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                        {[
                            {
                            name: "Ryan Saidani",
                            role: "Coach diététique",
                            image: "/ryan_saidani.png",
                            description:
                            "Coach sportif spécialisé en nutrition et course à pied, formé à la Clinique du Coureur, il vous accompagne dans l’analyse des résultats et l’élaboration de plans d’entraînement personnalisés. Sportif passionné de sports de combat et de running, il allie expertise et expérience pour optimiser votre progression.",
                        },
                        {
                            name: 'Vincent Picard',
                            image: "/vincent_picard.jpg",
                            role:"Coach sportif running",
                            description:
                            'Vincent est coach sportif depuis 2012, diplômé au CREPS de Dijon. Il s\'oriente progressivement vers la course à pied qui devient une passion et tout naturellement passe son diplôme fédéral d\'athlétisme afin de pouvoir encadrer et entraîner les runners/trailers.\n' +
                            'Aujourd\'hui il entraîne un groupe de trailers au nord de Toulouse et coach à distance des athlètes qui se préparent pour un 10km, un semi, un marathon ou d\'autres formats en trail.',
                            link: "https://www.vp-coach-sportif.com/"
                        },
                        {
                            name: 'Damien Tarride',
                            role: "Préparateur mental",
                            image: "/damien_tarride.jpg",
                            description: "Tarride Damien Éducateur sportif Judo, formé au Creps de Bordeaux , sophrologue caycedien spécialisé dans le sport, instructeur Oxygène advantage et Initiateur entraineur en apnée. \n" +
                            "Actuellement il intervient au sein de Cefal pour accompagner les patients douloureux chroniques. Il accompagne aussi des sportifs en préparation mental ou exercices de respiration (Running, triathlon, iron man, tennis, golf, foot, basket, sport de combat..). ",
                        link: "https://sophro-sport-et-performance.com/",
                        }
                        ].map((member) => {
                            const href = toSafeHref((member as any).link)
                            return (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
                                >
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-orange-500/50 shadow-md">
                                        <Image
                                            src={member.image || "/placeholder.svg"}
                                            alt={member.name}
                                            fill
                                            sizes="160px"
                                            className="object-cover object-[50%_10%]"
                                        />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{member.name}</h3>
                                    <p className="text-orange-600 text-sm font-semibold uppercase mb-4">{member.role}</p>
                                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">{member.description}</p>

                                    {/* ✅ Lien affiché seulement s’il existe */}
                                    {href && (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Prendre rendez-vous avec ${member.name}`}
                                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg shadow hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-colors duration-200"
                                        >
                                            En savoir plus
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </motion.div>
                            )
                        })}
                </div>
            </div>
        </section>

{/*/!* Values Section *!/*/
}
{/*<section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white">*/
}
{/*  <div className="px-6 max-w-7xl mx-auto">*/
}
{/*    <motion.div*/
}
{/*      initial={{ opacity: 0, y: 50 }}*/
}
{/*      whileInView={{ opacity: 1, y: 0 }}*/
}
{/*      viewport={{ once: true }}*/
}
{/*      transition={{ duration: 0.6 }}*/
}
{/*      className="text-center mb-16"*/
}
{/*    >*/
}
{/*      <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6">*/
}
{/*        <HeartHandshake className="w-4 h-4" />*/
}
{/*        Nos principes*/
}
{/*      </div>*/
}
{/*      <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">*/
}
{/*        Nos valeurs*/
}
{/*      </h2>*/
}
{/*      <p className="text-xl text-gray-300 max-w-2xl mx-auto">Les piliers de notre engagement envers vous.</p>*/
}
{/*    </motion.div>*/
}

{/*    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">*/
}
{/*      {[*/
}
{/*        {*/
}
{/*          icon: <ShieldCheck className="w-12 h-12" />,*/
}
{/*          title: "FIABILITÉ",*/
}
{/*          text: "Analyses précises et recommandations fiables pour une qualité constante.",*/
}
{/*        },*/
}
{/*        {*/
}
{/*          icon: <HeartHandshake className="w-12 h-12" />,*/
}
{/*          title: "BIEN-ÊTRE",*/
}
{/*          text: "Des solutions axées sur la santé et l’épanouissement des sportifs.",*/
}
{/*        },*/
}
{/*        {*/
}
{/*          icon: <Hand className="w-12 h-12" />,*/
}
{/*          title: "HONNÊTETÉ",*/
}
{/*          text: "Communication transparente avec coaches et partenaires pour une confiance durable.",*/
}
{/*        },*/
}
{/*      ].map((value, index) => (*/
}
{/*        <motion.div*/
}
{/*          key={index}*/
}
{/*          initial={{ opacity: 0, y: 30 }}*/
}
{/*          whileInView={{ opacity: 1, y: 0 }}*/
}
{/*          transition={{ delay: index * 0.1 }}*/
}
{/*          viewport={{ once: true }}*/
}
{/*          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"*/
}
{/*        >*/
}
{/*          <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400 w-fit mb-6">{value.icon}</div>*/
}
{/*          <h3 className="text-2xl font-bold text-white mb-2">{value.title}</h3>*/
}
{/*          <p className="text-gray-300 text-base leading-relaxed">{value.text}</p>*/
}
{/*        </motion.div>*/
}
{/*      ))}*/
}
{/*    </div>*/
}
{/*  </div>*/
}
{/*</section>*/
}
</main>
)
}
