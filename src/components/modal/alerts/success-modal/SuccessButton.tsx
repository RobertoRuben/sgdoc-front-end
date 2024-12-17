import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface SuccessButtonProps {
    onClose: () => void;
}

export function SuccessButton({ onClose }: SuccessButtonProps) {
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
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-2 rounded-lg shadow-lg shadow-green-500/20 border-2 border-green-400/50 transition-all duration-300"
                >
                    Aceptar
                </Button>
            </motion.div>
        </motion.div>
    );
}