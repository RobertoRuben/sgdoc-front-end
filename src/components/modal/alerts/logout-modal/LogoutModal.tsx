// LogoutModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { LogoutIcon } from "./LogoutIcon";
import { LogoutWarning } from "./LogoutWarning";
import { LogoutActions } from "./LogoutActions";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoggingOut(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            className="max-w-lg p-0 overflow-hidden"
            aria-describedby="logout-description"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-white dark:bg-gray-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/10 dark:from-red-500/10 dark:to-red-500/5" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

              <div className="relative px-6 py-8">
                <DialogHeader>
                  <DialogTitle className="flex flex-col items-center justify-center space-y-4">
                    <LogoutIcon />
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
                    >
                      Cerrar Sesión
                    </motion.span>
                  </DialogTitle>
                  <DialogDescription
                    id="logout-description"
                    className="sr-only"
                  >
                    Modal para cerrar sesión
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                  <LogoutWarning/>
                  <LogoutActions
                    onClose={onClose}
                    onConfirm={handleConfirm}
                    isLoggingOut={isLoggingOut}
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