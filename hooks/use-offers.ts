"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"

export function useOffers() {
    const [services, setServices] = useState([])
    const [supplements, setSupplements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [sRes, spRes] = await Promise.all([
                    fetch("/api/services", { cache: "no-store" }),
                    fetch("/api/supplements")
                ])

                const servicesData = await sRes.json()
                const supplementsData = await spRes.json()

                setServices(servicesData)
                setSupplements(supplementsData)
            } catch (err) {
                console.error("Erreur récupération offres :", err)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [])

    return { services, supplements, loading }
}