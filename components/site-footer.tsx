"use client"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Créer un composant TikTok personnalisé car lucide-react n'a pas d'icône TikTok native
const TikTok = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="px-6 py-16 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-12">
                <Image src="/logo.png" alt="Logo Movilab" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                movi-lab
              </span>
            </Link>

            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              Transformez vos défis en réussite avec notre analyse 3D de pointe. Démocratiser l'analyse du mouvement
              pour tous les sportifs.
            </p>

            <div className="text-2xl font-bold text-orange-400 mb-6">ALL YOU NEED IS RUN</div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <MapPin className="w-4 h-4 text-orange-400" />
                </div>
                <span>2 Rue Lieutenant Guy Dedieu, Toulouse 31400</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Mail className="w-4 h-4 text-orange-400" />
                </div>
                <a href="mailto:info@movi-lab.fr" className="hover:text-orange-400 transition-colors">
                  info@movi-lab.fr
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Phone className="w-4 h-4 text-orange-400" />
                </div>
                <span>+33 (0)1 23 45 67 89</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Navigation
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500 mt-2"></div>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/#offers"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Nos Offres
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Nos Services
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500 mt-2"></div>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/m-starter"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  M-Starter - 119€
                </Link>
              </li>
              <li>
                <Link
                  href="/m-pacer"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  M-Pacer - 139€
                </Link>
              </li>
              <li>
                <Link
                  href="/m-finisher"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  M-Finisher - 159€
                </Link>
              </li>
            </ul>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                href="https://outlook.office365.com/book/MoviLab@humet.fr/?fbclid=PAZXh0bgNhZW0CMTEAAaaql2oCV9PRAZafGbhQETj9Amkh10X-Ar8-qrkTYEz4NivvRd_b18_hfbQ_aem_uws6QOcnAICsDDfcqqXAlw"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  Prendre RDV
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-t border-gray-800">
        <div className="px-6 py-8 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm font-medium">Suivez-nous :</span>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"
                  aria-label="TikTok"
                >
                  <TikTok className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-sm">
              <span>© 2024 movi-lab. Tous droits réservés.</span>
              <div className="flex gap-4">
                <Link href="/mentions-legales" className="hover:text-orange-400 transition-colors">
                  Mentions légales
                </Link>
                <Link href="/politique-confidentialite" className="hover:text-orange-400 transition-colors">
                  Politique de confidentialité
                </Link>
                <Link href="/cgv" className="hover:text-orange-400 transition-colors">
                  CGV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
