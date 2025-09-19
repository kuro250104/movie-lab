export const isDebugEnabled =
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEBUG_ADMIN === "true"

export function debugLog(...args: any[]) {
    if (isDebugEnabled) {
        console.log(...args)
    }
}