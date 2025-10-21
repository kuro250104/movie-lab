import type { MetadataRoute } from "next"
import { Client } from "pg"

export const runtime = "nodejs"

export const revalidate = 21600

const BASE_URL = "https://movi-lab.fr"

type Row = { slug: string; updated_at?: string | Date | null }

async function query<T = Row>(sql: string): Promise<T[]> {
    const client = new Client({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 5432,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        ssl: process.env.DATABASE_SSL === "require" ? { rejectUnauthorized: false } : undefined,
        statement_timeout: 15000,
        query_timeout: 15000,
        connectionTimeoutMillis: 10000
    })
    await client.connect()
    try {
        const res = await client.query(sql)
        return res.rows as T[]
    } finally {
        await client.end()
    }
}

function toDate(d?: string | Date | null): Date {
    if (!d) return new Date()
    try { return d instanceof Date ? d : new Date(d) } catch { return new Date() }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [services, coachs] = await Promise.all([
        query<Row>("SELECT slug, updated_at FROM services WHERE active = true").catch(() => []),
        query<Row>("SELECT slug, updated_at FROM coaches WHERE active = true").catch(() => []),
    ])

    const now = new Date()

    const staticPages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`,                         lastModified: now, changeFrequency: "weekly",  priority: 1 },
        { url: `${BASE_URL}/about`,                    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/services`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
        { url: `${BASE_URL}/coachs`,                   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/contact`,                  lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
        { url: `${BASE_URL}/cgu`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
        { url: `${BASE_URL}/cgv`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
        { url: `${BASE_URL}/mentions-legales`,         lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
        { url: `${BASE_URL}/politique-confidentialite`,lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    ]

    const serviceUrls: MetadataRoute.Sitemap = services.map((s) => ({
        url: `${BASE_URL}/services/${s.slug}`,
        lastModified: toDate(s.updated_at),
        changeFrequency: "monthly",
        priority: 0.7,
    }))

    const coachUrls: MetadataRoute.Sitemap = coachs.map((c) => ({
        url: `${BASE_URL}/coachs/${c.slug}`,
        lastModified: toDate(c.updated_at),
        changeFrequency: "monthly",
        priority: 0.5,
    }))

    const all = [...staticPages, ...serviceUrls, ...coachUrls]
    const unique = Array.from(new Map(all.map(i => [i.url, i])).values())

    return unique
}