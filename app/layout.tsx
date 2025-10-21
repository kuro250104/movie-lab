import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    metadataBase: new URL("https://movi-lab.fr"),
    title: "Movi-Lab — Analyse 3D de la course à Toulouse",
    description:
        "Transforme tes défis en réussite : analyse biomécanique 3D de pointe à Toulouse pour progresser et prévenir les blessures.",
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: "/",
        siteName: "Movi-Lab",
        title: "Movi-Lab | Analyse 3D de la course à pied à Toulouse",
        description:
            "Analyse 3D, prévention des blessures et performance. Bilan biomécanique complet pour les coureurs.",
        images: [
            { url: "/og-image.png", width: 1200, height: 630, alt: "Movi-Lab - Analyse 3D de la course" },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Movi-Lab — Analyse 3D de la course",
        description:
            "Analyse biomécanique 3D de pointe à Toulouse : progresse en toute sérénité.",
        images: ["/og-image.png"],
    },
    icons: {
        icon: [
            { url: "/favicon.ico", type: "image/x-icon" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
        shortcut: "/favicon.ico",
    },
    appleWebApp: {
        title: "Movi-Lab",
        capable: true,
        statusBarStyle: "default",
    },
    manifest: "/site.webmanifest",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
    ],
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // --- JSON-LD: Organization ---
    const orgJsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Movi-Lab",
        authoredBy: "kuro",
        url: "https://movi-lab.fr",
        logo: "https://movi-lab.fr/logo.svg",
        description:
            "Laboratoire d’analyse 3D de la course à Toulouse, dédié à la prévention des blessures et à la performance.",
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
        sameAs: ["https://www.instagram.com/movilab__/"],
    }

    const localBusinessJsonLd = {
        "@context": "https://schema.org",
        "@type": "SportsActivityLocation",
        name: "Movi-Lab",
        image: "https://movi-lab.fr/og-image.png",
        url: "https://movi-lab.fr",
        telephone: "+33 9 79 21 92 48",
        priceRange: "€€",
        address: {
            "@type": "PostalAddress",
            streetAddress: "2 rue du Lieutenant Guy Dedieu",
            addressLocality: "Toulouse",
            postalCode: "31300",
            addressCountry: "FR",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 43.5987,
            longitude: 1.4206,
        },
        openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Sunday"], opens: "09:00", closes: "17:00" },
        ],
    }



    return (
        <html lang="fr">
        <body className={inter.className}>
        <SiteHeader />
        {children}
        <Analytics />
        <SpeedInsights />

        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Script id="ld-local" type="application/ld+json" strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <SiteFooter />
        </body>
        </html>
    )
}