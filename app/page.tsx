"use client"

import { useMemo, useState } from "react"
import Script from "next/script"
import { useOffers } from "@/hooks/use-offers"
import { LoadingPage } from "@/components/loading-spinner"
import { BookingModal } from "@/components/booking-modal"
import Snow from "@/components/snow-effect"
import type { Service } from "@/lib/types/services"
import { faqJsonLd, marqueeItems, testimonials } from "@/lib/constants/home"
import { HeroSection } from "@/components/home/HeroSection"
import { MarqueeStrip } from "@/components/home/MarqueeStrip"
import { WhySection } from "@/components/home/WhySection"
import { ExpertisesSection } from "@/components/home/ExpertisesSection"
import { OffersSection } from "@/components/home/OffersSection"
import { GiftCardSection } from "@/components/home/GiftCardSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { FaqSection } from "@/components/home/FaqSection"

export default function Home() {
    const { services, loading } = useOffers()
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    const normalizedServices: Service[] = useMemo(() => {
        const src = Array.isArray(services) ? services : []
        return src.map((s: any) => ({
            id: Number(s.id),
            name: String(s.name ?? ""),
            slug: String(s.slug ?? ""),
            description: s.description ?? "",
            icon: s.icon ?? "",
            price: Number(s.price ?? 0),
            duration_minutes: Number(s.duration_minutes ?? s.durationMinutes ?? 60),
            is_active: Boolean(s.is_active ?? s.isActive ?? false),
            color: s.color ?? "bg-gray-500",
        }))
    }, [services])

    if (loading) {
        return <LoadingPage message="Préparation de votre expérience MOVILAB..." variant="brand" size="md" />
    }

    return (
        <main className="flex min-h-screen flex-col text-white">

            <HeroSection />
            <MarqueeStrip items={marqueeItems} />
            <WhySection />
            <ExpertisesSection />
            <OffersSection
                services={normalizedServices}
                onBook={(svc) => {
                    setSelectedService(svc)
                    setIsBookingModalOpen(true)
                }}
            />
            <GiftCardSection />
            <TestimonialsSection testimonials={testimonials} />
            <FaqSection />
            {selectedService && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => {
                        setIsBookingModalOpen(false)
                        setSelectedService(null)
                    }}
                    selectedService={selectedService}
                />
            )}
            <Script
                id="ld-faq-home"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
        </main>
    )
}