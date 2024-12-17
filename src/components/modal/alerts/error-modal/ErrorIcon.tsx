import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function ErrorIcon() {
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
                className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
            />
            <AlertCircle className="w-16 h-16 text-red-500 relative z-10" />
        </motion.div>
    );
}