import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoResultsIcon } from "./NoResultsIcon";
import { NoResultsMessage } from "./NoResultsMessage";
import { NoResultsButton } from "./NoResultsButton";

interface NoResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function NoResultsModal({
  isOpen,
  onClose,
  title = "Sin resultados",
  message = "No se encontraron coincidencias con su busqueda :(",
}: NoResultsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="max-w-md p-0 overflow-hidden focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
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

              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full"
              />

              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              <div className="relative px-6 py-8">
                <DialogHeader>
                  <DialogTitle className="flex flex-col items-center justify-center space-y-4">
                    <NoResultsIcon />
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
                    >
                      {title}
                    </motion.span>
                  </DialogTitle>
                </DialogHeader>

                <NoResultsMessage message={message} />
                <NoResultsButton onClose={onClose} />
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
