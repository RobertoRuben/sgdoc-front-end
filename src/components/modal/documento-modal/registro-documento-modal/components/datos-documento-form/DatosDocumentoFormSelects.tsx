import type React from "react";
import { useState, useEffect } from "react";
import { Controller, Control, FieldErrorsImpl } from "react-hook-form";
import { Documento } from "@/model/documento";
import { CaserioSimpleResponse } from "@/model/caserioSimpleResponse";
import { Ambito } from "@/model/ambito";
import { Categoria } from "@/model/categoria";
import { CentroPoblado } from "@/model/centroPoblado";
import { getAmbitos } from "@/service/ambitoService";
import { getCategorias } from "@/service/categoriaService";
import { getCentrosPoblados } from "@/service/centroPobladoService";
import {
  getCaseriosByCentroPobladoId, getAllCaserios
} from "@/service/caserioService";
import { Label } from "@/components/ui/label";
import { SearchSelect } from "@/components/ui/search-select";

interface DatosDocumentoFormSelectsProps {
  control: Control<Documento>;
  errors: FieldErrorsImpl<Documento>;
}

const DatosDocumentoFormSelects: React.FC<DatosDocumentoFormSelectsProps> = ({
  control,
  errors
}) => {
  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const [centrosPoblados, setCentrosPoblados] = useState<CentroPoblado[]>([]);
  const [allCaserios, setAllCaserios] = useState<CaserioSimpleResponse[]>([]);
  const [caserios, setCaserios] = useState<CaserioSimpleResponse[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [ambitosData, centrosPobladosData, categoriasData, caseriosData] =
          await Promise.all([
            getAmbitos(),
            getCentrosPoblados(),
            getCategorias(),
            getAllCaserios()     
          ]);

        setAmbitos(ambitosData);
        setCentrosPoblados(centrosPobladosData);
        setCategorias(categoriasData);

        setAllCaserios(caseriosData);
        setCaserios(caseriosData);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    loadInitialData();
  }, []);

  const loadCaseriosByCentroPoblado = async (centroPobladoId: number) => {
    try {
      if (!centroPobladoId) {
        setCaserios(allCaserios);
        return;
      }

      const caseriosData = await getCaseriosByCentroPobladoId(centroPobladoId);
      const caseriosSimple = (caseriosData || []).filter(c => c.id !== undefined).map(c => ({
        id: c.id as number,
        nombreCaserio: c.nombreCaserio
      }));
      setCaserios(caseriosSimple);
    } catch (error) {
      console.error("Error al cargar caseríos por centro poblado:", error);
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
            min: { value: 1, message: "Debe seleccionar un ámbito" }
          }}
          render={({ field }) => (
            <>
              <SearchSelect<number>
                inputId="ambitoId"
                options={ambitos
                  .filter(ambito => ambito.id !== undefined)
                  .map(ambito => ({
                    value: ambito.id as number,
                    label: ambito.nombreAmbito
                  }))}
                value={ambitos
                  .filter(ambito => ambito.id !== undefined)
                  .map(ambito => ({
                    value: ambito.id as number,
                    label: ambito.nombreAmbito
                  }))
                  .find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
                isDisabled={false}
                placeholder="Seleccione un ámbito"
              />
              {errors.ambitoId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.ambitoId.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Categoría */}
      <div>
        <Label htmlFor="categoriaId">Categoría</Label>
        <Controller
          name="categoriaId"
          control={control}
          rules={{
            required: "Categoría es requerida",
            min: { value: 1, message: "Debe seleccionar una categoría" }
          }}
          render={({ field }) => (
            <>
              <SearchSelect<number>
                inputId="categoriaId"
                options={categorias
                  .filter(categoria => categoria.id !== undefined)
                  .map(categoria => ({
                    value: categoria.id as number,
                    label: categoria.nombreCategoria
                  }))}
                value={categorias
                  .filter(categoria => categoria.id !== undefined)
                  .map(categoria => ({
                    value: categoria.id as number,
                    label: categoria.nombreCategoria
                  }))
                  .find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
                isDisabled={false}
                placeholder="Seleccione una categoría"
              />
              {errors.categoriaId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.categoriaId.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Centro Poblado */}
      <div>
        <Label htmlFor="centroPobladoId">Centro Poblado</Label>
        <Controller
          name="centroPobladoId"
          control={control}
          rules={{
            required: "Centro Poblado es requerido",
            min: { value: 1, message: "Debe seleccionar un centro poblado" }
          }}
          render={({ field }) => (
            <>
              <SearchSelect<number>
                inputId="centroPobladoId"
                options={centrosPoblados
                  .filter(centro => centro.id !== undefined)
                  .map(centro => ({
                    value: centro.id as number,
                    label: centro.nombreCentroPoblado
                  }))}
                value={centrosPoblados
                  .filter(centro => centro.id !== undefined)
                  .map(centro => ({
                    value: centro.id as number,
                    label: centro.nombreCentroPoblado
                  }))
                  .find(option => option.value === field.value)}
                onChange={option => {
                  field.onChange(option?.value);
                  // Cada vez que cambia el centro poblado, cargamos
                  // los caseríos correspondientes
                  if (option?.value) {
                    loadCaseriosByCentroPoblado(option.value);
                  } else {
                    // si limpian la selección o valor es 0, volvemos a los "allCaserios"
                    loadCaseriosByCentroPoblado(0);
                  }
                }}
                isDisabled={false}
                placeholder="Seleccione un centro poblado"
              />
              {errors.centroPobladoId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.centroPobladoId.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Caserío */}
      <div>
        <Label htmlFor="caserioId">Caserío</Label>
        <Controller
          name="caserioId"
          control={control}
          rules={{
            required: "Caserío es requerido",
            min: { value: 1, message: "Debe seleccionar un caserío" }
          }}
          render={({ field }) => (
            <>
              <SearchSelect<number>
                inputId="caserioId"
                options={caserios
                  .filter(caserio => caserio.id !== undefined)
                  .map(caserio => ({
                    value: caserio.id as number,
                    label: caserio.nombreCaserio
                  }))}
                value={caserios
                  .filter(caserio => caserio.id !== undefined)
                  .map(caserio => ({
                    value: caserio.id as number,
                    label: caserio.nombreCaserio
                  }))
                  .find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
                isDisabled={false}
                placeholder="Seleccione un caserío"
              />
              {errors.caserioId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.caserioId.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default DatosDocumentoFormSelects;
