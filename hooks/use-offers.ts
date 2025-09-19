"use client"
import { useEffect, useState } from "react"

type Service = {
    id: number
    name: string
    slug: string
    description?: string
    price: number
    duration_minutes: number
    is_active: boolean
    color?: string
}

export function useOffers() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch("/api/services", { cache: "no-store" })
                if (!res.ok) throw new Error("Erreur API services")
                const data = await res.json()
                setServices(data.services || [])
            } catch (err) {
                console.error("Erreur récupération offers :", err)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [])

    return { services, loading }
}