import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RemitenteHeaderProps {
  onAddClick: () => void;
}

export const RemitenteHeader: React.FC<RemitenteHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
        Remitentes
      </h2>
      <Button
        onClick={onAddClick}
        className="w-full sm:w-auto px-4 py-2 bg-[#145A32] text-white rounded hover:bg-[#0E3D22] transition-colors duration-200 flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Agregar Remitente
      </Button>
    </div>
  );
};