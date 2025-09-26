"use client"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Send, MapPin, Mail, Clock, ArrowLeft} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {motion} from "framer-motion"
import {useToast} from "@/hooks/use-toast" // si tu as le toast shadcn (tu l'as dans ton repo)

type FormState = {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
}

export default function ContactClient() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<FormState>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    })

    const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.firstName || !form.lastName || !form.email || !form.message) {
            toast({ title: "Champs manquants", description: "Prénom, nom, email et message sont requis.", variant: "destructive" })
            return
        }
        setLoading(true)
        try {
            const res = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.error || "Échec de l’envoi.")
            }
            toast({ title: "Message envoyé ✅", description: "Merci ! Nous revenons vers vous au plus vite." })
            setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" })
        } catch (err: any) {
            toast({ title: "Erreur d’envoi", description: err?.message || "Veuillez réessayer.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex flex-col text-white">
            {/* HERO */}
            <section className="relative w-full h-[600px] overflow-hidden">
                <Image src="/blurred-runner-track.png" alt="Contactez-nous" fill className="object-cover object-center scale-105" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-10 flex flex-col justify-center px-6 max-w-7xl mx-auto text-white"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-8 w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l'accueil
                    </Link>

                    <div className="max-w-4xl">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium">
                                <Send className="w-4 h-4" />
                                Contactez-nous
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                        >
                            Nous sommes là pour vous aider
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl"
                        >
                            N'hésitez pas à nous contacter pour toute question ou pour prendre rendez-vous.
                        </motion.p>
                    </div>
                </motion.div>
            </section>

            {/* COORDONNÉES */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
                <div className="px-6 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6">
                            <MapPin className="w-4 h-4" />
                            Nos coordonnées
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">Trouvez-nous facilement</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Ton GPS te dis où tu vas, nous on te dis comment tu cours.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <InfoCard icon={<MapPin className="w-8 h-8" />} title="OÙ ?" lines={["2 Rue Lieutenant Guy Dedieu", "Toulouse, 31400"]} />
                        <InfoCard icon={<Mail className="w-8 h-8" />} title="COMMENT ?" lines={[
                            <a key="mail" href="mailto:info@movi-lab.fr" className="text-blue-600 hover:underline text-lg font-medium">info@movi-lab.fr</a>,
                        ]} />
                        <InfoCard icon={<Clock className="w-8 h-8" />} title="QUAND ?" lines={["Vendredi : 14h - 18h", "Samedi : 9h - 13h"]} />
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white">
                <div className="px-6 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-6">
                            <Send className="w-4 h-4" />
                            Formulaire de contact
                        </div>
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Envoyez-nous un message</h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">Nous vous répondrons dans les plus brefs délais.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl"
                    >
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                            <div>
                                <Input type="text" placeholder="NOM *" value={form.lastName} onChange={update("lastName")}
                                       className="bg-transparent border-b border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-orange-500 px-0 py-3 text-lg" />
                            </div>
                            <div>
                                <Input type="text" placeholder="PRÉNOM *" value={form.firstName} onChange={update("firstName")}
                                       className="bg-transparent border-b border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-orange-500 px-0 py-3 text-lg" />
                            </div>
                            <div>
                                <Input type="email" placeholder="E-MAIL *" value={form.email} onChange={update("email")}
                                       className="bg-transparent border-b border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-orange-500 px-0 py-3 text-lg" />
                            </div>
                            <div>
                                <Input type="tel" placeholder="TÉLÉPHONE" value={form.phone} onChange={update("phone")}
                                       className="bg-transparent border-b border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-orange-500 px-0 py-3 text-lg" />
                            </div>
                            <div className="md:col-span-2">
                                <Textarea placeholder="MESSAGE... *" value={form.message} onChange={update("message")}
                                          className="bg-transparent border-b border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-orange-500 resize-none min-h-[150px] px-0 py-3 text-lg" />
                            </div>
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <Button type="submit" disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                    <Send className="mr-2 h-5 w-5" />
                                    {loading ? "Envoi..." : "ENVOYER"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* MAP */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 text-black">
                <div className="px-6 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6">
                            <MapPin className="w-4 h-4" />
                            Notre emplacement
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">Venez nous rendre visite</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Retrouvez-nous facilement grâce à la carte interactive.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2889.5351025124196!2d1.4520099761462198!3d43.58799905555138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12aebb7e66195555%3A0x2a8f2f4b2b4f9e9a!2s2%20Rue%20du%20Lieutenant%20Guy%20Dedieu%2C%2031300%20Toulouse!5e0!3m2!1sfr!2sfr!4v1716465302000!5m2!1sfr!2sfr"
                            width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade" title="Google Maps - 2 Rue du Lieutenant Guy Dedieu, Toulouse" className="w-full"
                        />
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <a href="https://www.google.com/maps/dir//2+Rue+du+Lieutenant+Guy+Dedieu,+31300+Toulouse" target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                            <MapPin className="h-5 w-5 mr-2" />
                            Itinéraires
                        </a>
                        <a href="https://www.google.com/maps/place/2+Rue+du+Lieutenant+Guy+Dedieu,+31300+Toulouse/@43.5879991,1.45201,17z/" target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                            <MapPin className="h-5 w-5 mr-2" />
                            Agrandir le plan
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: React.ReactNode[] | string[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
        >
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 w-fit mx-auto mb-4">{icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{title}</h3>
            {lines.map((line, i) => (
                <p key={i} className="text-gray-700">{line}</p>
            ))}
        </motion.div>
    )
}