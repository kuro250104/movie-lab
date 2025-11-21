import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

const ADMIN_ONLY_PAGES = [
    "/admin/management",
    "/admin/services",
]

const ADMIN_ONLY_MANAGEMENT_API_PREFIX = "/api/admin/management"
const SERVICES_API_PREFIX = "/api/admin/services"

function isAdminOnlyPage(pathname: string) {
    return ADMIN_ONLY_PAGES.some((base) => {
        return pathname === base || pathname.startsWith(base + "/")
    })
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const method = req.method

    const isAdminPagePath = pathname.startsWith("/admin")
    const isAdminApiPath = pathname.startsWith("/api/admin")
    const isLoginPage = pathname === "/admin/login"

    // On ne touche que /admin et /api/admin
    if (!isAdminPagePath && !isAdminApiPath) {
        return NextResponse.next()
    }

    const token = req.cookies.get("admin-token")?.value
    const payload = token ? await verifyToken(token) : null
    const isAuthenticated = !!payload
    const role = payload?.role ?? null

    console.log("🛡️ Middleware check:")
    console.log(" - Pathname:", pathname)
    console.log(" - Method:", method)
    console.log(" - Token present:", !!token)
    console.log(" - Authenticated:", !!isAuthenticated)
    console.log(" - Role:", role)

    // 1) Non authentifié
    if (!isAuthenticated && !isLoginPage) {
        if (isAdminApiPath) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // 2) Authentifié + sur /admin/login -> redir Dashboard
    if (isLoginPage && isAuthenticated) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    // 3) Règles de restriction pour les coachs
    if (isAuthenticated && role === "coach") {
        // 3.a) Pages réservées admin
        if (isAdminPagePath && isAdminOnlyPage(pathname)) {
            console.log("❌ Coach trying to access admin-only PAGE:", pathname)
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }

        // 3.b) API management : complètement interdit pour coach
        if (
            isAdminApiPath &&
            pathname.startsWith(ADMIN_ONLY_MANAGEMENT_API_PREFIX)
        ) {
            console.log("❌ Coach trying to access admin-only MANAGEMENT API:", pathname)
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // 3.c) API services : coach peut lire (GET) mais pas écrire
        if (
            isAdminApiPath &&
            pathname.startsWith(SERVICES_API_PREFIX) &&
            method !== "GET"
        ) {
            console.log(
                "❌ Coach trying to WRITE on services API:",
                method,
                pathname,
            )
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
    }

    console.log("✅ Access allowed.")
    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
}