import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Ban, X } from 'lucide-react';

interface DeactivateActionsProps {
    onClose: () => void;
    onConfirm: () => void;
    isDeactivating: boolean;
}

export function DeactivateActions({ onClose, onConfirm, isDeactivating }: DeactivateActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-3 px-6 py-4"
        >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full sm:w-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    onClick={onConfirm}
                    disabled={isDeactivating}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20"
                >
                    <Ban className="w-4 h-4 mr-2" />
                    {isDeactivating ? 'Deshabilitando...' : 'Deshabilitar Usuario'}
                </Button>
            </motion.div>
        </motion.div>
    );
}