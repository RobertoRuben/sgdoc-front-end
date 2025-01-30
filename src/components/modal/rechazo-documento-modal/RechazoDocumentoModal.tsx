import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RechazoDocumentoModalHeader } from "./components/RechazoDocumentoModalHeader";
import { RechazoDocumentoModalForm } from "./components/RechazoDocumentoModalForm";
import { AnimatePresence, motion } from "framer-motion";

interface RechazoDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comentario: string) => Promise<void>;
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

export function RechazoDocumentoModal({
  isOpen,
  onClose,
  onSubmit,
}: RechazoDocumentoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full flex flex-col"
        >
          <RechazoDocumentoModalHeader />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
              <RechazoDocumentoModalForm onClose={onClose} onSubmit={onSubmit} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}