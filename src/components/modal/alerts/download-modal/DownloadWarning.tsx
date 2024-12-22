// DownloadWarning.tsx
import { motion } from 'framer-motion';
import { FileIcon } from 'lucide-react';

interface DownloadWarningProps {
    fileName: string;
    fileSize: string;
    fileType: string;
}

export function DownloadWarning({ fileName, fileSize, fileType }: DownloadWarningProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
        >
            <div className="flex items-center justify-center space-x-2 text-blue-600">
                <FileIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Información del archivo</span>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative p-4"
            >
                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950/30 rounded-lg" />
                <div className="relative space-y-3">
                    <p className="text-lg font-semibold text-center text-blue-700 dark:text-blue-400 break-all">
                        {fileName}
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <ul className="list-none space-y-1">
                            <li className="text-center">Tipo: {fileType}</li>
                            <li className="text-center">Tamaño: {fileSize}</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}