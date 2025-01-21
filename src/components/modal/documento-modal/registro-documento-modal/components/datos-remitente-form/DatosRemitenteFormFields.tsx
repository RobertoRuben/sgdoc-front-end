import React from "react";
import { UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import { Remitente } from "@/model/remitente";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatosRemitenteFormFieldsProps {
  register: UseFormRegister<Remitente>;
  errors: FieldErrorsImpl<Remitente>;
}

const DatosRemitenteFormFields: React.FC<DatosRemitenteFormFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="dni">DNI</Label>
        <Input
          id="dni"
          {...register("dni", {
            required: "DNI es requerido",
            pattern: {
              value: /^\d+$/, 
              message: "DNI no debe contener letras",
            },
            setValueAs: (v: string) => parseInt(v, 10),
            validate: {
              positive: (v: number) => v > 0 || "DNI debe ser positivo",
              eightDigits: (v: number) =>
                (v >= 10000000 && v <= 99999999) || "DNI debe tener 8 dígitos",
            },
          })}
          className={`mt-1 block w-full no-spin ${
            errors.dni
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#028a3b]"
          } rounded-md`}
        />
        {errors.dni && (
          <p className="text-red-600 text-sm mt-1">{errors.dni.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="nombres">Nombres</Label>
        <Input
          id="nombres"
          {...register("nombres", {
            required: "Nombres son requeridos",
            minLength: {
              value: 4,
              message: "Nombres deben tener al menos 4 caracteres",
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Nombres deben contener solo letras y espacios",
            },
          })}
          className={`mt-1 block w-full ${
            errors.nombres
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#028a3b]"
          } rounded-md`}
        />
        {errors.nombres && (
          <p className="text-red-600 text-sm mt-1">{errors.nombres.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
        <Input
          id="apellidoPaterno"
          {...register("apellidoPaterno", {
            required: "Apellido paterno es requerido",
            minLength: {
              value: 4,
              message: "Apellido paterno debe tener al menos 4 caracteres",
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Apellido paterno debe contener solo letras y espacios",
            },
          })}
          className={`mt-1 block w-full ${
            errors.apellidoPaterno
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#028a3b]"
          } rounded-md`}
        />
        {errors.apellidoPaterno && (
          <p className="text-red-600 text-sm mt-1">
            {errors.apellidoPaterno.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
        <Input
          id="apellidoMaterno"
          {...register("apellidoMaterno", {
            required: "Apellido materno es requerido",
            minLength: {
              value: 4,
              message: "Apellido materno debe tener al menos 4 caracteres",
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Apellido materno debe contener solo letras y espacios",
            },
          })}
          className={`mt-1 block w-full ${
            errors.apellidoMaterno
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#028a3b]"
          } rounded-md`}
        />
        {errors.apellidoMaterno && (
          <p className="text-red-600 text-sm mt-1">
            {errors.apellidoMaterno.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DatosRemitenteFormFields;
