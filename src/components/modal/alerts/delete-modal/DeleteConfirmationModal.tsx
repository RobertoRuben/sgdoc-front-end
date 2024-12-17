import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { DeleteIcon } from './DeleteIcon';
import { DeleteModalContent } from './DeleteModalContent';
import { DeleteModalFooter } from './DeleteModalFooter';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

export function DeleteConfirmationModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            itemName
                                        }: DeleteConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            {/* Background Effects */}
                            <div className="absolute inset-0 bg-white dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/10 dark:from-red-500/10 dark:to-red-500/5" />

                            {/* Top Border Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                            {/* Content Container */}
                            <div className="relative">
                                <DialogHeader className="pt-8 px-6">
                                    <DialogTitle className="text-2xl font-semibold text-center flex flex-col items-center justify-center space-y-4">
                                        <DeleteIcon />
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
                                        >
                                            Confirmar Eliminación
                                        </motion.span>
                                    </DialogTitle>
                                </DialogHeader>

                                <DialogDescription asChild>
                                    <div className="text-center py-4 px-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="space-y-2"
                                        >
                                            <p className="text-lg font-medium text-gray-900 dark:text-gray-300">
                                                ¿Está seguro que desea realizar esta acción?
                                            </p>
                                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                                Se eliminará el siguiente ítem:
                                            </p>
                                        </motion.div>
                                    </div>
                                </DialogDescription>

                                <DeleteModalContent itemName={itemName} />
                                <DeleteModalFooter onClose={onClose} onConfirm={onConfirm} />
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}