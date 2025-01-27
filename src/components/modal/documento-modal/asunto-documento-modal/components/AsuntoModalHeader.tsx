import { FileText } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const AsuntoModalHeader = () => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        <FileText className="mr-2 h-6 w-6" />
        Detalle del Asunto
      </DialogTitle>
      <DialogDescription className="text-sm text-emerald-100">
        Información detallada del documento
      </DialogDescription>
    </DialogHeader>
  );
};