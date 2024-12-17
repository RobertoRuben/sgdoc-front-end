import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ErrorIcon } from './ErrorIcon';
import { ErrorMessage } from './ErrorMessage';
import { ErrorButton } from './ErrorButton';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    errorMessage: string;
}

export default function ErrorModal({
                                       isOpen,
                                       onClose,
                                       title = "Error",
                                       errorMessage
                                   }: ErrorModalProps) {
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
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/10 dark:from-red-500/10 dark:to-red-500/5" />

                            {/* Error Ripple Effect */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0.5 }}
                                animate={{
                                    scale: [1, 2],
                                    opacity: [0.5, 0]
                                }}
                                transition={{
                                    duration: 1,
                                    ease: "easeOut",
                                    delay: 0.2
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 rounded-full"
                            />

                            {/* Top Border Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                            {/* Content Container */}
                            <div className="relative px-6 py-8">
                                <DialogHeader>
                                    <DialogTitle className="flex flex-col items-center justify-center space-y-4">
                                        <ErrorIcon />
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
                                        >
                                            {title}
                                        </motion.span>
                                    </DialogTitle>
                                </DialogHeader>

                                <ErrorMessage errorMessage={errorMessage} />
                                <ErrorButton onClose={onClose} />
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}