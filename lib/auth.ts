import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import { sql } from "./db"
import bcrypt from "bcryptjs"

const secretStr = process.env.JWT_SECRET
if (!secretStr) throw new Error("JWT_SECRET is missing")
const secret = new TextEncoder().encode(secretStr)

export interface AdminUser {
    id: number
    email: string
    name: string
    role: string
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}
export async function generateToken(user: AdminUser): Promise<string> {
    return await new SignJWT({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secret)
}

type TokenPayload = {
    id: number
    email: string
    name: string
    role: string
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret)

        return {
            id: payload.id as number,
            email: payload.email as string,
            name: payload.name as string,
            role: payload.role as string,
        }
    } catch (error) {
        console.error("JWT verify error:", error)
        return null
    }
}

export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
    const token = request.cookies.get("admin-token")?.value
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload) return null

    return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
    }
}
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
    try {
        const result = await sql/* sql */`
            SELECT id, email, password_hash, name, role
            FROM admins
            WHERE email = ${email}
                LIMIT 1
        `

        if (!result || result.length === 0) return null

        const row = result[0]
        const passwordHash: string | undefined = row.password_hash ?? row.passwordHash
        if (!passwordHash) {
            console.error("Admins.password_hash manquant pour:", row?.email)
            return null
        }

        const ok = await verifyPassword(password, passwordHash)
        if (!ok) return null

        return {
            id: row.id,
            email: row.email,
            name: row.name,
            role: row.role,
        }
    } catch (error) {
        console.error("Authentication error:", error)
        return null
    }
}