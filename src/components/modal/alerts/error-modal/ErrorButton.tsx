import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface ErrorButtonProps {
    onClose: () => void;
}

export function ErrorButton({ onClose }: ErrorButtonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-2 rounded-lg shadow-lg shadow-red-500/20 border-2 border-red-400/50 transition-all duration-300"
                >
                    Cerrar
                </Button>
            </motion.div>
        </motion.div>
    );
}