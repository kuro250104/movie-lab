export const marqueeItems = [
    "Analyse posturale",
    "Recommandation de chaussures",
    "Bilan musculaire",
    "Conseils personnalisés",
    "Accompagnement",
    "Prévention",
    "Performance",
]

export const testimonials = [
    {
        name: "Lilie Assimeau",
        company: "Runneuse amateur",
        message: "J'ai realisé une analyse de la performance chez Movi-Lab et ça s'est super bien passé. Très , très bon accueil de la part de Galo et Océane. L'analyse était vraiment complète et les explication de Galo très claire. En tant que coureuse, je recommande à 100% de prendre rendez-vous chez Movi-Lab.",
    },
    {
        name: "Rudy Faure",
        company: "Coureur d'hyrox",
        message:
            "L’analyse 3D de ma foulée chez Movilab m’a permis d’identifier précisément mes points faibles et d’adapter mes entraînements. Grâce à leur expertise, j’ai pu progresser et courir plusieurs HYROX en étant à la fois à l’aise et performant.\nUn grand merci à toute l’équipe !",
    },
    {
        name: "Zacharie",
        company: "Coureur d'hyrox",
        message:"Plus aucune blessure depuis que je suis venu au labo ( decollement des periostes soignées), des records battus ( 42 min--> 38 min aux 10 km en 3 mois ) et tout ça grace à mon experience chez vous. Merci encore ;)",
    },
    {
        name: "Agathe Blanc",
        company: "Influenceuse diet & lifestyle",
        message:"Merci pour le bilan ! Tres complet et meme si je n'ai pas de blessures, ça m'a permis de voir que j'avais une rotation du bassin et du coup de choisir mes chaussures correctement pour améliorer ma course, et surtout important pour ne pas se blesser sur du long terme... Et merci également pour les exercices de renforcement musculaire en fonction de ma morphologie et de mes lacunes",
    },
    {
        name: "Xavier Couve",
        company: "Coach sportif",
        message:
            "Excellente expérience chez Movi-lab. Equipe très professionnelle et à l'écoute. J'ai pu, grace à leurs analyses, corriger certains défauts et adapter mon entrainement. Résultats : 3 records personnels sur Triahtlon mi distance, longue distance et semi-marathon. Merci encore les gars",
    },
    {
        name: "Jerome Bellanca",
        company: "Runner professionnel ",
        message:
            "C'est avec grand intérêt que j'ai fait plusieurs tests à Movi-Lab.\n" +
            "J'ai pu voir certains déséquilibres et avoir une idée précise du renforcement qu'il fallait que je fasse pour ne pas me blesser et optimiser mes performances.\n" +
            "L'étude de ma course avec différentes chaussures permet de faire un choix sur les caractéristiques à privilégier pour mon type de foulée.\n" +
            "Je valide à 200% la démarche et le professionnalisme.",
    },
]

export const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "À qui s’adresse cette analyse ?",
            acceptedAnswer: {
                "@type": "Answer",
                text:
                    "• Aux sportifs qui souhaitent avoir des conseils précis sur le choix des chaussures\n• Aux runners qui souhaitent diminuer le risque de blessures\n• Aux sportifs confirmés qui souhaitent optimiser leurs performances\n• Aux personnes souffrant de douleurs récurrentes en course à pied\n• Aux coureurs débutants qui veulent des conseils pour bien commencer la course à pied",
            },
        },
        {
            "@type": "Question",
            name: "Où se déroule l’analyse ?",
            acceptedAnswer: {
                "@type": "Answer",
                text:
                    "L’analyse se fait directement dans nos locaux, à la Cartoucherie, spécialement équipés pour ce type de bilan.",
            },
        },
        {
            "@type": "Question",
            name: "Est-ce que je dois apporter mon matériel ?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Oui : chaussures de course, short, chaussettes basses, brassière de sport.",
            },
        },
        {
            "@type": "Question",
            name: "Combien de temps dure la séance ?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "En moyenne, la séance dure entre 1h et 1h30 selon le pack.",
            },
        },
    ],
}