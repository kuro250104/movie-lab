"use client"

import { useRouter } from "next/navigation"

export default function PaymentCancelPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    Paiement annulé
                </h1>

                <p className="text-gray-600">
                    Le paiement n’a pas été validé.
                    Aucune réservation n’a été confirmée.
                    <br/>
                    <br/>
                    Vous pouvez réessayer pour finaliser votre séance.
                </p>

                <button
                    onClick={() => router.back()}
                    className="inline-flex mt-4 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
                >
                    Retour
                </button>
            </div>
        </div>
    )
}