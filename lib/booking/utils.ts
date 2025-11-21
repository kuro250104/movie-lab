export const BUFFER_MINUTES = 10
export const FR_TZ = "Europe/Paris"

export const nn = <T>(v: T | undefined | null) => (v === undefined ? null : v)

export function must<T>(v: T | null | undefined, label: string): T {
    if (v == null) {
        console.error(`[BOOKING] '${label}' is null/undefined`)
        throw new Error(`Param '${label}' is null/undefined`)
    }
    return v
}

export function escapeHtml(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

export function currencyEUR(n: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0)
}

export type EmailSupplement = { id: number; name: string; price: number }