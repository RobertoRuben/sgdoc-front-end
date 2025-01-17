import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrorsImpl } from "react-hook-form";
import { Documento } from "@/model/documento";

interface DatosDocumentoFormFileUploadProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
  errors: FieldErrorsImpl<Documento>;
}

const DatosDocumentoFormFileUpload: React.FC<DatosDocumentoFormFileUploadProps> = ({
  handleFileChange,
  fileName,
  errors,
}) => {
  return (
    <div>
      <Label htmlFor="documentoBytes">Documento (PDF)</Label>
      <Input
        id="documentoBytes"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className={`mt-1 block w-full text-sm sm:text-base rounded-md ${
          errors.documentoBytes
            ? "border-red-500 focus:ring-red-500"
            : "focus:ring-[#028a3b]"
        }`}
      />
      {fileName && (
        <p className="text-sm text-gray-600 mt-1">Archivo seleccionado: {fileName}</p>
      )}
      {errors.documentoBytes && (
        <p className="text-red-600 text-sm mt-1">{errors.documentoBytes.message}</p>
      )}
    </div>
  );
};

export default DatosDocumentoFormFileUpload;
