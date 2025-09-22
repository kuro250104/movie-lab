"use client"
import Link from "next/link"
import Image from "next/image"
import {Mail, Phone, MapPin, Instagram, Youtube, Facebook, ArrowRight} from "lucide-react"

const TikTok = ({className}: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
)

export function SiteFooter() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="px-6 py-16 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="relative h-12 w-12">
                                <Image src="/logo.svg" alt="Logo Movilab" fill className="object-contain"/>
                            </div>
                        </Link>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                            Transformez vos défis en réussite avec notre analyse 3D de pointe. Démocratiser l'analyse du
                            mouvement
                            pour tous les sportifs.
                        </p>
                        <div className="text-2xl font-bold text-orange-400 mb-6">ALL YOU NEED IS RUN</div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <MapPin className="w-4 h-4 text-orange-400"/>
                                </div>
                                <span>2 Rue Lieutenant Guy Dedieu, Toulouse 31400</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Mail className="w-4 h-4 text-orange-400"/>
                                </div>
                                <a href="mailto:info@movi-lab.fr" className="hover:text-orange-400 transition-colors">
                                    info@movi-lab.fr
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Phone className="w-4 h-4 text-orange-400"/>
                                </div>
                                <a href="tel:+33979219248">+33 9 79 21 92 48</a>
                            </div>
                        </div>
                    </div>
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
                                    <ArrowRight
                                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                                >
                                    <ArrowRight
                                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"/>À
                                    propos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#offers"
                                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                                >
                                    <ArrowRight
                                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    Nos Offres
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                                >
                                    <ArrowRight
                                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/login"
                                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                                >
                                    <ArrowRight
                                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    Espace administrateur
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div className="border-t border-gray-800">
                <div className="px-6 py-8 mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm font-medium">Suivez-nous :</span>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.instagram.com/movilab__/"
                                    className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white"/>
                                </a>
                                {/*<a*/}
                                {/*    href="#"*/}
                                {/*    className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"*/}
                                {/*    aria-label="YouTube"*/}
                                {/*>*/}
                                {/*    <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white"/>*/}
                                {/*</a>*/}
                                <a
                                    href="https://www.facebook.com/profile.php?id=61577249641936"
                                    className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white"/>
                                </a>
                                <a
                                    href="https://www.tiktok.com/@movilab3?_r=1&_d=em581h2a9a428f&sec_uid=MS4wLjABAAAArnqGhsBHU5rH7uuToTp6VU_nK5P6eQhIka4cpMrDiMYXhEG4iJoQQk51bTEyThl7&share_author_id=7431867529990325281&sharer_language=fr&source=h5_m&u_code=eh2lj0ebde1199&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=99CB308A-D3CD-4F3B-B198-3CF3E7984F26&user_id=7431867529990325281&sec_user_id=MS4wLjABAAAArnqGhsBHU5rH7uuToTp6VU_nK5P6eQhIka4cpMrDiMYXhEG4iJoQQk51bTEyThl7&social_share_type=4&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233"
                                    className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:scale-110 group"
                                    aria-label="TikTok"
                                >
                                    <TikTok className="w-5 h-5 text-gray-400 group-hover:text-white"/>
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-sm">
                            <span>© 2025 Movilab - Tous droits réservés.</span>
                            <div className="flex gap-4">
                                <Link href="/mentions-legales" className="hover:text-orange-400 transition-colors">
                                    Mentions légales
                                </Link>
                                <Link href="/politique-confidentialite"
                                      className="hover:text-orange-400 transition-colors">
                                    Politique de confidentialité
                                </Link>
                                <Link href="/cgv" className="hover:text-orange-400 transition-colors">
                                    CGV
                                </Link>
                                <Link href="/cgu" className="hover:text-orange-400 transition-colors">
                                    CGU
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
