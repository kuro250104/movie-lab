"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white">
      <div className="container flex h-20 items-center px-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src="/placeholder.svg?height=40&width=40" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold"></span>
          </Link>
        </div>

        {/* Spacer to push buttons to the right */}
        <div className="flex-grow" />

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-12 pr-4">
          <Link href="/about" className="text-lg font-bold uppercase hover:text-blue-400">
            A propos
          </Link>
          <Link href="#" className="text-lg font-bold uppercase hover:text-blue-400">
            Contact
          </Link>
        </nav>

        {/* Mobile button */}
        <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="container px-4 pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link href="/about" className="text-lg font-bold uppercase hover:text-blue-400">
              A propos
            </Link>
            <Link href="#" className="text-lg font-bold uppercase hover:text-blue-400">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
