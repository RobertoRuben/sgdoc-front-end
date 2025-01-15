import React from "react";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiSave } from "react-icons/fi";

interface DatosDocumentoFormButtonsProps {
  onPrevious: () => void;
  onCancel: () => void;
  isFormValid: boolean;
}

const DatosDocumentoFormButtons: React.FC<DatosDocumentoFormButtonsProps> = ({
  onPrevious,
  onCancel,
  isFormValid,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
      <Button
        type="button"
        onClick={onPrevious}
        variant="outline"
        className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 flex items-center justify-center"
      >
        <FiArrowLeft className="mr-2" />
        Anterior
      </Button>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
          disabled={!isFormValid}
        >
          <FiSave className="mr-2" />
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default DatosDocumentoFormButtons;
