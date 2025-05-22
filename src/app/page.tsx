'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { ExpertiseCarousel } from '@/components/expertise-carousel'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
    <section className="relative w-full h-[650px]">
  <Image
    src="/image5.jpg"
    alt="Image fond"
    fill
    className="object-cover object-[50%_25%]"
    priority
  />
  <div className="absolute inset-0 bg-black/60" />
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4">
    <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
      Transforme tes défis en réussite, progresse en toute sérénité
    </h1>
  </div>
</section>

    
      <div className="flex w-full justify-center bg-black py-4 text-white">
        <div className="container flex justify-between px-4">
          <Link href="#" className="text-sm uppercase">Technologies & Outils</Link>
          <Link href="#" className="text-sm uppercase">Approche 360°</Link>
          <Link href="#" className="text-sm uppercase">Domaines et Stratégies</Link>
          <Link href="#" className="text-sm uppercase">Accompagnement et Formations</Link>
        </div>
      </div>

     
      <section
        className="relative bg-black py-16 text-white"
        style={{ backgroundImage: "url('/image7.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
       
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative  px-4">
          <h2 className="mb-12 text-3xl font-bold">Nos expertises</h2>
          <ExpertiseCarousel />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-black py-16 text-white">
        <div className="container px-4">
          <h2 className="mb-12 text-3xl font-bold">Nos packs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* PACKS */}
            {[
              {
                title: 'CLASSIQUE',
                price: '119 €',
                features: ['Analyse de site', 'Optimisation SEO', 'Rapport détaillé']
              },
              {
                title: 'AVANCÉ',
                price: '139 €',
                features: [
                  'Analyse complète',
                  'Optimisation SEO',
                  'Évaluation des concurrents',
                  'Stratégie personnalisée'
                ],
                badge: 'MEILLEURE OFFRE'
              },
              {
                title: 'PREMIUM',
                price: '159 €',
                features: [
                  'Analyse complète',
                  'Optimisation SEO',
                  "Plan d'implémentation",
                  'Suivi personnalisé'
                ]
              }
            ].map((pack, index: number) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-800 bg-gray-900 p-6"
              >
                {pack.badge && (
                  <div className="absolute -right-2 -top-2 rotate-12 bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
                    {pack.badge}
                  </div>
                )}
                <div className="mb-4 text-center">
                  <div className="text-sm uppercase">{pack.title}</div>
                  <div className="mt-2 text-3xl font-bold">{pack.price}</div>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  {pack.features.map((feature, idx: number) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">RÉSERVER</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
     {/* Testimonials Section */}
     <section className="relative bg-black py-16 text-white">
  {/* Image de fond */}
  <Image
    src="/image6.jpg"
    alt="Background témoignages"
    fill
    className="object-cover object-center opacity-30"
    priority
  />

  {/* Overlay sombre pour lisibilité */}
  <div className="absolute inset-0 bg-black/30" />

  {/* Contenu au-dessus */}
  <div className="relative container px-4">
    <h2 className="mb-12 text-3xl font-bold">Ils nous font confiance</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item: number) => (
        <Card key={item} className="bg-white text-black shadow-md">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">Client {item}</div>
                <div className="text-sm text-gray-600">Entreprise {item}</div>
              </div>
            </div>
            <div className="mb-2 flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>★</span>
              ))}
            </div>
            <p className="text-sm text-gray-800">
              "Grâce à leur accompagnement, nous avons pu transformer notre présence en ligne et augmenter
              significativement notre visibilité."
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


{/* FAQ Section */}
<section className="bg-black py-16 text-white">
  <div className="container px-4">
    <h2 className="mb-12 text-3xl font-bold">FAQ</h2>
    <div className="mx-auto max-w-3xl">
      <Accordion type="single" collapsible className="w-full">
        {['Coûts', 'Délais', 'Processus', 'Support'].map((item: string, index: number) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-800">
            <AccordionTrigger className="py-4 text-left text-lg font-medium">{item}</AccordionTrigger>
            <AccordionContent className="pb-4 pt-1 text-gray-300">
              Réponse détaillée concernant {item.toLowerCase()}. Nous fournissons toutes les informations nécessaires pour répondre à vos questions.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
</section>



    </main>
  )
}
