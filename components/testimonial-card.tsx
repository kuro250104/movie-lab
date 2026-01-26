"use client"

import { Quote } from "lucide-react"
import { motion } from "framer-motion"

interface TestimonialCardProps {
  name: string
  company: string
  message: string
}

export function TestimonialCard({ name, company, message }: TestimonialCardProps) {
  return (
      <motion.div
          whileHover={{ y: -4 }}
          className="
        h-full
        rounded-2xl border border-white/10
        bg-white/[0.06] backdrop-blur-md
        p-6
        transition
        hover:bg-white/[0.10]
      "
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold leading-tight">{name}</h4>
            <p className="text-white/50 text-sm">{company}</p>
          </div>
        </div>

        <div className="relative">
          <Quote className="absolute -left-1 -top-2 w-7 h-7 text-orange-400/25" />
          <p className="text-white/80 leading-relaxed text-sm pl-5 italic">
            “{message}”
          </p>
        </div>
      </motion.div>
  )
}
