import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export function SuccessIcon() {
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
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
            />
            <CheckCircle className="w-16 h-16 text-green-500 relative z-10" />
        </motion.div>
    );
}