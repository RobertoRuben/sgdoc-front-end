import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function DeleteIcon() {
    return (
        <div className="relative">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    times: [0, 0.7, 1]
                }}
            >
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-xl"
                    />
                    <AlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400 relative z-10" />
                </div>
            </motion.div>
        </div>
    );
}