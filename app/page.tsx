"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ExpertiseCarousel } from "@/components/expertise-carousel"
import Marquee from "react-fast-marquee"
import { TestimonialCard } from "@/components/TestimonialCard"
import { motion } from "framer-motion"
import { Star, ArrowRight, Zap, Target, Award, Plus } from "lucide-react"
import Link from "next/link"
import {useOffers} from "@/hooks/use-offers";

const items = ["Technologies & Outils", "Approche 360°", "Domaines et Strégies", "Accompagnement et Formations"]

const testimonials = [
    {
        name: "Client 1",
        company: "Entreprise 1",
        message: "Un accompagnement de qualité, je recommande vivement.",
    },
    {
        name: "Client 2",
        company: "Entreprise 2",
        message: "Des résultats concrets dès les premières semaines.",
    },
]

export default function Home() {

    const {services, supplements, loading} = useOffers()
    const baseOffer = services[0]


    if (loading || !baseOffer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black">
                <p>Chargement des services...</p>
            </div>
        )
    }
    return (
        <main className="flex min-h-screen flex-col text-white">
            <section className="relative w-full h-[700px] overflow-hidden">
                <Image
                    src="/IMG_0596.jpg"
                    alt="Bannière motivation course"
                    fill
                    className="object-cover object-[50%_25%] scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium">
                            <Star className="w-4 h-4 fill-current" />
                            Expertise en analyse de course
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                    >
                        Transforme tes défis en réussite, progresse en toute sérénité
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="mt-8"
                    >
                        <Button
                            onClick={() => {
                                document.getElementById("offers")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                })
                            }}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                            Découvrir nos services
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            <div className="overflow-hidden border-y border-gray-800 bg-gradient-to-r from-gray-50 to-white py-6 text-black shadow-inner">
                <Marquee gradient={false} speed={40} pauseOnHover className="text-lg font-semibold uppercase tracking-wider">
                    {items.concat(items, items).map((text, index) => (
                        <div key={index} className="mx-8 whitespace-nowrap flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-4"></div>
                            {text}
                        </div>
                    ))}
                </Marquee>
            </div>

            <section
                className="relative py-24 overflow-hidden"
                style={{
                    backgroundImage: "url('/image7.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative px-6 max-w-7xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6"
                        >
                            <Zap className="w-4 h-4" />
                            Nos domaines d'expertise
                        </motion.div>
                        <h2
                            id="expertises"
                            className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        >
                            Nos expertises
                        </h2>
                    </div>
                    <ExpertiseCarousel />
                </motion.div>
            </section>

            <section id="offers" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
                <div className="px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6"
                        >
                            <Target className="w-4 h-4" />
                            Notre offre personnalisable
                        </motion.div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">{baseOffer.name} + Options</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Une offre de base complète que vous pouvez personnaliser selon vos besoins
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl border border-gray-800 mb-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400 flex-shrink-0">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold text-white mb-1">{baseOffer.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-orange-400">{baseOffer.price}</span>
                                        <span className="text-gray-400 text-xl">€</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div />
                                <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
                                    {baseOffer.description}
                                </div>
                            </div>

                            <div className="text-center">
                                <Link href="/pack-initial" className="inline-block">
                                    <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                        RÉSERVER MAINTENANT
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Options supplémentaires */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
                        >
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Options supplémentaires</h3>
                                <p className="text-gray-600">Personnalisez votre séance avec des analyses complémentaires</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {supplements.map((supplement, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{supplement.name}</h4>
                                                <div className="flex items-center gap-1 text-orange-600 font-bold">
                                                    <span>{supplement.price}</span>
                                                    <span className="text-sm">€</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">{supplement.description}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center mt-8">
                                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium">
                                    <Plus className="w-4 h-4" />
                                    Sélectionnables lors de la réservation
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative py-24 overflow-hidden">
                <Image
                    src="/image5.jpg"
                    alt="Background témoignages"
                    fill
                    className="object-cover object-center scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative px-6 max-w-7xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6"
                        >
                            <Star className="w-4 h-4 fill-current" />
                            Témoignages clients
                        </motion.div>
                        <h2
                            id="testimonials"
                            className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        >
                            Ils nous font confiance
                        </h2>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((t, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="transform hover:scale-105 transition-all duration-300"
                            >
                                <TestimonialCard {...t} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gradient-to-br from-white to-gray-50 text-black">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="px-6 max-w-4xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6"
                        >
                            <Target className="w-4 h-4" />
                            Questions fréquentes
                        </motion.div>
                        <h2 id="faq" className="text-5xl font-bold text-gray-900 mb-4">
                            FAQ
                        </h2>
                        <p className="text-xl text-gray-600">Trouvez rapidement les réponses à vos questions</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                        <Accordion type="single" collapsible className="w-full">
                            {["Coûts", "Délais", "Processus", "Support"].map((item: string, index: number) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 last:border-b-0">
                                    <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            {item}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-8 pb-6 pt-2">
                                        <div className="pl-16 text-gray-600 leading-relaxed">
                                            Réponse détaillée concernant {item.toLowerCase()}. Nous fournissons toutes les informations
                                            nécessaires pour répondre à vos questions et vous accompagner dans votre démarche d'amélioration
                                            de vos performances.
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </motion.div>
            </section>
        </main>
    )
}
