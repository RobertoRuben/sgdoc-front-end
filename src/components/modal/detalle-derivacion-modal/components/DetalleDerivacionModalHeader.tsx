import { History } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const DetalleDerivacionModalHeader = () => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        <History className="mr-2 h-6 w-6" />
        Historial de Derivación
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        Visualice el historial completo de estados y comentarios de la derivación.
      </DialogDescription>
    </DialogHeader>
  );
};