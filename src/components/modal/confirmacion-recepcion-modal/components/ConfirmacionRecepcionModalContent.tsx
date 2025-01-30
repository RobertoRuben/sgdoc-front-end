import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

interface ConfirmacionRecepcionModalContentProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmacionRecepcionModalContent: React.FC<ConfirmacionRecepcionModalContentProps> = ({
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error al confirmar recepción:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-6">
        <p className="text-center text-gray-700 text-lg">
          ¿Estás seguro de que deseas confirmar la recepción del documento?
        </p>
      </div>
      
      <DialogFooter className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-gray-500 text-white hover:bg-gray-600 flex items-center justify-center"
        >
          <XCircle className="w-5 h-5 mr-2" />
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
        >
          {isSubmitting ? (
            <LoadingSpinner size="sm" color="#ffffff" className="mr-2" />
          ) : (
            <CheckCircle2 className="w-5 h-5 mr-2" />
          )}
          Confirmar Recepción
        </Button>
      </DialogFooter>
    </div>
  );
};