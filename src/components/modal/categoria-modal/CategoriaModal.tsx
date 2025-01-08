import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CategoriaModalHeader } from "./components/CategoriaModalHeader";
import { CategoriaModalForm } from "./components/CategoriaModalForm";
import { Categoria } from "@/model/categoria";
import { AnimatePresence, motion } from "framer-motion";

interface CategoriaModalProps {
  isOpen: boolean;
  categoria?: Categoria;
  onClose: () => void;
  onSubmit: (data: Categoria) => Promise<void>;
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

export function CategoriaModal({
  isOpen,
  categoria,
  onClose,
  onSubmit,
}: CategoriaModalProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!(categoria?.id && categoria.id > 0);

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
          <CategoriaModalHeader isEditing={isEditing} />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-grow"
            >
              <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <CategoriaModalForm
                  categoria={categoria}
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