import { Edit, Plus } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ComunicacionAreaModalHeaderProps {
  isEditing: boolean;
}

export const ComunicacionAreaModalHeader: React.FC<ComunicacionAreaModalHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        {isEditing ? (
          <Edit className="mr-2 h-6 w-6" />
        ) : (
          <Plus className="mr-2 h-6 w-6" />
        )}
        {isEditing ? "Editar Comunicación de Áreas" : "Registrar Comunicación de Áreas"}
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        {isEditing
          ? "Modifica la comunicación entre áreas según sea necesario."
          : "Seleccione las áreas para establecer la comunicación entre ellas."}
      </DialogDescription>
    </DialogHeader>
  );
};