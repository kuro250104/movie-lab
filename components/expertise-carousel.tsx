'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {BarChart2Icon, ChevronLeft, ChevronRight, Code, Palette, Target, Users} from 'lucide-react'
import { Button } from '@/components/ui/button'

const expertises = [
  {
    icon: <Code className="w-12 h-12" />,
    title: "Technologies de pointe",
    description: "Analyse quantifiée du mouvement avec des capteurs.",
    features: ["Analyse posturale 3D", "Analyse musculaire","VO2Max", "Questionnaires numériques"]
  },
  {
    icon: <Target className="w-12 h-12" />,
    title: "Approche globale",
    description: "Une approche complète qui prend en compte tous les aspects de votre course.",
    features: ["Entrainement", "Facteurs biomécaniques", "Facteurs mentaux"]
  },
  {
    icon: <BarChart2Icon className="w-12 h-12" />,
    title: "Domaines",
    description: "Expertise dans les domaines les plus importants de la course à pied.",
    features: ["Prévention", "Performance", "Douleurs"]
  },
  {
    icon: <Users className="w-12 h-12" />,
    title: "Accompagnement",
    description: "Un accompagnement personnalisé avec des partenaires externes.",
    features: ["Médecine du sport", "Coaching running", "Préparation mentale", "Nutrition"]
  }
]

export function ExpertiseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % expertises.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + expertises.length) % expertises.length)
  }

  return (
    <div className="relative">
      {/* Desktop Grid View */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
        {expertises.map((expertise, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="text-orange-400 mb-4">
              {expertise.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{expertise.title}</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{expertise.description}</p>
            <div className="space-y-2">
              {expertise.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-400 text-xs">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile/Tablet Carousel View */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
            >
              <div className="text-orange-400 mb-6 flex justify-center">
                {expertises[currentIndex].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                {expertises[currentIndex].title}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-center">
                {expertises[currentIndex].description}
              </p>
              <div className="space-y-3">
                {expertises[currentIndex].features.map((feature, i) => (
                  <div key={i} className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex gap-2">
            {expertises.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-orange-400 w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
