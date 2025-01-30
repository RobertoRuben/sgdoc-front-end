import { CheckCircle2 } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ConfirmacionRecepcionModalHeader = () => {
  return (
    <DialogHeader className="bg-gradient-to-l from-emerald-600 via-emerald-700 to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        <CheckCircle2 className="mr-2 h-6 w-6" />
        Confirmar Recepción
      </DialogTitle>
    </DialogHeader>
  );
};