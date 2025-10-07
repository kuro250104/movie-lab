import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {

    title: "Movi-Lab - Analyse 3D de la course",
    description: "Transforme tes défis en réussite, progresse en toute sérénité avec notre analyse 3D de pointe",
    icons: {

        icon: [
            { url: "/favicon.ico", type: "image/x-icon" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png",  }],
        shortcut: "/favicon.ico",
    },
    appleWebApp: {
        title: "Movi-Lab",
        statusBarStyle: "default",
        capable: true
    },
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Movi-Lab | Analyse 3D de la course à pied à Toulouse - Performance & Prévention des blessures",
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
            "course à pied 3D",
            "analyse biomécanique",
            "analyse posturale",
            "analyse 3D course à pied",
            "analyse biomécanique Toulouse",

            "prévention des blessures running",
            "douleurs course à pied",
            "blessures sportives",
            "courir sans se blesser",

            "performance course à pied",
            "coaching course à pied",
            "progresser en course à pied",
            "préparation marathon",
            "courir longtemps",
            "amélioration de la performance sportive",
            "accompagnement sportif personnalisé",

            "motion capture running",
            "sport analytics",
            "technologie de course",
            "chaussures running adaptées",

            "movi lab",
            "movi-lab",
            "movilab",
            "MoviLab",
            "bilan postural Toulouse",
        ],
    }

    return (
        <html lang="fr">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            <Script
                id="jsonld-organization"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
            /><title>Movi-Lab - Analyse 3D de la course</title>
        </head>
        <body className={inter.className}>
        <SiteHeader/>
        {children}
        <Analytics />
        <SpeedInsights />
        <SiteFooter />
        </body>
        </html>
    )
}