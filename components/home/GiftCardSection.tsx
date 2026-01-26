"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GiftCardSection() {
    return (
        <section className="relative py-12 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white">
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-soft-light bg-[radial-gradient(circle_at_top,_#ffffff40,_transparent_60%),radial-gradient(circle_at_bottom,_#00000060,_transparent_60%)]" />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div className="text-center md:text-left space-y-2">
                    <p className="text-xs uppercase tracking-[0.25em] font-semibold text-orange-100/80">
                        offrir movi-lab
                    </p>
                    <h3 className="text-3xl md:text-4xl font-extrabold">Offrez une carte cadeau à un proche</h3>
                    <p className="text-sm md:text-base text-orange-50/90 max-w-xl mt-2">
                        Parfait pour un anniversaire, une préparation de course ou pour prendre soin d'un runner.
                        Vous choisissez le montant, la personne choisit la séance.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link href="/gift-card" className="w-full sm:w-auto" prefetch={false}>
                        <Button
                            className="w-full sm:w-auto bg-white text-orange-700 hover:bg-orange-50 font-semibold px-6 py-3 rounded-full shadow-xl text-sm md:text-base"
                            aria-label="Acheter une carte cadeau movi-lab"
                        >
                            Acheter une carte cadeau
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <p className="text-xs text-orange-100/80">Carte envoyée par e-mail • Valable 12 mois</p>
                </div>
            </motion.div>
        </section>
    )
}