import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UsuarioModalHeader } from "./components/UsuarioModalHeader";
import { UsuarioModalForm } from "./components/UsuarioModalForm";
import { Usuario } from "@/model/usuario";
import { getRoles } from "@/service/rolService";
import { getTrabajadoresNames } from "@/service/trabajadorService";
import { Rol } from "@/model/rol";
import {Trabajador} from "@/model/trabajador";
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

interface RegistroUsuarioModalProps {
  isOpen: boolean;
  usuario?: Usuario;
  onClose: () => void;
  onSubmit: (data: Usuario) => Promise<void>;
}

export function RegistroUsuarioModal({
  isOpen,
  usuario,
  onClose,
  onSubmit,
}: RegistroUsuarioModalProps) {
  const isEditing = !!(usuario?.id && usuario.id > 0);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!isOpen) return;

    try {
      setLoading(true);
      const [rolesResult, workersResult] = await Promise.all([
        getRoles(),
        getTrabajadoresNames(),
      ]);
      setRoles(rolesResult);
      setTrabajadores(workersResult);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar los datos necesarios";
      setError(errorMessage);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  const handleSubmit = async (data: Usuario) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

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
          <UsuarioModalHeader isEditing={isEditing} />

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
                    message="Cargando datos..."
                    color="#145A32"
                    backgroundColor="rgba(20, 90, 50, 0.2)"
                  />
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : (
                <UsuarioModalForm
                  usuario={usuario}
                  isEditing={isEditing}
                  onClose={onClose}
                  onSubmit={handleSubmit}
                  roles={roles}
                  trabajadores={trabajadores}
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
