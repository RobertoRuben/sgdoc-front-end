import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SuccessIcon } from './SuccessIcon';
import { SuccessMessage } from './SuccessMessage';
import { SuccessButton } from './SuccessButton';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export default function SuccessModal({
                                         isOpen,
                                         onClose,
                                         title = "Éxito",
                                         message = "Registro guardado exitosamente"
                                     }: SuccessModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="max-w-md p-0 overflow-hidden">
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
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10 dark:from-green-500/10 dark:to-green-500/5" />

                            {/* Success Ripple Effect */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0.5 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{
                                    duration: 1,
                                    ease: "easeOut",
                                    delay: 0.2
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 rounded-full"
                            />

                            {/* Top Border Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

                            {/* Content Container */}
                            <div className="relative px-6 py-8">
                                <DialogHeader>
                                    <DialogTitle className="flex flex-col items-center justify-center space-y-4">
                                        <SuccessIcon />
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"
                                        >
                                            {title}
                                        </motion.span>
                                    </DialogTitle>
                                </DialogHeader>

                                <SuccessMessage message={message} />
                                <SuccessButton onClose={onClose} />
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}