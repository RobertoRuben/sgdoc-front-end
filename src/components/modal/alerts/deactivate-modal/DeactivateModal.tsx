import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeactivateIcon } from './DeactivateIcon';
import { DeactivateWarning } from './DeactivateWarning';
import { DeactivateActions } from './DeactivateActions';

interface DeactivateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    userName: string;
}

export default function DeactivateModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            userName
                                        }: DeactivateModalProps) {
    const [isDeactivating, setIsDeactivating] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsDeactivating(true);
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error al deshabilitar usuario:', error);
        } finally {
            setIsDeactivating(false);
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
                            transition={{
                                duration: 0.3,
                                ease: "easeOut"
                            }}
                            className="relative"
                        >
                            {/* Background Effects */}
                            <div className="absolute inset-0 bg-white dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl" />
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-500/10 dark:from-amber-500/10 dark:to-amber-500/5" />

                            {/* Warning Pulse Effect */}
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
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 rounded-full"
                            />

                            {/* Top Border Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                            {/* Content Container */}
                            <div className="relative px-6 py-8">
                                <DialogHeader>
                                    <DialogTitle className="flex flex-col items-center justify-center space-y-4">
                                        <DeactivateIcon />
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="text-2xl font-semibold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent"
                                        >
                                            Deshabilitar Usuario
                                        </motion.span>
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="mt-6 space-y-6">
                                    <DeactivateWarning userName={userName} />
                                    <DeactivateActions
                                        onClose={onClose}
                                        onConfirm={handleConfirm}
                                        isDeactivating={isDeactivating}
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