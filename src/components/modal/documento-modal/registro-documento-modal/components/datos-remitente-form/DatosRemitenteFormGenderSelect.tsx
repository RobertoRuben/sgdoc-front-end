import React from "react";
import { Controller, Control, FieldErrorsImpl } from "react-hook-form";
import { Remitente } from "@/model/remitente";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DatosRemitenteFormGenderSelectProps {
  control: Control<Remitente>;
  errors: FieldErrorsImpl<Remitente>;
}


const DatosRemitenteFormGenderSelect: React.FC<DatosRemitenteFormGenderSelectProps> = ({
  control,
  errors,
}) => {
  return (
    <div>
      <Label htmlFor="genero">Género</Label>
      <Controller
        name="genero"
        control={control}
        rules={{ required: "Género es requerido" }}
        render={({ field }) => (
          <Select
            value={field.value || ""}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              id="genero"
              className={`mt-1 flex items-center justify-between w-full ${
                errors.genero
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-[#028a3b]"
              } rounded-md`}
            >
              <SelectValue placeholder="Seleccione un género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Femenino">Femenino</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {errors.genero && (
        <p className="text-red-600 text-sm mt-1">{errors.genero.message}</p>
      )}
    </div>
  );
};

export default DatosRemitenteFormGenderSelect;
