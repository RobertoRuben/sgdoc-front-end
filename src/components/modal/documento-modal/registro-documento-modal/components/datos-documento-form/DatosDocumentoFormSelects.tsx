import React, { useState, useEffect } from "react";
import { Controller, Control, FieldErrorsImpl } from "react-hook-form";
import { Documento } from "@/model/documento";
import { Ambito } from "@/model/ambito";
import { Categoria } from "@/model/categoria";
import { CentroPoblado } from "@/model/centroPoblado";
import { Caserio } from "@/model/caserio";
import { getAmbitos } from "@/service/ambitoService";
import { getCategorias } from "@/service/categoriaService";
import { getCentrosPoblados } from "@/service/centroPobladoService";
import { getCaseriosByCentroPobladoId } from "@/service/caserioService";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DatosDocumentoFormSelectsProps {
  control: Control<Documento>;
  errors: FieldErrorsImpl<Documento>;
}

const DatosDocumentoFormSelects: React.FC<DatosDocumentoFormSelectsProps> = ({
  control,
  errors,
}) => {
  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const [centrosPoblados, setCentrosPoblados] = useState<CentroPoblado[]>([]);
  const [caserios, setCaserios] = useState<Caserio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [ambitosData, centrosPobladosData, categoriasData] =
          await Promise.all([
            getAmbitos(),
            getCentrosPoblados(),
            getCategorias(),
          ]);
        setAmbitos(ambitosData);
        setCentrosPoblados(centrosPobladosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    loadInitialData();
  }, []);

  const loadCaserios = async (centroPobladoId: number) => {
    try {
      const caseriosData = await getCaseriosByCentroPobladoId(centroPobladoId);
      setCaserios(caseriosData || []);
    } catch (error) {
      console.error("Error al cargar caseríos:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Ámbito */}
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
                {/*
                  - "tabIndex={0}" ensures the ScrollArea can be focused
                    so you can use arrow keys to scroll once focused.
                  - "overflow-y-auto" and the scrollbar classes enable mouse-wheel scrolling.
                */}
                <ScrollArea
                  tabIndex={0}
                  className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 focus:outline-none"
                >
                  {ambitos.map((ambito) => (
                    <SelectItem
                      key={ambito.id}
                      value={String(ambito.id)}
                      className="hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                    >
                      {ambito.nombreAmbito}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          )}
        />
        {errors.ambitoId && (
          <p className="text-red-600 text-sm mt-1">{errors.ambitoId.message}</p>
        )}
      </div>

      {/* Categoría */}
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
                <ScrollArea
                  tabIndex={0}
                  className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 focus:outline-none"
                >
                  {categorias.map((categoria) => (
                    <SelectItem
                      key={categoria.id}
                      value={String(categoria.id)}
                      className="hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                    >
                      {categoria.nombreCategoria}
                    </SelectItem>
                  ))}
                </ScrollArea>
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
              onValueChange={(value) => {
                field.onChange(Number(value));
                loadCaserios(Number(value));
              }}
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
                <ScrollArea
                  tabIndex={0}
                  className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 focus:outline-none"
                >
                  {centrosPoblados.map((centroPoblado) => (
                    <SelectItem
                      key={centroPoblado.id}
                      value={String(centroPoblado.id)}
                      className="hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                    >
                      {centroPoblado.nombreCentroPoblado}
                    </SelectItem>
                  ))}
                </ScrollArea>
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
                <ScrollArea
                  tabIndex={0}
                  className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 focus:outline-none"
                >
                  {caserios.map((caserio) => (
                    <SelectItem
                      key={caserio.id}
                      value={String(caserio.id)}
                      className="hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                    >
                      {caserio.nombreCaserio}
                    </SelectItem>
                  ))}
                </ScrollArea>
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
    </div>
  );
};

export default DatosDocumentoFormSelects;