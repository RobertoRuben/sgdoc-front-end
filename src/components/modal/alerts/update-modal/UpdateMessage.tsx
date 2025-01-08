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
            <DialogDescription className="text-center text-lg text-gray-700 dark:text-gray-300">
                {message}
            </DialogDescription>
        </motion.div>
    );
}