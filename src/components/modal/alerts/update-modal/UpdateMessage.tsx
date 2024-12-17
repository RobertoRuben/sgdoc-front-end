import { motion } from 'framer-motion';
import { DialogDescription } from "@/components/ui/dialog";

interface UpdateMessageProps {
    message: string;
}

export function UpdateMessage({ message }: UpdateMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-6"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 blur-xl rounded-lg" />
                <DialogDescription className="relative text-center text-lg font-medium text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 p-4 rounded-lg shadow-sm">
                    {message}
                </DialogDescription>
            </motion.div>
        </motion.div>
    );
}