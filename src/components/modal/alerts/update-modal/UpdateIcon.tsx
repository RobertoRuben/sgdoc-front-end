import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export function UpdateIcon() {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
            }}
            className="relative"
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
            />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="relative z-10"
            >
                <RefreshCw className="w-16 h-16 text-blue-500" />
            </motion.div>
        </motion.div>
    );
}