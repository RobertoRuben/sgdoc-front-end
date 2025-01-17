import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ActualizacionDocumentoModalHeader } from "./components/ActualizacionDocumentoModalHeader";
import { ActualizacionDocumentoModalForm } from "./components/ActualizacionDocumentoModalForm";
import { Documento } from "@/model/documento";
import { AnimatePresence, motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

interface ActualizacionDocumentoModalProps {
  isOpen: boolean;
  documento?: Documento;
  onClose: () => void;
  onSubmit: (data: Documento) => Promise<void>;
}

export function ActualizacionDocumentoModal({
  isOpen,
  documento,
  onClose,
  onSubmit,
}: ActualizacionDocumentoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col h-full"
        >
          <ActualizacionDocumentoModalHeader />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-grow"
            >
              <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <ActualizacionDocumentoModalForm
                  documento={documento}
                  onClose={onClose}
                  onSubmit={onSubmit}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}