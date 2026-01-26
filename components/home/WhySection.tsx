"use client"

import { motion } from "framer-motion"
import { TypingAnimation } from "@/components/ui/typing-animation"

export function WhySection() {
    return (
        <section className="relative py-12 bg-gradient-to-r from-slate-950 via-gray-900 to-slate-800 text-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div className="text-center md:text-left space-y-2">
                    <h3 className="text-3xl md:text-4xl font-extrabold">Pourquoi movi-lab ?</h3>
                    <p className="text-xl text-white max-w-xl mt-2">
                        Algorithmes avancés et modélisation 3D ultra-fine de la dynamique du mouvement pour révéler ce que l’œil ne voit pas.
                        <br />
                    </p>
                </div>
                <div className="flex sm:flex-row items-center gap-3">
                    <p className="text-xl text-white max-w-xl mt-2">
                        <TypingAnimation
                            words={["Une précision scientifique réelle, et pas du marketing."]}
                            typeSpeed={50}
                            deleteSpeed={150}
                            pauseDelay={2000}
                            loop
                        />
                    </p>
                </div>
            </motion.div>
        </section>
    )
}