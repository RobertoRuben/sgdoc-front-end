import React from "react";
import { UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import { Documento } from "@/model/documento";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DatosDocumentoFormFieldsProps {
  register: UseFormRegister<Documento>;
  errors: FieldErrorsImpl<Documento>;
}

const DatosDocumentoFormFields: React.FC<DatosDocumentoFormFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del documento</Label>
          <Input
            id="nombre"
            {...register("nombre", {
              required: "Nombre del documento es requerido",
            })}
            className={`mt-1 block w-full ${
              errors.nombre
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-[#028a3b]"
            } rounded-md`}
          />
          {errors.nombre && (
            <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="folios">Número de folios</Label>
          <Input
            id="folios"
            // Si deseas que el navegador muestre solo teclado numérico en móviles, usa type="number"
            // type="number"
            {...register("folios", {
              required: "Número de folios es requerido",
              pattern: {
                value: /^\d+$/, // Solo dígitos (0-9)
                message: "Solo se permiten números",
              },
              setValueAs: (v) => parseInt(v, 10),
              validate: {
                positive: (v) =>
                  v > 0 || "El número de folios debe ser positivo",
                integer: (v) =>
                  Number.isInteger(v) ||
                  "El número de folios debe ser un entero",
              },
            })}
            className={`mt-1 block w-full ${
              errors.folios
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-[#028a3b]"
            } rounded-md`}
          />
          {errors.folios && (
            <p className="text-red-600 text-sm mt-1">{errors.folios.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="asunto">Asunto</Label>
        <Textarea
          id="asunto"
          {...register("asunto", { required: "Asunto es requerido" })}
          className={`mt-1 block w-full ${
            errors.asunto
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#028a3b]"
          } rounded-md`}
        />
        {errors.asunto && (
          <p className="text-red-600 text-sm mt-1">{errors.asunto.message}</p>
        )}
      </div>
    </>
  );
};

export default DatosDocumentoFormFields;
