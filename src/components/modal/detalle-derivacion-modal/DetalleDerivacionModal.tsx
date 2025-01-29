import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DetalleDerivacionModalHeader } from "./components/DetalleDerivacionModalHeader";
import { DetalleDerivacionModalContent } from "./components/DetalleDerivacionModalContent";
import { AnimatePresence, motion } from "framer-motion";
import { DetalleDerivacionDetails } from "@/model/detalleDerivacionDetails";

interface DetalleDerivacionModalProps {
  isOpen: boolean;
  detalles: DetalleDerivacionDetails[];
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
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full"
        >
          <DetalleDerivacionModalHeader />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
              <DetalleDerivacionModalContent detalles={detalles} onClose={onClose} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}