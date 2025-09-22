"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type React from "react"

type TocItem = {
    id: string
    label: string
    icon?: React.ReactNode
}

type LegalLayoutProps = {
    label: string
    title: string
    updatedAt?: string
    icon?: React.ReactNode
    children: React.ReactNode
    backHref?: string
    descContent?: string

    /** --- Options stylées (facultatives) --- */
    notice?: React.ReactNode // message encadré au-dessus du contenu
    toc?: TocItem[]          // sommaire ancré (affiché à droite sur desktop)
    bgImageUrl?: string      // image de fond optionnelle derrière le gradient (hero)
}

export default function LegalLayout({
                                        label,
                                        title,
                                        updatedAt,
                                        icon,
                                        children,
                                        backHref = "/",
                                        descContent,
                                        notice,
                                        toc,
                                        bgImageUrl,
                                    }: LegalLayoutProps) {
    return (
        <main className="flex flex-col text-black bg-white min-h-screen">
            {/* ========== HERO ========== */}
            <section className="relative w-full h-[420px] overflow-hidden">
                {/* Fond image optionnel */}
                {bgImageUrl && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${bgImageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "brightness(0.4)",
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

                <div
                    className="absolute inset-0 opacity-[0.12]"
                    aria-hidden
                    style={{
                        backgroundImage:
                            "radial-gradient(currentColor 1px, transparent 1px), radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                        backgroundPosition: "0 0, 12px 12px",
                        color: "#ffffff",
                        maskImage:
                            "radial-gradient(1200px 400px at 50% 30%, #000 60%, transparent 100%)",
                        WebkitMaskImage:
                            "radial-gradient(1200px 400px at 50% 30%, #000 60%, transparent 100%)",
                    }}
                />

                <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-500/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-[28rem] w-[28rem] rounded-full bg-amber-300/20 blur-[100px]" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="absolute inset-0 z-10 flex flex-col justify-center px-6 max-w-7xl mx-auto text-white"
                >
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-8 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l'accueil
                    </Link>

                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                            className="mb-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-300 text-sm font-medium">
                                {icon}
                                {label}
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.7 }}
                            className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                        >
                            {title}
                        </motion.h1>

                        {descContent && (
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mb-3"
                            >
                                {descContent}
                            </motion.p>
                        )}

                        {updatedAt && (
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.7 }}
                                className="text-sm md:text-base text-gray-300/90 leading-relaxed max-w-2xl"
                            >
                                Dernière mise à jour : {updatedAt}
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            </section>

            <section className="relative py-16 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,173,96,0.08),_transparent_60%)]" />

                <div className="px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-10"
                        >
                            {notice && (
                                <div className="mb-8 rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
                                    <div className="text-sm text-orange-800">{notice}</div>
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none text-gray-700">
                                {children}
                            </div>
                        </motion.div>

                        {Array.isArray(toc) && toc.length > 0 && (
                            <aside className="lg:sticky lg:top-8 h-max">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="rounded-2xl border border-gray-200 bg-white/90 shadow-md p-5"
                                >
                                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-3">
                                        Sommaire
                                    </p>
                                    <nav>
                                        <ul className="space-y-2">
                                            {toc.map((item) => (
                                                <li key={item.id}>
                                                    <a
                                                        href={`#${item.id}`}
                                                        className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                                                    >
                            <span className="opacity-70 group-hover:opacity-100">
                              {item.icon}
                            </span>
                                                        <span>{item.label}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </motion.div>
                            </aside>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}