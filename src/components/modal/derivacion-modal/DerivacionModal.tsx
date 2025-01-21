import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DerivacionModalHeader } from "./components/DerivacionModalHeader";
import { DerivacionModalForm } from "./components/DerivacionModalForm";
import { AnimatePresence, motion } from "framer-motion";

interface DerivacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (areaId: number) => Promise<void>;
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

export function DerivacionModal({ isOpen, onClose, onSubmit }: DerivacionModalProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col"
        >
          <DerivacionModalHeader />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DerivacionModalForm
                onClose={onClose}
                onSubmit={async (areaId) => {
                  try {
                    setLoading(true);
                    await onSubmit(areaId);
                  } finally {
                    setLoading(false);
                  }
                }}
                isLoading={loading}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}