'use client'

import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="flex flex-col">

      {/* Titre principal en haut de la page */}
      <h1 className="text-4xl font-extrabold text-center mt-12 mb-8">Qui sommes-nous</h1>

      {/* Section 1 - Image à gauche, slogan + texte à droite */}
      <section className="container mx-auto flex flex-col md:flex-row items-center gap-8 py-16 px-4">
        <div className="md:w-1/2">
          <Image
            src="/image-qui-sommes-nous.jpg"
            alt="Qui sommes-nous"
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-5xl font-extrabold mb-4 text-orange-500">All you need is run</h2>
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
            Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      </section>

      {/* Bande grise */}
      <div className="h-4 w-full bg-gray-100" />

      {/* Section 2 - Notre Histoire */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
          Duis sagittis ipsum. Praesent mauris.
        </p>
      </section>

      {/* Bande grise */}
      <div className="h-4 w-full bg-gray-100" />

      {/* Section 3 - Équipe */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">Notre équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((person) => (
            <div key={person} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/placeholder.svg"
                  alt={`Membre ${person}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold">Nom Prénom</h3>
              <p className="text-gray-600">Description du membre de l’équipe.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bande grise */}
      <div className="h-4 w-full bg-gray-100" />

      {/* Section 4 - Valeurs */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Fiabilité", "Bien-être", "Honnêteté"].map((valeur) => (
            <div key={valeur} className="text-center">
              <h3 className="text-xl font-semibold">{valeur}</h3>
              <p className="text-gray-600">Description à personnaliser pour cette valeur.</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
