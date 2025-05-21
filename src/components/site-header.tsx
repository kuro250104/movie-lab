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
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image src="/placeholder.svg?height=32&width=32" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold"></span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          
          <Link href="/about" className="text-sm font-medium uppercase hover:text-blue-400">
           A propos
          </Link>
          <Link href="#" className="text-sm font-medium uppercase hover:text-blue-400">
            Contact
          </Link>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {isMenuOpen && (
        <div className="container px-4 pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
           
            <Link href="/about" className="text-sm font-medium uppercase hover:text-blue-400">
              A propos
            </Link>
            <Link href="#" className="text-sm font-medium uppercase hover:text-blue-400">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
