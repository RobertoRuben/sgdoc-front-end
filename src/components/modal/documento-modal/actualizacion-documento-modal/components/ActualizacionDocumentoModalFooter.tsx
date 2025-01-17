import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

interface ActualizacionDocumentoModalFooterProps {
  onClose: () => void;
  isSubmitting?: boolean;
}

export const ActualizacionDocumentoModalFooter: React.FC<ActualizacionDocumentoModalFooterProps> = ({
  onClose,
  isSubmitting,
}) => {
  return (
    <DialogFooter className="p-6 bg-gray-50 flex justify-end space-x-4">
      <Button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center"
      >
        <X className="w-5 h-5 mr-2" />
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
      >
        {isSubmitting ? (
          <LoadingSpinner size="sm" color="#ffffff" className="mr-2" />
        ) : (
          <Save className="w-5 h-5 mr-2" />
        )}
        Guardar Cambios
      </Button>
    </DialogFooter>
  );
};
