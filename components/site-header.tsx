"use client"
import Link from "next/link"
import Image from "next/image"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Menu, X, Phone, Mail} from "lucide-react"
import {motion, AnimatePresence} from "framer-motion"

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <header
                className="sticky top-0 z-50 w-full bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-lg">
                <div className="flex h-20 items-center justify-between px-6 mx-auto max-w-7xl">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <div className="relative h-12 w-12">
                            <Image src="/logo.svg" title="logo movilab" alt="Logo Movilab" fill className="object-contain"/>
                        </div>
                    </Link>
                    <nav className="hidden md:flex gap-8 lg:gap-12">
                        <Link
                            href="/#offers"
                            className="text-lg font-semibold uppercase relative group"
                            onClick={() => {
                                document.getElementById("offers")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                })
                            }}
                        >
                            Nos Offres
                            <span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>
                        <Link href="/contact" className="text-lg font-semibold uppercase relative group">
                            Contact
                            <span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>
                        <Link href="/about" className="text-lg font-semibold uppercase relative group">
                            A propos
                            <span
                                className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>
                        {/*<Link href="/admin/login" className="text-lg font-semibold uppercase relative group">*/}
                        {/*    Connexion*/}
                        {/*    <span*/}
                        {/*        className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>*/}
                        {/*</Link>*/}
                    </nav>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-white hover:bg-gray-800"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-7 w-7"/> : <Menu className="h-7 w-7"/>}
                    </Button>
                </div>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{opacity: 0, y: -50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            transition={{duration: 0.3}}
                            className="md:hidden bg-gray-900/95 backdrop-blur-sm px-6 pb-6 border-t border-gray-800 shadow-xl"
                        >
                            <nav className="flex flex-col space-y-6 pt-4">
                                <Link
                                    href="/about"
                                    className="text-xl font-bold uppercase text-gray-200 hover:text-orange-400 transition-colors"
                                    onClick={toggleMenu}
                                >
                                    A propos
                                </Link>
                                <Link
                                    href="/#offers"
                                    className="text-xl font-bold uppercase text-gray-200 hover:text-orange-400 transition-colors"
                                    onClick={() => {
                                        toggleMenu()
                                        document.getElementById("offers")?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        })
                                    }}
                                >
                                    Nos Offres
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-xl font-bold uppercase text-gray-200 hover:text-orange-400 transition-colors"
                                    onClick={toggleMenu}
                                >
                                    Contact
                                </Link>
                                <div className="pt-4 border-t border-gray-700 space-y-3">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Phone className="w-4 h-4 text-orange-400"/>
                                        <a href="tel:+33979219248">+33 9 79 21 92 48</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Mail className="w-4 h-4 text-orange-400"/>
                                        <a href="mailto:info@movi-lab.fr">info@movi-lab.fr</a>
                                    </div>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    )
}
