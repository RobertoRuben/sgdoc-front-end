import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DetalleDerivacionModalHeader } from "./components/DetalleDerivacionModalHeader";
import { DetalleDerivacionModalContent } from "./components/DetalleDerivacionModalContent";
import { AnimatePresence, motion } from "framer-motion";
import {DetalleDerivacion} from "@/model/detalleDerivacion.ts";

interface DetalleDerivacionModalProps {
  isOpen: boolean;
  detalles: DetalleDerivacion[];
  onClose: () => void;
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

export function DetalleDerivacionModal({
  isOpen,
  detalles,
  onClose,
}: DetalleDerivacionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col h-full"
        >
          <DetalleDerivacionModalHeader />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 min-h-0"
            >
              <DetalleDerivacionModalContent detalles={detalles} onClose={onClose} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}