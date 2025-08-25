"use client"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/booking-modal"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Clock, Euro, Target, Zap, Award, Calendar, Star, ChevronRight } from "lucide-react"
import Link from "next/link"

const service = {
    name: "Pack Initial",
    price: 99,
    duration: 60,
}

const features = [
    {
        icon: <Target className="w-6 h-6" />,
        title: "Analyse 3D de votre course",
        description: "Technologie de pointe pour analyser votre foulée en détail",
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Diagnostic précis et personnalisé",
        description: "Évaluation complète de vos besoins spécifiques",
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: "Outils technologiques innovants",
        description: "Équipements de dernière génération pour des mesures précises",
    },
]

const supplements = [
    {
        title: "Bilan musculaire",
        price: 20,
        description: "Évaluation complète de vos forces et faiblesses musculaires pour optimiser votre entraînement",
        icon: <Zap className="w-6 h-6" />,
    },
    {
        title: "Bilan corps complet",
        price: 20,
        description: "Analyse posturale et biomécanique complète pour une approche globale",
        icon: <Award className="w-6 h-6" />,
    },
    {
        title: "Analyse des chaussures",
        price: 20,
        description: "Étude de votre équipement actuel et recommandations personnalisées",
        icon: <Target className="w-6 h-6" />,
    },
]

const benefits = [
    "Amélioration de votre technique de course",
    "Prévention des blessures",
    "Optimisation de vos performances",
    "Conseils personnalisés d'équipement",
    "Plan d'action adapté à vos objectifs",
    "Suivi et recommandations post-analyse",
]

export default function PackInitialPage() {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <Image
                    src="/blurred-runner-track.png"
                    alt="Pack Initial - Analyse de course"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />

                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour à l'accueil
                            </Link>

                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 mb-4">Offre de base</Badge>

                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Pack Initial</h1>

                            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                                Votre première étape vers une course optimisée. Découvrez votre potentiel avec notre analyse 3D complète
                                et nos conseils personnalisés.
                            </p>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-2 text-white">
                                    <Clock className="w-5 h-5 text-orange-400" />
                                    <span className="font-medium">1 heure</span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <Euro className="w-5 h-5 text-orange-400" />
                                    <span className="text-3xl font-bold">99€</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => setIsBookingModalOpen(true)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Réserver en ligne
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce qui est inclus</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Une analyse complète pour comprendre et optimiser votre course
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 w-fit mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supplements Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Options supplémentaires</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Personnalisez votre séance avec des analyses complémentaires
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {supplements.map((supplement, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600">{supplement.icon}</div>
                                    <Badge variant="outline" className="text-orange-600 border-orange-200 font-semibold">
                                        +{supplement.price}€
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{supplement.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{supplement.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-6 py-3 text-orange-600 font-medium">
                            <Star className="w-5 h-5" />
                            Sélectionnables lors de la réservation
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-bold mb-6">Pourquoi choisir le Pack Initial ?</h2>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Que vous soyez coureur amateur ou coureur du dimanche, ce service vous aidera à rendre vos courses plus
                                agréables et sans douleur.
                            </p>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="p-1 bg-green-500/20 rounded-full flex-shrink-0">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="text-gray-300">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl p-8 border border-orange-500/30">
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-orange-400 mb-2">99€</div>
                                    <div className="text-gray-300 mb-6">Pack Initial complet</div>
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center justify-center gap-2 text-gray-300">
                                            <Clock className="w-5 h-5 text-orange-400" />
                                            <span>Séance d'1 heure</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-gray-300">
                                            <Target className="w-5 h-5 text-orange-400" />
                                            <span>Analyse 3D complète</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setIsBookingModalOpen(true)}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                                    >
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Réserver maintenant
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                selectedService={service}
            />
        </div>
    )
}
