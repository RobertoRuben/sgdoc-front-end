import { Save, XCircle } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

interface UsuarioModalFooterProps {
  isEditing: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const UsuarioModalFooter: React.FC<UsuarioModalFooterProps> = ({
  isEditing,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <DialogFooter className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-4">
      <Button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="w-full sm:w-auto bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center"
      >
        <XCircle className="w-5 h-5 mr-2" />
        Cancelar
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" color="#ffffff" className="mr-2" />
        ) : (
          <Save className="w-5 h-5 mr-2" />
        )}
        {isEditing ? "Guardar Cambios" : "Registrar"}
      </Button>
    </DialogFooter>
  );
};
