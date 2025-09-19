"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/booking-modal"
import {Target, Zap} from "lucide-react"
import type { ReactNode } from "react"

type Service = { id:number; name:string; slug:string; description:string; price:any; duration_minutes:number; is_active:boolean; color?:string|null }
type ServiceItem = { id:number; icon?:string|null; title:string; description:string }

const iconMap: Record<string, ReactNode> = {
    sneaker: <span className="inline-block w-5 h-5 rounded bg-gray-200" />,
    target: <Target className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
}

export default function OfferPage() {
    const { slug } = useParams<{ slug: string }>()
    const [service, setService] = useState<Service | null>(null)
    const [items, setItems] = useState<ServiceItem[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/public/services/${slug}`)
                if (!res.ok) throw new Error("not found")
                const { service, items } = await res.json()
                setService(service)
                setItems(items)
            } finally { setLoading(false) }
        })()
    }, [slug])

    if (loading) return <div className="max-w-4xl mx-auto p-8">Chargement…</div>
    if (!service) return <div className="max-w-4xl mx-auto p-8">Offre introuvable.</div>

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
            <p className="text-gray-600 mb-6 whitespace-pre-line">{service.description}</p>

            <div className="flex items-center gap-6 mb-10">
                <span className="text-3xl font-extrabold">{Number(service.price).toFixed(0)} €</span>
                <span className="text-gray-500">{service.duration_minutes} min</span>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setOpen(true)}>Réserver</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {items.map((it) => (
                    <div key={it.id} className="p-6 rounded-xl border bg-white shadow-sm">
                        <div className="flex items-start gap-3 mb-2">
                            {it.icon ? (iconMap[it.icon] ?? null) : null}
                            <h3 className="text-xl font-semibold">{it.title}</h3>
                        </div>
                        <p className="text-gray-600">{it.description}</p>
                    </div>
                ))}
            </div>

            {service && (
                <BookingModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    selectedService={{
                        id: service.id,
                        name: service.name,
                        price: Number(service.price),
                        duration_minutes: service.duration_minutes,
                    }}
                />
            )}
        </div>
    )
}