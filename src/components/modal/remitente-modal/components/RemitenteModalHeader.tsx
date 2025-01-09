import { UserPen, UserPlus } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface RemitenteModalHeaderProps {
  isEditing: boolean;
}

export const RemitenteModalHeader: React.FC<RemitenteModalHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        {isEditing ? (
          <UserPen className="mr-2 h-6 w-6" />
        ) : (
          <UserPlus className="mr-2 h-6 w-6" />
        )}
        {isEditing ? "Editar Remitente" : "Registrar Remitente"}
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        {isEditing
          ? "Modifica los datos del remitente en el formulario a continuación."
          : "Complete el formulario para registrar un nuevo remitente."}
      </DialogDescription>
    </DialogHeader>
  );
};