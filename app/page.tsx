"use client"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ExpertiseCarousel } from "@/components/expertise-carousel"
import Marquee from "react-fast-marquee"
import { motion } from "framer-motion"
import { ArrowRight, Target} from "lucide-react"
import Link from "next/link"
import {useOffers} from "@/hooks/use-offers";
import {BookingModal} from "@/components/booking-modal";
import {useState} from "react";
import {LoadingPage} from "@/components/loading-spinner";
import {NewBookingModal} from "@/components/new-booking-modal";




const items = ["Analyse posturale", "Recommandation de chaussures", "Bilan musculaire","Conseils personalisés", "Accompagnement", "Prévention", "Performance"]
// const testimonials = [
//     {
//         name: "Client 1",
//         company: "Entreprise 1",
//         message: "Un accompagnement de qualité, je recommande vivement.",
//     },
//     {
//         name: "Client 2",
//         company: "Entreprise 2",
//         message: "Des résultats concrets dès les premières semaines.",
//     },
// ]

export default function Home() {

    const {services, loading} = useOffers()
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    type Service = { id:number; name:string; slug: string; price:number; duration_minutes:number; description?:string; is_active:boolean; color?:string }
    const normalizedServices = services.map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.slug ?? "",
        description: s.description ?? "",
        price: Number(s.price ?? 0),
        duration_minutes: s.duration_minutes ?? s.durationMinutes ?? 60,
        is_active: s.is_active ?? s.isActive ?? false,
        color: s.color ?? "bg-gray-500",
    }));
    const [selectedService, setSelectedService] = useState<Service | null>(null)


    if (loading) {
        return <LoadingPage message="Préparation de votre expérience MOVILAB..." variant="brand" size="md"/>
    }
    return (
        <main className="flex min-h-screen flex-col text-white">
            <section className="relative w-full min-h-[70svh] md:min-h-[80svh] overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/poster-hero.jpg"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                >
                    <source src="/0827.mp4" type="video/mp4" />
                    Ton navigateur ne supporte pas la vidéo HTML5.
                </video>

                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pb-10"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="max-w-4xl font-extrabold leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent text-[clamp(2rem,7vw,4.5rem)]"
                    >
                        Transforme tes défis en réussite, progresse en toute sérénité
                    </motion.h1>


                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="sr-only"
                    >
                        Analyse 3D de la course à Toulouse : bilan biomécanique, prévention des blessures
                        et amélioration de la performance avec des conseils personnalisés.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="mt-6"
                    >
                        <Button
                            onClick={() => {
                                document.getElementById("offers")?.scrollIntoView({ behavior: "smooth", block: "start" })
                            }}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                            Découvrir nos services
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </motion.section>
            </section>
            <div className="overflow-hidden border-y border-gray-800 bg-gradient-to-r from-gray-50 to-white py-4 text-black shadow-inner">
                <Marquee gradient={false} speed={40} className="text-lg font-semibold uppercase tracking-wider">
                    {items.concat(items, items).map((text, index) => (
                        <div key={index} className="mx-8 whitespace-nowrap flex items-center">
                            {text}
                        </div>
                    ))}
                </Marquee>
            </div>
            <section
                className="relative py-24 overflow-hidden"
                style={{
                    backgroundImage: "url('/image2site.jpeg')",
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

                        <h2 className="text-5xl font-bold text-gray-900 mb-4">Nos offres</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choisissez l'offre qui correspond à votre besoin, et réservez en moins de 2 minutes.
                        </p>
                    </div>

                    {normalizedServices.filter(s => s.is_active).length === 0 ? (
                        <div className="max-w-3xl mx-auto text-center text-gray-500">
                            Aucune offre active pour le moment.
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                            {normalizedServices.filter(s => s.is_active).map((svc) => (
                                <div
                                    key={svc.id}
                                    className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl border border-gray-800 mb-8"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h3 className="text-2xl font-bold text-white">{svc.name}</h3>
                                    </div>

                                    {svc.description && (
                                        <p className="text-white mb-6 whitespace-pre-line line-clamp-5 text-[clamp(0.95rem,3.2vw,1.2rem)] leading-relaxed">
                                            {svc.description}
                                        </p>
                                    )}

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between text-orange-400 mb-4">
                                            <div className="flex gap-1 font-extrabold">
                                                <span className="text-2xl">{Number(svc.price).toFixed(0)}€</span>
                                                <span className="text-sm font-bold text-white">TTC</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {svc.duration_minutes} min
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {svc.slug ? (
                                                <Link href={`/offers/${svc.slug}`} className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full text-black font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                                                    >
                                                        Détails
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button variant="outline" disabled className="flex-1">
                                                    Indispo
                                                </Button>
                                            )}

                                            <Button
                                                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                                                onClick={() => {
                                                    setSelectedService(svc)
                                                    setIsBookingModalOpen(true)
                                                }}
                                            >
                                                Réserver
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                </div>
            </section>
            {/*<section className="relative py-24 overflow-hidden">*/}
            {/*    <Image*/}
            {/*        src="/image5.jpg"*/}
            {/*        alt="Background témoignages"*/}
            {/*        fill*/}
            {/*        className="object-cover object-center scale-105"*/}
            {/*        priority*/}
            {/*    />*/}
            {/*    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />*/}
            {/*    <motion.div*/}
            {/*        initial={{ opacity: 0 }}*/}
            {/*        whileInView={{ opacity: 1 }}*/}
            {/*        viewport={{ once: true }}*/}
            {/*        transition={{ duration: 0.6 }}*/}
            {/*        className="relative px-6 max-w-7xl mx-auto"*/}
            {/*    >*/}
            {/*        <div className="text-center mb-16">*/}
            {/*            <motion.div*/}
            {/*                initial={{ opacity: 0, y: 20 }}*/}
            {/*                whileInView={{ opacity: 1, y: 0 }}*/}
            {/*                viewport={{ once: true }}*/}
            {/*                transition={{ delay: 0.2 }}*/}
            {/*                className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6"*/}
            {/*            >*/}
            {/*                <Star className="w-4 h-4 fill-current" />*/}
            {/*                Témoignages coaches*/}
            {/*            </motion.div>*/}
            {/*            <h2*/}
            {/*                id="testimonials"*/}
            {/*                className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"*/}
            {/*            >*/}
            {/*                Ils nous font confiance*/}
            {/*            </h2>*/}
            {/*        </div>*/}
            {/*        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">*/}
            {/*            {testimonials.map((t, index) => (*/}
            {/*                <motion.div*/}
            {/*                    key={index}*/}
            {/*                    initial={{ opacity: 0, scale: 0.95 }}*/}
            {/*                    whileInView={{ opacity: 1, scale: 1 }}*/}
            {/*                    transition={{ delay: index * 0.2 }}*/}
            {/*                    viewport={{ once: true }}*/}
            {/*                    className="transform hover:scale-105 transition-all duration-300"*/}
            {/*                >*/}
            {/*                    <TestimonialCard {...t} />*/}
            {/*                </motion.div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </motion.div>*/}
            {/*</section>*/}
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
                            <AccordionItem value="audience">
                                <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        À qui s’adresse cette analyse ?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-8 pb-6 pt-2">
                                    <div className="pl-16 text-gray-600 leading-relaxed space-y-2">
                                        <p>• Aux sportifs qui souhaitent avoir des conseils précis sur le choix des chaussures</p>
                                        <p>• Aux runners qui souhaitent diminuer le risque de blessures</p>
                                        <p>• Aux sportifs confirmés qui souhaitent optimiser leurs performances</p>
                                        <p>• Aux personnes souffrant de douleurs récurrentes en course à pied</p>
                                        <p>• Aux coureurs débutants qui veulent des conseils pour bien commencer la course à pieds</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="location">
                                <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        Où se déroule l’analyse ?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-8 pb-6 pt-2">
                                    <div className="pl-16 text-gray-600 leading-relaxed">
                                        L’analyse se fait directement dans <strong>nos locaux, à la Cartoucherie</strong>, spécialement équipés pour ce type de bilan.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="equipment">
                                <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        Est-ce que je dois apporter mon matériel ?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-8 pb-6 pt-2">
                                    <div className="pl-16 text-gray-600 leading-relaxed space-y-2">
                                        <p>Oui, tes chaussures de course, short, chaussettes basses, brassière de sport</p>

                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="duration">
                                <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        Combien de temps dure la séance ?
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-8 pb-6 pt-2">
                                    <div className="pl-16 text-gray-600 leading-relaxed">
                                        En moyenne, la séance dure entre <strong>1h</strong> à <strong>1h30</strong> selon le pack.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </motion.div>
            </section>

            {selectedService && (
                <NewBookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => {
                        setIsBookingModalOpen(false)
                        setSelectedService(null)
                    }}
                    selectedService={selectedService}
                />
            )}
        </main>
    )
}
