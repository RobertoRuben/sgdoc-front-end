import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: string
    backgroundColor?: string
    message?: string
    className?: string
}

export default function LoadingSpinner({
                                           size = 'md',
                                           color = '#03A64A',
                                           backgroundColor = 'rgba(3, 166, 74, 0.2)',
                                           message = 'Cargando...',
                                           className
                                       }: LoadingSpinnerProps) {
    const sizes = {
        sm: 40,
        md: 60,
        lg: 80
    }

    const spinnerSize = sizes[size]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                    "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50",
                    className
                )}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-[90vw] w-full sm:w-auto"
                >
                    <div className="flex flex-col items-center">
                        <motion.div
                            style={{
                                width: spinnerSize,
                                height: spinnerSize,
                                borderRadius: '50%',
                                border: `4px solid ${backgroundColor}`,
                                borderTopColor: color,
                                borderRightColor: color,
                            }}
                            animate={{
                                rotate: 360,
                                scale: [1, 1.1, 1],
                                borderColor: [backgroundColor, color, backgroundColor],
                                borderTopColor: [color, backgroundColor, color],
                                borderRightColor: [color, backgroundColor, color],
                            }}
                            transition={{
                                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                                borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                            }}
                        />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 text-center text-gray-600 dark:text-gray-300 font-semibold text-sm sm:text-base"
                        >
                            {message}
                        </motion.p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}