// DeleteWarning.tsx
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DeleteWarningProps {
    itemName: string;
}

export function DeleteWarning({ itemName }: DeleteWarningProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
        >
            <div className="flex items-center justify-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Esta acción es permanente</span>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative p-4"
            >
                <div className="absolute inset-0 bg-red-50 dark:bg-red-950/30 rounded-lg" />
                <div className="relative space-y-3">
                    <p className="text-center text-gray-700 dark:text-gray-300">
                        ¿Está seguro que desea eliminar permanentemente?:
                    </p>
                    <p className="text-lg font-semibold text-center text-red-700 dark:text-red-400 break-all">
                        {itemName}
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="text-center">Esta acción no se puede deshacer</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}