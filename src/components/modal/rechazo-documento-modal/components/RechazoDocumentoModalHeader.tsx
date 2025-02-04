import { XCircle } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const RechazoDocumentoModalHeader = () => {
  return (
    <DialogHeader className="bg-gradient-to-l from-[#d82f2f] via-[#991f1f] to-black text-white p-6 rounded-t-lg shadow-md">
      <DialogTitle className="text-2xl font-bold flex items-center">
        <XCircle className="mr-2 h-6 w-6" />
        Rechazar Documento
      </DialogTitle>
      <DialogDescription className="text-sm text-red-100">
        Por favor, indique el motivo por el cual se rechaza el documento.
      </DialogDescription>
    </DialogHeader>
  );
};