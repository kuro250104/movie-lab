'use client'

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const expertises = [
  {
    id: 1,
    title: "Analyse et stratégie digitale",
    image: "/image1.png", 
  },
  {
    id: 2,
    title: "Développement web",
    image: "/image2.png", 
  },
  {
    id: 3,
    title: "Automatisation des processus",
    image: "/image3.png", 
  },
  {
    id: 4,
    title: "Formation personnalisée",
    image: "/image4.png",
  },
]

export function ExpertiseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((current) => (current === expertises.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? expertises.length - 1 : current - 1))
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
    <div className="relative h-[650px] w-full overflow-hidden rounded-lg">
      {expertises.map((expertise, index) => (
        <div
          key={expertise.id}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: index === activeIndex ? 1 : 0 }}
        >
          <Image
            src={expertise.image || "/placeholder.svg"}
            alt={expertise.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
  
      {/* Flèches navigation */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        onClick={prevSlide}
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        onClick={nextSlide}
        aria-label="Image suivante"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
  
      {/* Dots de navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {expertises.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full ${index === activeIndex ? "bg-white" : "bg-gray-500"}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  </div>
  
  )
}
