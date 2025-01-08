import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AmbitoModalHeader } from "./components/AmbitoModalHeader";
import { AmbitoModalForm } from "./components/AmbitoModalForm";
import { Ambito } from "@/model/ambito";
import { AnimatePresence, motion } from "framer-motion";

interface AmbitoModalProps {
  isOpen: boolean;
  ambito?: Ambito;
  onClose: () => void;
  onSubmit: (data: Ambito) => Promise<void>;
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

export function AmbitoModal({
  isOpen,
  ambito,
  onClose,
  onSubmit,
}: AmbitoModalProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!(ambito?.id && ambito.id > 0);

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
          <AmbitoModalHeader isEditing={isEditing} />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-grow"
            >
              <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <AmbitoModalForm
                  ambito={ambito}
                  isEditing={isEditing}
                  onClose={onClose}
                  onSubmit={async (data) => {
                    try {
                      setLoading(true);
                      await onSubmit(data);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  isLoading={loading}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}