import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TrabajadorModalHeader } from "./components/TrabajadorModalHeader";
import { TrabajadorModalForm } from "./components/TrabajadorModalForm";
import { Trabajador } from "@/model/trabajador";
import { Area } from "@/model/area";
import { getAreas } from "@/service/areaService";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

interface TrabajadorModalProps {
  isOpen: boolean;
  trabajador?: Trabajador;
  onClose: () => void;
  onSubmit: (data: Trabajador) => Promise<void>;
}

export function TrabajadorModal({
  isOpen,
  trabajador,
  onClose,
  onSubmit,
}: TrabajadorModalProps) {
  const isEditing = !!(trabajador?.id && trabajador.id > 0);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAreas = async () => {
      try {
        setLoading(true);
        const data = await getAreas();
        setAreas(
          data.map((area) => ({
            ...area,
            nombreArea: area.nombreArea.trim(),
          }))
        );
      } catch (err: any) {
        setError(err.message || "Error al obtener las áreas");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadAreas();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-y-scroll no-scrollbar">
        <motion.div
          className="h-full"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Encabezado (Header) con estilo similar al RemitenteModal */}
          <TrabajadorModalHeader isEditing={isEditing} />

          {/* Animación condicional para la parte del contenido (loading, error, form) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? "loading" : error ? "error" : "form"}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {loading ? (
                <div className="p-6 flex justify-center items-center">
                  <LoadingSpinner
                    size="lg"
                    message="Cargando áreas..."
                    color="#145A32"
                    backgroundColor="rgba(20, 90, 50, 0.2)"
                  />
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : (
                <TrabajadorModalForm
                  areas={areas}
                  trabajador={trabajador}
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
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
