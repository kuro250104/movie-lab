"use client"

import { useEffect, useState } from "react"

export interface Service {
    id: number
    name: string
    description: string
    price: number
    duration_minutes: number
    is_active: boolean
    icon: string
    created_at: string
}

export function useServices() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`/api/services?=ts${Date.now()}`, { cache: "no-store" })
                const text = await res.text()

                if (!text) {
                    throw new Error("Réponse vide depuis /api/services")
                }

                const data = JSON.parse(text)
                console.log("✅ Données reçues :", data)
                setServices(data)
            } catch (error) {
                console.error("❌ Erreur chargement services :", error)
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [])

    return { services, loading }
}