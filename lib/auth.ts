import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { sql } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secret = new TextEncoder().encode(JWT_SECRET)

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

export async function verifyToken(token: string): Promise<AdminUser | null> {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload as AdminUser
    } catch {
        return null
    }
}

export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
    const token = request.cookies.get("admin-token")?.value
    if (!token) return null

    return await verifyToken(token)
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
    try {
        const result = await sql`
            SELECT id, email, password_hash, name, role
            FROM admins
            WHERE email = ${email}
        `

        if (result.length === 0) return null

        const admin = result[0]
        const isValid = await verifyPassword(password, admin.password_hash)

        if (!isValid) return null

        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        }
    } catch (error) {
        console.error("Authentication error:", error)
        return null
    }
}