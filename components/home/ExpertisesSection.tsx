"use client"

import { motion } from "framer-motion"
import { ExpertiseCarousel } from "@/components/expertise-carousel"

export function ExpertisesSection() {
    return (
        <section
            className="relative py-24 overflow-hidden"
            style={{
                backgroundImage: "url('/image2site.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            aria-label="Expertises movi-lab"
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
    )
}