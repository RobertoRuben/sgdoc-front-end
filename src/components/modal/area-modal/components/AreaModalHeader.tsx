import { Edit, Plus } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AreaModalHeaderProps {
  isEditing: boolean;
}

export const AreaModalHeader: React.FC<AreaModalHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        {isEditing ? (
          <Edit className="mr-2 h-6 w-6" />
        ) : (
          <Plus className="mr-2 h-6 w-6" />
        )}
        {isEditing ? "Editar Área" : "Registrar Área"}
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        {isEditing
          ? "Modifica los datos del área en el formulario a continuación."
          : "Complete el formulario para registrar una nueva área."}
      </DialogDescription>
    </DialogHeader>
  );
};