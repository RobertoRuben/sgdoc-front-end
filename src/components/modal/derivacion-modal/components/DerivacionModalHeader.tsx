import { Send } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const DerivacionModalHeader = () => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        <Send className="mr-2 h-6 w-6" />
        Derivar Documento
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        Seleccione el área a la que desea derivar el documento.
      </DialogDescription>
    </DialogHeader>
  );
};