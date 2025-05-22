'use client'

import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="flex flex-col">

      {/* Titre principal en haut de la page */}
      <h1 className="text-6xl font-extrabold text-center mt-12 mb-12">Qui sommes-nous</h1>

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
            Chez movi-lab, notre mission est de démocratiser l’analyse précise et fiable du mouvement en la rendant accessible à tous les sportifs. Nous proposons une solution qui dépasse l’analyse biomécanique vidéo traditionnelle en intégrant des technologies 3D avancées. Cette approche nous permet d’offrir des solutions fiables et des recommandations plus pertinentes, garantissant ainsi la précision et la véracité de nos analyses.
            <br /><br />
            Nous adoptons une approche intégrale, évaluant chaque sportif dans sa globalité et l’accompagnant dans l’atteinte de ses objectifs spécifiques. En combinant technologie de pointe, expertise scientifique et suivi personnalisé, nous œuvrons pour prévenir les blessures, optimiser les performances et améliorer le bien-être au quotidien.
          </p>
        </div>
      </section>


      {/* Section 2 - Notre Histoire */}
      <section className="w-full py-16 px-4 bg-[#0a1a2f] text-white">
        <h2 className="text-6xl font-extrabold text-center mt-12 mb-12">Notre histoire</h2>
        <p>
          En France, sur les 12,5 millions de coureurs, <span className="text-orange-500">environ 50 %</span> se blessent chaque année, un risque encore plus élevé pour les débutants, dont jusqu’à <span className="text-orange-500">80 %</span> se blessent au cours de leur <span className="text-orange-500">première année</span> de pratique. De plus, les technologies d’analyse du mouvement sont souvent sous-exploitées en dehors des laboratoires de recherche et restent inaccessibles aux sportifs.
          <br /><br />
          <span className="text-orange-500">Pour remédier à cette situation</span>, le docteur en robotique et biomécanique Galo Maldonado a créé movi-lab après plusieurs années de recherche dans le domaine du sport en collaboration avec le médecin du sport Xavier Delannoy.
          <br /><br />
          Aujourd’hui, movi-lab développe des <span className="text-orange-500">solutions avancées</span> grâce à son <span className="text-orange-500">approche globale</span> alliant technologie, science et accompagnement humain, avec la conviction que rendre l’analyse du mouvement accessible aux sportifs et adopter une approche numérique multidisciplinaire peuvent <span className="text-orange-500">révolutionner</span> la pratique sportive quotidienne.
        </p>
        <p className="mt-4 font-bold">ALL YOU NEED IS RUN</p>
      </section>

   

      {/* Section 3 - Équipe */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-6xl font-extrabold text-center mt-12 mb-12">Notre équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Galo Maldonado */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/placeholder.svg"
                alt="Galo Maldonado"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-orange-500 leading-tight">
              GALO<br />MALDONADO
            </h3>
            <p className="text-white mt-2 text-base">
              Docteur en robotique et chercheur en biomécanique, il se spécialise dans l’analyse et l’interprétation des données du mouvement. 
              Fondateur de la société, il applique son expertise à l’optimisation de la performance, notamment en course à pied. 
              Ancien footballeur professionnel en Équateur, il allie science et expérience du haut niveau pour affiner l’analyse du geste sportif.
            </p>
          </div>

          {/* Xavier Delannoy */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/placeholder.svg"
                alt="Xavier Delannoy"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-orange-500 leading-tight">
              XAVIER<br />DELANNOY
            </h3>
            <p className="text-white mt-2 text-base">
              Médecin du sport et titulaire d’un master en sciences du sport (STAPS), il se spécialise dans la prévention des blessures. 
              Consultant pour la société, il applique son expertise à l’analyse de chaque coureur. 
              Sportif passionné de sports de combat, il allie science et expérience du terrain pour optimiser la performance et réduire les risques.
            </p>
          </div>

          {/* Ryan Saidani */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/placeholder.svg"
                alt="Ryan Saidani"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-orange-500 leading-tight">
              RYAN<br />SAIDANI
            </h3>
            <p className="text-white mt-2 text-base">
              Coach sportif spécialisé en nutrition et course à pied, formé à la Clinique du Coureur, il vous accompagne dans l’analyse des résultats 
              et l’élaboration de plans d’entraînement personnalisés. 
              Sportif passionné de sports de combat et de running, il allie expertise et expérience pour optimiser votre progression.
            </p>
          </div>
        </div>
      </section>

     
      {/* Section 4 - Valeurs */}
<section className="w-full py-16 px-4 bg-[#0a1a2f] text-white">
  <h2 className="text-5xl font-extrabold mb-16 text-center">Nos valeurs</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* Fiabilité */}
    <div className="text-center text-orange-500">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <Image
          src="/Fiabilité.png"
          alt="Fiabilité"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">FIABILITÉ</h3>
      <p className="text-white text-base">
        Nous nous engageons à fournir des analyses précises et des recommandations fiables, assurant une constance et une qualité irréprochables dans nos services.
      </p>
    </div>

    {/* Bien-être */}
    <div className="text-center text-orange-500">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <Image
          src="/Bien-être.png"
          alt="Bien-être"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">BIEN-ÊTRE</h3>
      <p className="text-white text-base">
        Nous plaçons le bien-être de nos utilisateurs au centre de nos préoccupations, en développant des solutions qui favorisent une pratique sportive saine et épanouissante.
      </p>
    </div>

    {/* Honnêteté */}
    <div className="text-center text-orange-500">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <Image
          src="/Honnêteté.png"
          alt="Honnêteté"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">HONNÊTETÉ</h3>
      <p className="text-white text-base">
        La transparence est au cœur de nos interactions. Nous communiquons de manière ouverte et sincère avec nos clients, partenaires et collaborateurs, établissant ainsi une confiance mutuelle solide.
      </p>
    </div>

  </div>
</section>

    </main>
  )
}
