// DownloadActions.tsx
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Download, X } from 'lucide-react';

interface DownloadActionsProps {
    onClose: () => void;
    onConfirm: () => void;
    isDownloading: boolean;
}

export function DownloadActions({ onClose, onConfirm, isDownloading }: DownloadActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-3 px-6 py-4"
        >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full sm:w-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    onClick={onConfirm}
                    disabled={isDownloading}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? 'Descargando...' : 'Descargar Archivo'}
                </Button>
            </motion.div>
        </motion.div>
    );
}