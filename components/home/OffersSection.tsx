"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Service } from "@/lib/types/services"

type Props = {
    services: Service[]
    onBook: (service: Service) => void
}

export function OffersSection({ services, onBook }: Props) {
    const active = services.filter((s) => s.is_active)

    return (
        <section id="offers" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
            <div className="px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-bold text-gray-900 mb-4">Nos offres</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choisissez l'offre qui correspond à votre besoin, et réservez en moins de 2 minutes.
                    </p>
                </div>
                {active.length === 0 ? (
                    <div className="max-w-3xl mx-auto text-center text-gray-500">Aucune offre active pour le moment.</div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                        {active.map((svc) => (
                            <div
                                key={svc.id}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl border border-gray-800 mb-8"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h3 className="text-2xl font-bold text-white">{svc.name}</h3>
                                    <Badge className={svc.color}>{svc.icon}</Badge>
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
                                        <div className="text-sm text-gray-500">{svc.duration_minutes} min</div>
                                    </div>

                                    <div className="flex gap-2">
                                        {svc.slug ? (
                                            <Link
                                                href={`/offers/${svc.slug}`}
                                                className="flex-1"
                                                title={`Voir le détail de l'offre ${svc.name}`}
                                                aria-label={`Voir le détail de l'offre ${svc.name}`}
                                            >
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
                                            onClick={() => onBook(svc)}
                                            aria-label={`Réserver l'offre ${svc.name}`}
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
    )
}