"use client"

import { motion } from "framer-motion"
import { Target } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-white to-gray-50 text-black">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="px-6 max-w-4xl mx-auto"
            >
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-600 text-sm font-medium mb-6"
                    >
                        <Target className="w-4 h-4" />
                        Questions fréquentes
                    </motion.div>

                    <h2 id="faq" className="text-5xl font-bold text-gray-900 mb-4">
                        FAQ
                    </h2>
                    <p className="text-xl text-gray-600">Trouvez rapidement les réponses à vos questions</p>
                </div>
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="audience">
                            <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    À qui s’adresse cette analyse ?
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 pt-2">
                                <div className="pl-16 text-gray-600 leading-relaxed space-y-2">
                                    <p>• Aux sportifs qui souhaitent avoir des conseils précis sur le choix des chaussures</p>
                                    <p>• Aux runners qui souhaitent diminuer le risque de blessures</p>
                                    <p>• Aux sportifs confirmés qui souhaitent optimiser leurs performances</p>
                                    <p>• Aux personnes souffrant de douleurs récurrentes en course à pied</p>
                                    <p>• Aux coureurs débutants qui veulent des conseils pour bien commencer la course à pied</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="location">
                            <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    Où se déroule l’analyse ?
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 pt-2">
                                <div className="pl-16 text-gray-600 leading-relaxed">
                                    L’analyse se fait directement dans <strong>nos locaux, à la Cartoucherie</strong>, spécialement équipés pour ce type de bilan.
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="equipment">
                            <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    Est-ce que je dois apporter mon matériel ?
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 pt-2">
                                <div className="pl-16 text-gray-600 leading-relaxed space-y-2">
                                    <p>Oui : chaussures de course, short, chaussettes basses, brassière de sport.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="duration">
                            <AccordionTrigger className="px-8 py-6 text-left text-xl font-semibold hover:bg-gray-50 transition-colors duration-200 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-500/20 transition-colors duration-200">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    Combien de temps dure la séance ?
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-6 pt-2">
                                <div className="pl-16 text-gray-600 leading-relaxed">
                                    En moyenne, la séance dure entre <strong>1h</strong> et <strong>1h30</strong> selon le pack.
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </motion.div>
        </section>
    )
}