"use client"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
    variant?: "default" | "dots" | "pulse" | "bars" | "brand"
    size?: "sm" | "md" | "lg"
    className?: string
}

export function LoadingSpinner({ variant = "brand", size = "md", className = "" }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    }

    if (variant === "dots") {
        return (
            <div className={`flex items-center justify-center space-x-2 ${className}`}>
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className="w-3 h-3 bg-orange-500 rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: index * 0.2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        )
    }

    if (variant === "pulse") {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <motion.div
                    className={`${sizeClasses[size]} bg-orange-500 rounded-full`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            </div>
        )
    }

    if (variant === "bars") {
        return (
            <div className={`flex items-center justify-center space-x-1 ${className}`}>
                {[0, 1, 2, 3, 4].map((index) => (
                    <motion.div
                        key={index}
                        className="w-1 bg-orange-500 rounded-full"
                        animate={{
                            height: [20, 40, 20],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: index * 0.1,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        )
    }

    if (variant === "brand") {
        return (
            <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
                {/* Logo animé */}
                <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                    <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
                    <motion.div
                        className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                </motion.div>

                {/* Texte animé */}
                <motion.div
                    className="flex items-center space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-lg font-bold text-gray-800">MOVILAB</span>
                    <motion.span
                        className="text-lg font-bold text-orange-500"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                        LAB
                    </motion.span>
                </motion.div>

                <div className="flex space-x-1">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-2 h-2 bg-orange-400 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: index * 0.3,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                className={`${sizeClasses[size]} border-4 border-orange-200 border-t-orange-500 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
        </div>
    )
}

export function LoadingPage({
                                message = "Chargement en cours...",
                                variant = "brand",
                                size = "md",
                            }: {
    message?: string
    variant?: "default" | "dots" | "pulse" | "bars" | "brand"
    size?: "sm" | "md" | "lg"
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* 👇 Ici tu choisis ton variant */}
                <LoadingSpinner variant={variant} size={size} />
                <motion.p
                    className="mt-6 text-gray-600 font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                    {message}
                </motion.p>
            </motion.div>
        </div>
    )
}
