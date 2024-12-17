import { motion } from 'framer-motion';
import { DialogDescription } from "@/components/ui/dialog";

interface ErrorMessageProps {
    errorMessage: string;
}

export function ErrorMessage({ errorMessage }: ErrorMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-6 space-y-4"
        >
            <DialogDescription className="text-center text-lg text-gray-700 dark:text-gray-300">
                No se pudo completar la operación
            </DialogDescription>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 blur-xl rounded-lg" />
                <p className="relative bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-4 rounded-lg text-center text-sm text-red-600 dark:text-red-400 shadow-sm">
                    {errorMessage}
                </p>
            </motion.div>
        </motion.div>
    );
}