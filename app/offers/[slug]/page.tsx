"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/booking-modal"
import {ArrowLeft, Clock, Calendar, Target, Zap, Icon} from "lucide-react"
import { sneaker } from '@lucide/lab';
import {PersonSimpleRun, PersonSimple, SneakerMove, Note, Barbell} from "@phosphor-icons/react";
import {GiBackPain, GiLeg} from "react-icons/gi";
import { ImStatsDots} from "react-icons/im";
import { LiaUserFriendsSolid } from "react-icons/lia";



import type { ReactNode } from "react"

type Service = {
    id: number
    name: string
    description?: string | null
    price: number | string
    duration_minutes?: number | null
    durationMinutes?: number | null
    slug: string
}

type ServiceItem = {
    id: number
    icon?: string | null
    title: string
    description: string
}

const iconMap: Record<string, ReactNode> = {
    sneaker: <Icon iconNode={sneaker} className="w-5 h-5" />,
    target: <Target className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    runningMan: <PersonSimpleRun className="w-5 h-5"/>,
    simpleMan: <PersonSimple className="w-5 h-5"/>,
    shoes: <SneakerMove className="w-5 h-5"/>,
    note: <Note className="w-5 h-5"/>,
    leg: <GiLeg className="w-5 h-5"/>,
    chart: <ImStatsDots className="w-5 h-5"/>,
    barbell: <Barbell className="w-5 h-5"/>,
    backpain: <GiBackPain className="w-5 h-5" />,
    userfriend: <LiaUserFriendsSolid className="w-5 h-5"/>,
}

export default function OfferBySlugPage() {
    const { slug } = useParams<{ slug: string }>()
    const [service, setService] = useState<Service | null>(null)
    const [items, setItems] = useState<ServiceItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    useEffect(() => {
        if (!slug) return
            ;(async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/services/${slug}`, { cache: "no-store" })
                if (!res.ok) throw new Error("not found")
                const data = await res.json()
                setService(data.service)
                setItems(data.items ?? [])
            } catch (e) {
                console.error(e)
                setService(null)
                setItems([])
            } finally {
                setLoading(false)
            }
        })()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black">
                <p>Chargement de l’offre...</p>
            </div>
        )
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black">
                <p>Offre introuvable…</p>
            </div>
        )
    }

    const duration =
        service.duration_minutes ?? service.durationMinute
    const price = Number(service.price ?? 0)

    return (
        <div className="min-h-screen bg-white">
            <section className="relative h-[60vh] overflow-hidden">
                <Image
                    src="/blurred-runner-track.png"
                    alt={service.name}
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
                                className="inline-flex items-center gap-2 text-orange-400 hover:text-white transition mb-6"
                            >
                                <ArrowLeft className="w-6 h-6" />
                                Retour à l'accueil
                            </Link>


                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                                {service.name}
                            </h1>

                            <p className="text-xl text-gray-200 mb-8 leading-relaxed whitespace-pre-line">
                                {service.description ?? ""}
                            </p>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-2 text-white">
                                    <Clock className="w-5 h-5 text-orange-400" />
                                    <span className="font-medium">{duration} minutes</span>
                                </div>
                                <div className="text-white text-xl font-semibold">
                                    {price.toFixed(0)} €
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

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi choisir cette analyse ?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Une approche complète pour comprendre ta course et progresser durablement
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 w-fit mb-4">
                                        {item.icon ? (iconMap[item.icon] ?? null) : null}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">
                                Le détail de cette offre arrive bientôt.
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {service && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    selectedService={{
                        id: service.id,
                        name: service.name,
                        price,
                        duration_minutes: duration,
                    }}
                />
            )}
        </div>
    )
}