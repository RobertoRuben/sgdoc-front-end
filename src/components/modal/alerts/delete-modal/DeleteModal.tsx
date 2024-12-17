// DeleteModal.tsx actualizado
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteIcon } from './DeleteIcon';
import { DeleteWarning } from './DeleteWarning';
import { DeleteActions } from './DeleteActions';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    itemName: string;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemName
}: DeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsDeleting(true);
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error al eliminar:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="max-w-lg p-0 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-white dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/10 dark:from-red-500/10 dark:to-red-500/5" />

                            <motion.div
                                initial={{ scale: 0, opacity: 0.5 }}
                                animate={{
                                    scale: [1, 1.5],
                                    opacity: [0.5, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeOut",
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 rounded-full"
                            />

                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                            <div className="relative px-6 py-8">
                                <DialogHeader>
                                    <DialogTitle className="flex flex-col items-center justify-center space-y-4">
                                        <DeleteIcon />
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
                                        >
                                            Eliminar
                                        </motion.span>
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="mt-6 space-y-6">
                                    <DeleteWarning itemName={itemName} />
                                    <DeleteActions
                                        onClose={onClose}
                                        onConfirm={handleConfirm}
                                        isDeleting={isDeleting}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}