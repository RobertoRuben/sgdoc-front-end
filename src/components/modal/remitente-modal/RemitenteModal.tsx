import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RemitenteModalHeader } from "./components/RemitenteModalHeader";
import { RemitenteModalForm } from "./components/RemitenteModalForm";
import { Remitente } from "@/model/remitente";
import { AnimatePresence, motion } from "framer-motion";

interface RemitenteModalProps {
  isOpen: boolean;
  remitente?: Remitente;
  onClose: () => void;
  onSubmit: (data: Remitente) => Promise<void>;
}

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

export function RemitenteModal({
  isOpen,
  remitente,
  onClose,
  onSubmit,
}: RemitenteModalProps) {
  const isEditing = !!(remitente?.id && remitente.id > 0);

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
          <RemitenteModalHeader isEditing={isEditing} />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-grow"
            >
              <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <RemitenteModalForm
                  remitente={remitente}
                  isEditing={isEditing}
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