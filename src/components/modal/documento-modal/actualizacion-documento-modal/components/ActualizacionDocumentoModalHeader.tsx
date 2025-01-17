import { Edit } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const ActualizacionDocumentoModalHeader = () => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        <Edit className="mr-2 h-6 w-6" />
        Actualizar Documento
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        Modifique los datos del documento según sea necesario.
      </DialogDescription>
    </DialogHeader>
  );
};