"use client"

import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { TestimonialCard } from "@/components/testimonial-card"

type Testimonial = { name: string; company: string; message: string }
type Props = { testimonials: Testimonial[] }

export function TestimonialsSection({ testimonials }: Props) {
    const autoplay = useRef(
        Autoplay({
            delay: 2500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    return (
        <section className="relative py-16 bg-[#0b0f14] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.65),_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0b0f14] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0b0f14] to-transparent z-10" />
            <div className="relative max-w-7xl mx-auto px-6">
                <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight">
                    Témoignages de la communauté
                </h2>
                <div className="mt-10">
                    <Carousel plugins={[autoplay.current]} opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent className="-ml-4">
                            {testimonials.map((t, idx) => (
                                <CarouselItem key={idx} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                                    <TestimonialCard {...t} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-2 bg-white/10 border-white/10 hover:bg-white/20" />
                        <CarouselNext className="hidden md:flex -right-2 bg-white/10 border-white/10 hover:bg-white/20" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}