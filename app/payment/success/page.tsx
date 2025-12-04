import { CheckCircle2 } from "lucide-react"

export default function PaymentSuccessPage({
                                               searchParams,
                                           }: {
    searchParams: { session_id?: string }
}) {
    const sessionId = searchParams.session_id

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Paiement confirmé 🎉
                </h1>
                <p className="text-gray-600">
                    Merci ! Votre réservation est confirmée. Vous recevrez un e-mail de
                    confirmation avec tous les détails de votre séance.
                </p>

                {sessionId && (
                    <p className="text-xs text-gray-400">
                        ID de transaction : <span className="font-mono">{sessionId}</span>
                    </p>
                )}

                <a
                    href="/"
                    className="inline-flex mt-4 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
                >
                    Retour à l&apos;accueil
                </a>
            </div>
        </div>
    )
}