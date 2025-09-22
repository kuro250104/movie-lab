// next-sitemap.config.js
const { Client } = require("pg")

const siteUrl = "https://movi-lab.fr"

async function query(sql) {
    const client = new Client({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 5432,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        ssl: process.env.DATABASE_SSL === "require" ? { rejectUnauthorized: false } : undefined,
    })
    await client.connect()
    const res = await client.query(sql)
    await client.end()
    return res.rows
}

const now = new Date().toISOString()

/** Petite fonction util pour filtrer */
function shouldExclude(path) {
    // Exclusion forte (admin/api)
    if (path.startsWith("/admin") || path.startsWith("/api")) return true
    // Fichiers & assets non-HTML
    if (/\.(txt|xml|json|ico|png|jpg|jpeg|gif|svg|webp|avif|mp4)$/i.test(path)) return true
    // App router internals
    if (path.startsWith("/_")) return true
    return false
}

module.exports = {
    siteUrl,
    generateRobotsTxt: true,
    autoLastmod: true,

    // Globs d’exclusion (app router)
    exclude: [
        "/admin",
        "/admin/**",
        "/api/**",
        "/_next/**",
        "/favicon.ico",
        "/robots.txt",
        "/sitemap*.xml",
    ],

    changefreq: "weekly",
    priority: 0.7,

    // Filtre final (si un chemin passe quand même)
    transform: async (_cfg, path) => {
        if (shouldExclude(path)) return null // <- l'entrée sera ignorée
        return {
            loc: path,
            changefreq: "weekly",
            priority: path === "/" ? 1 : 0.8,
            lastmod: now,
        }
    },

    additionalPaths: async () => {
        const [services, coachs] = await Promise.all([
            query("SELECT slug FROM services WHERE active = true").catch(() => []),
            query("SELECT slug FROM coaches WHERE active = true").catch(() => []),
        ])

        const base = [
            { loc: "/",            changefreq: "weekly",  priority: 1,   lastmod: now },
            { loc: "/services",    changefreq: "weekly",  priority: 0.8, lastmod: now },
            { loc: "/coachs",      changefreq: "monthly", priority: 0.6, lastmod: now },
            { loc: "/contact",     changefreq: "yearly",  priority: 0.4, lastmod: now },
            { loc: "/cgu",         changefreq: "yearly",  priority: 0.6, lastmod: now },
            { loc: "/cgv",         changefreq: "yearly",  priority: 0.6, lastmod: now },
            { loc: "/mentions-legales",        changefreq: "yearly",  priority: 0.6, lastmod: now },
            { loc: "/politique-confidentialite", changefreq: "yearly", priority: 0.6, lastmod: now },
        ]

        return [
            ...base,
            ...services.map(s => ({ loc: `/services/${s.slug}`, changefreq: "monthly", priority: 0.7, lastmod: now })),
            ...coachs.map(c => ({ loc: `/coachs/${c.slug}`,     changefreq: "monthly", priority: 0.5, lastmod: now })),
        ]
    },
}