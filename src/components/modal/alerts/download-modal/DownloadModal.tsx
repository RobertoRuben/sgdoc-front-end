import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { DownloadIcon } from "./DownloadIcon";
import { DownloadWarning } from "./DownloadWarning";
import { DownloadActions } from "./DownloadActions";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  fileName: string;
  fileSize: string;
  fileType: string;
}

export default function DownloadModal({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  fileSize,
  fileType,
}: DownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDownloading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error al descargar archivo:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            className="max-w-lg p-0 overflow-hidden"
            aria-describedby="download-description"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-white dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 dark:from-blue-500/10 dark:to-blue-500/5" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              <div className="relative px-6 py-8">
                <DialogHeader>
                  <DialogTitle className="flex flex-col items-center justify-center space-y-4">
                    <DownloadIcon />
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
                    >
                      Descargar Archivo
                    </motion.span>
                  </DialogTitle>
                  <DialogDescription
                    id="download-description"
                    className="sr-only"
                  >
                    Modal para descargar el archivo {fileName}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                  <DownloadWarning
                    fileName={fileName}
                    fileSize={fileSize}
                    fileType={fileType}
                  />
                  <DownloadActions
                    onClose={onClose}
                    onConfirm={handleConfirm}
                    isDownloading={isDownloading}
                  />
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}