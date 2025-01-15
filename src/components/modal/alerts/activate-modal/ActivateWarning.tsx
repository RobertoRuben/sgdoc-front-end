import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface ActivateWarningProps {
    userName: string;
}

export function ActivateWarning({ userName }: ActivateWarningProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
        >
            <div className="flex items-center justify-center space-x-2 text-emerald-600">
                <Info className="w-5 h-5" />
                <span className="text-sm font-medium">Esta acción requiere confirmación</span>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative p-4"
            >
                <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg" />
                <div className="relative space-y-3">
                    <p className="text-center text-gray-700 dark:text-gray-300">
                        Está a punto de habilitar al usuario:
                    </p>
                    <p className="text-lg font-semibold text-center text-emerald-700 dark:text-emerald-400 break-all">
                        {userName}
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p className="text-center">El usuario podrá:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Acceder al sistema</li>
                            <li>Realizar operaciones</li>
                            <li>Ver información</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}