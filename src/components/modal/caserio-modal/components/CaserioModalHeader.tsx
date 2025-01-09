import { Edit, Plus } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CaserioModalHeaderProps {
  isEditing: boolean;
}

export const CaserioModalHeader: React.FC<CaserioModalHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        {isEditing ? (
          <Edit className="mr-2 h-6 w-6" />
        ) : (
          <Plus className="mr-2 h-6 w-6" />
        )}
        {isEditing ? "Editar Caserío" : "Registrar Caserío"}
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        {isEditing
          ? "Modifica los datos del caserío según sea necesario."
          : "Complete el formulario para registrar un nuevo caserío."}
      </DialogDescription>
    </DialogHeader>
  );
};