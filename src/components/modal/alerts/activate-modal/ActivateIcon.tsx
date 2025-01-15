import { motion } from 'framer-motion';
import { UserCheck2 } from 'lucide-react';

export function ActivateIcon() {
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
                className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10 bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-full"
            >
                <UserCheck2 className="w-12 h-12 text-white" />
            </motion.div>
        </motion.div>
    );
}