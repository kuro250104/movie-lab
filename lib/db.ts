import postgres from "postgres"

const sql = postgres({
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT || "5432"),
    database: process.env.DATABASE_NAME!,
    username: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    ssl: process.env.PG_SSLMODE ? { rejectUnauthorized: false } : undefined,
    max: 10,
})

export { sql }
