export default function Loading() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="animate-pulse space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-40 w-full bg-gray-200 rounded" />
                <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>
        </div>
    )
}