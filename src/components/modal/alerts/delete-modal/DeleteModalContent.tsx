import { motion } from 'framer-motion';

interface DeleteModalContentProps {
    itemName: string;
}

export function DeleteModalContent({ itemName }: DeleteModalContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-2 px-6"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30 rounded-lg shadow-inner"
            >
        <span className="text-xl font-medium text-gray-700 dark:text-gray-200 break-all">
          {itemName}
        </span>
            </motion.div>
        </motion.div>
    );
}