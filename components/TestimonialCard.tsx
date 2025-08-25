'use client'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

interface TestimonialCardProps {
  name: string
  company: string
  message: string
}

export function TestimonialCard({ name, company, message }: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
        ))}
      </div>
      
      <div className="relative mb-6">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-400/30" />
        <p className="text-gray-200 leading-relaxed pl-6 italic">
          "{message}"
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-gray-400 text-sm">{company}</p>
        </div>
      </div>
    </motion.div>
  )
}
