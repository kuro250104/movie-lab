"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="relative w-full min-h-[70svh] md:min-h-[80svh] overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                poster="/hero-poster.png"
                className="absolute inset-0 w-full h-full object-cover object-center"
            >
                <source src="/0827.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo HTML5.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pb-10"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto">
                    Transforme tes défis en réussite, progresse en toute sérénité
                </h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mt-6 flex gap-3"
                >
                    <Button
                        onClick={() => {
                            document
                                .getElementById("offers")
                                ?.scrollIntoView({ behavior: "smooth", block: "start" })
                        }}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                        Découvrir nos services
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </motion.div>
            </motion.section>
        </section>
    )
}