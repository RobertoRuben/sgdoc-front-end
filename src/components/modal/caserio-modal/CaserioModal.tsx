import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CaserioModalHeader } from "./components/CaserioModalHeader";
import { CaserioModalForm } from "./components/CaserioModalForm";
import { Caserio } from "@/model/caserio";
import { CentroPoblado } from "@/model/centroPoblado";
import { getCentrosPoblados } from "@/service/centroPobladoService";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";

interface CaserioModalProps {
  isOpen: boolean;
  caserio?: Caserio;
  onClose: () => void;
  onSubmit: (data: Caserio) => Promise<void>;
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

export function CaserioModal({
  isOpen,
  caserio,
  onClose,
  onSubmit,
}: CaserioModalProps) {
  const [loading, setLoading] = useState(false); // Renombrar isLoading a loading
  const isEditing = !!(caserio?.id && caserio.id > 0); // Usar !! para ser consistente
  const [centrosPoblados, setCentrosPoblados] = useState<CentroPoblado[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCentrosPoblados = async () => {
      try {
        setLoading(true);
        const data = await getCentrosPoblados();
        setCentrosPoblados(data);
      } catch (error) {
        setError("Error al cargar los centros poblados");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCentrosPoblados();
    }
  }, [isOpen]);

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
          <CaserioModalHeader isEditing={isEditing} />
          <AnimatePresence mode="wait">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-grow"
            >
              <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {loading ? (
                  <div className="p-6 flex justify-center items-center">
                    <LoadingSpinner 
                      size="lg"
                      message="Cargando centros poblados..." 
                      color="#145A32"
                      backgroundColor="rgba(20, 90, 50, 0.2)"
                    />
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">
                    {error}
                  </div>
                ) : (
                  <CaserioModalForm
                    caserio={caserio}
                    centrosPoblados={centrosPoblados}
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
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}