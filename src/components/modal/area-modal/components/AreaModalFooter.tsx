import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Save } from "lucide-react";

interface AreaModalFooterProps {
  isEditing: boolean;
  onClose: () => void;
}

export const AreaModalFooter: React.FC<AreaModalFooterProps> = ({
  isEditing,
  onClose,
}) => {
  return (
    <DialogFooter className="pt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <Button
        type="button"
        onClick={onClose}
        className="w-full sm:w-auto bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center"
      >
        <XCircle className="w-5 h-5 mr-2" />
        Cancelar
      </Button>
      <Button
        type="submit"
        className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
      >
        <Save className="w-5 h-5 mr-2" />
        {isEditing ? "Guardar Cambios" : "Registrar"}
      </Button>
    </DialogFooter>
  );
};