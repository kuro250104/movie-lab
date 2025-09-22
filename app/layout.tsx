import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Movi-Lab - Analyse 3D de la course",
    description: "Transforme tes défis en réussite, progresse en toute sérénité avec notre analyse 3D de pointe",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "Movi-Lab - Analyse 3D de la course",
        description: "Transforme tes défis en réussite, progresse en toute sérénité avec notre analyse 3D de pointe",
        url: "https://movi-lab.fr",
        siteName: "Movi-Lab",
        images: [
            {
                url: "https://movi-lab.fr/og-image.png",
                width: 1200,
                height: 630,
                alt: "Movi-Lab - Analyse 3D de la course",
            },
        ],
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Movi-Lab - Analyse 3D de la course",
        description: "Transforme tes défis en réussite, progresse en toute sérénité avec notre analyse 3D de pointe",
        images: ["https://movi-lab.fr/og-image.png"],
    },
    alternates: {
        canonical: "https://movi-lab.fr",
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const orgJsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Movi-Lab",
        url: "https://movi-lab.fr",
        logo: "https://movi-lab.fr/logo.svg",
        description: "Movi-Lab est un laboratoire spécialisé dans l'analyse 3D de la course à Toulouse, dédié à la prévention des blessures et à l'amélioration des performances sportives.",
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "+33 9 79 21 92 48",
                contactType: "customer service",
                availableLanguage: ["French", "English"],
            },
        ],
        address: {
            "@type": "PostalAddress",
            streetAddress: "2 rue du Lieutenant Guy Dedieu",
            addressLocality: "Toulouse",
            postalCode: "31300",
            addressCountry: "FR",
        },
        sameAs: [
            "https://www.instagram.com/movilab__/",
        ],
        knowsAbout: [
            "analyse biomécanique Toulouse",
            "analyse 3D de la course",
            "prévention des blessures running",
            "bilan postural",
            "amélioration de la performance sportive",
            "accompagnement sportif personnalisé"
        ]
    }

    return (
        <html lang="fr">
        <head>
            <Script
                id="jsonld-organization"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
            />
        </head>
        <body className={inter.className}>
        <SiteHeader />
        {children}
        <Analytics />
        <SiteFooter />
        </body>
        </html>
    )
}