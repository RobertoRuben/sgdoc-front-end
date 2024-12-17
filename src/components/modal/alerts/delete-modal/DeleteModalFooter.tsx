import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteModalFooterProps {
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteModalFooter({ onClose, onConfirm }: DeleteModalFooterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-b from-gray-50/80 to-gray-100/80 dark:from-gray-950/80 dark:to-gray-900/80 p-6"
        >
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className={cn(
                            "w-full sm:w-auto min-w-[120px]",
                            "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                            "hover:bg-white dark:hover:bg-gray-800",
                            "border-2 border-gray-200 dark:border-gray-700",
                            "transition-all duration-300"
                        )}
                    >
                        Cancelar
                    </Button>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={cn(
                            "w-full sm:w-auto min-w-[120px]",
                            "bg-gradient-to-r from-red-500 to-red-600",
                            "hover:from-red-600 hover:to-red-700",
                            "dark:from-red-600 dark:to-red-700",
                            "dark:hover:from-red-700 dark:hover:to-red-800",
                            "shadow-lg shadow-red-500/20 dark:shadow-red-800/30",
                            "border-2 border-red-400/50 dark:border-red-500/50",
                            "transition-all duration-300"
                        )}
                    >
                        Eliminar
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}