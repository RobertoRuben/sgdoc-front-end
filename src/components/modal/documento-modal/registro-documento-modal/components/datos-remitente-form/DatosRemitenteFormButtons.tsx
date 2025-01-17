import React from "react";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";

interface DatosRemitenteFormButtonsProps {
  onCancel: () => void;
  isValid: boolean;
}


const DatosRemitenteFormButtons: React.FC<DatosRemitenteFormButtonsProps> = ({
  onCancel,
  isValid,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
      <Button
        type="button"
        onClick={onCancel}
        className="bg-[#d82f2f] text-white hover:bg-[#991f1f] hover:text-white w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center w-full sm:w-auto"
        disabled={!isValid}
      >
        Siguiente
        <FiArrowRight className="ml-2" />
      </Button>
    </div>
  );
};

export default DatosRemitenteFormButtons;
