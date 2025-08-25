import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const token = req.cookies.get("admin-token")?.value
    const isAuthenticated = token && verifyToken(token)

    console.log("🛡️ Middleware check:")
    console.log(" - Pathname:", pathname)
    console.log(" - Token present:", !!token)
    console.log(" - Authenticated:", !!isAuthenticated)

    const isAdminPath = pathname.startsWith("/admin")
    const isLoginPage = pathname === "/admin/login"

    if (isAdminPath && !isLoginPage && !isAuthenticated) {
        console.log("❌ Non-authenticated access to admin, redirecting to login.")
        return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    if (isLoginPage && isAuthenticated) {
        console.log("✅ Already authenticated, redirecting to dashboard.")
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    console.log("✅ Access allowed.")
    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}