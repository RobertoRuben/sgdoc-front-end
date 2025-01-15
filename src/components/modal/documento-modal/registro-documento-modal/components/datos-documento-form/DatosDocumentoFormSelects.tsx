import React from "react";
import { Controller, Control, FieldErrorsImpl } from "react-hook-form";
import { Documento } from "@/model/documento";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DatosDocumentoFormSelectsProps {
  control: Control<Documento>;
  errors: FieldErrorsImpl<Documento>;
}

const DatosDocumentoFormSelects: React.FC<DatosDocumentoFormSelectsProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="ambitoId">Ámbito</Label>
        <Controller
          name="ambitoId"
          control={control}
          rules={{
            required: "Ámbito es requerido",
            min: { value: 1, message: "Debe seleccionar un ámbito" },
          }}
          render={({ field }) => (
            <Select
              name="ambitoId"
              onValueChange={(value) => field.onChange(Number(value))}
              value={String(field.value || "")}
            >
              <SelectTrigger
                id="ambitoId"
                className={`mt-1 flex items-center justify-between w-full ${
                  errors.ambitoId
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
                <SelectValue placeholder="Seleccione un ámbito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ámbito 1</SelectItem>
                <SelectItem value="2">Ámbito 2</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.ambitoId && (
          <p className="text-red-600 text-sm mt-1">
            {errors.ambitoId.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="categoriaId">Categoría</Label>
        <Controller
          name="categoriaId"
          control={control}
          rules={{
            required: "Categoría es requerida",
            min: { value: 1, message: "Debe seleccionar una categoría" },
          }}
          render={({ field }) => (
            <Select
              name="categoriaId"
              onValueChange={(value) => field.onChange(Number(value))}
              value={String(field.value || "")}
            >
              <SelectTrigger
                id="categoriaId"
                className={`mt-1 flex items-center justify-between w-full ${
                  errors.categoriaId
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Categoría 1</SelectItem>
                <SelectItem value="2">Categoría 2</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoriaId && (
          <p className="text-red-600 text-sm mt-1">
            {errors.categoriaId.message}
          </p>
        )}
      </div>

      {/* Caserío */}
      <div>
        <Label htmlFor="caserioId">Caserío</Label>
        <Controller
          name="caserioId"
          control={control}
          rules={{
            required: "Caserío es requerido",
            min: { value: 1, message: "Debe seleccionar un caserío" },
          }}
          render={({ field }) => (
            <Select
              name="caserioId"
              onValueChange={(value) => field.onChange(Number(value))}
              value={String(field.value || "")}
            >
              <SelectTrigger
                id="caserioId"
                className={`mt-1 flex items-center justify-between w-full ${
                  errors.caserioId
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
                <SelectValue placeholder="Seleccione un caserío" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Caserío 1</SelectItem>
                <SelectItem value="2">Caserío 2</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.caserioId && (
          <p className="text-red-600 text-sm mt-1">
            {errors.caserioId.message}
          </p>
        )}
      </div>

      {/* Centro Poblado */}
      <div>
        <Label htmlFor="centroPobladoId">Centro Poblado</Label>
        <Controller
          name="centroPobladoId"
          control={control}
          rules={{
            required: "Centro Poblado es requerido",
            min: { value: 1, message: "Debe seleccionar un centro poblado" },
          }}
          render={({ field }) => (
            <Select
              name="centroPobladoId"
              onValueChange={(value) => field.onChange(Number(value))}
              value={String(field.value || "")}
            >
              <SelectTrigger
                id="centroPobladoId"
                className={`mt-1 flex items-center justify-between w-full ${
                  errors.centroPobladoId
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
                <SelectValue placeholder="Seleccione un centro poblado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Centro Poblado 1</SelectItem>
                <SelectItem value="2">Centro Poblado 2</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.centroPobladoId && (
          <p className="text-red-600 text-sm mt-1">
            {errors.centroPobladoId.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DatosDocumentoFormSelects;
