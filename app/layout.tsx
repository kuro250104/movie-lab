import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movi-Lab - Analyse 3D de la course",
  description: "Transforme tes défis en réussite, progresse en toute sérénité avec notre analyse 3D de pointe",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
