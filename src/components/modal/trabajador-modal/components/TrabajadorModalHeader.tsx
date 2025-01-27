import { UserPen, UserPlus } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TrabajadorModalHeaderProps {
  isEditing: boolean;
}

export const TrabajadorModalHeader: React.FC<TrabajadorModalHeaderProps> = ({
  isEditing,
}) => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        {isEditing ? (
          <UserPen className="mr-2 h-6 w-6" />
        ) : (
          <UserPlus className="mr-2 h-6 w-6" />
        )}
        {isEditing ? "Editar Trabajador" : "Registrar Trabajador"}
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        {isEditing
          ? "Modifica los datos del trabajador en el formulario a continuación."
          : "Complete el formulario para registrar un nuevo trabajador."}
      </DialogDescription>
    </DialogHeader>
  );
};
