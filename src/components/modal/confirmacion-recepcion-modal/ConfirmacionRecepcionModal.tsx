import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmacionRecepcionModalHeader } from "./components/ConfirmacionRecepcionModalHeader";
import { ConfirmacionRecepcionModalContent } from "./components/ConfirmacionRecepcionModalContent";
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmacionRecepcionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.3, 
      delay: 0.1,
      ease: "easeOut"
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { 
      duration: 0.2,
      ease: "easeIn"
    } 
  }
};

export function ConfirmacionRecepcionModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmacionRecepcionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white overflow-hidden">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col"
        >
          <ConfirmacionRecepcionModalHeader />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ConfirmacionRecepcionModalContent onClose={onClose} onConfirm={onConfirm} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}