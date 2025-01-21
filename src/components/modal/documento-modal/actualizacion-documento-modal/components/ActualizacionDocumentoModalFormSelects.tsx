import type React from "react"
import { useFormContext } from "react-hook-form"
import { SearchSelect } from "@/components/ui/search-select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Ambito } from "@/model/ambito"
import type { CentroPoblado } from "@/model/centroPoblado"
import type { Caserio } from "@/model/caserio"
import type { Categoria } from "@/model/categoria"

interface DocumentoModalFormSelectsProps {
  ambitos: Ambito[]
  categorias: Categoria[]
  centrosPoblados: CentroPoblado[]
  caserios: Caserio[]
  handleWheel: (event: React.WheelEvent<HTMLDivElement>) => void
  handleLetterKeyPress: (items: HTMLElement[], key: string) => void
}

export const ActualizacionDocumentoModalFormSelects: React.FC<DocumentoModalFormSelectsProps> = ({
  ambitos,
  categorias,
  centrosPoblados,
  caserios,
}) => {
  const {
    control,
  } = useFormContext()

  return (
    <>
      <FormField
        control={control}
        name="ambitoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ámbito</FormLabel>
            <FormControl>
              <SearchSelect<number>
                inputId="ambito"
                options={ambitos.filter(ambito => ambito.id != null).map((ambito) => ({
                  value: ambito.id as number,
                  label: ambito.nombreAmbito,
                }))}
                value={ambitos
                  .filter(ambito => ambito.id != null)
                  .map((ambito) => ({
                    value: ambito.id as number,
                    label: ambito.nombreAmbito,
                  }))
                  .find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={false}
                placeholder="Seleccione un ámbito"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="categoriaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoría</FormLabel>
            <FormControl>
              <SearchSelect<number>
                inputId="categoria"
                options={categorias.filter(categoria => categoria.id != null).map((categoria) => ({
                  value: categoria.id as number,
                  label: categoria.nombreCategoria,
                }))}
                value={categorias
                  .filter(categoria => categoria.id != null)
                  .map((categoria) => ({
                    value: categoria.id as number,
                    label: categoria.nombreCategoria,
                  }))
                  .find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={false}
                placeholder="Seleccione una categoría"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="centroPobladoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Centro Poblado</FormLabel>
            <FormControl>
              <SearchSelect<number>
                inputId="centroPoblado"
                options={centrosPoblados.filter(centroPoblado => centroPoblado.id != null).map((centroPoblado) => ({
                  value: centroPoblado.id as number,
                  label: centroPoblado.nombreCentroPoblado,
                }))}
                value={centrosPoblados
                  .filter((centroPoblado): centroPoblado is CentroPoblado & { id: number } => 
                    centroPoblado.id != null
                  )
                  .map((centroPoblado) => ({
                    value: centroPoblado.id,
                    label: centroPoblado.nombreCentroPoblado,
                  }))
                  .find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={false}
                placeholder="Seleccione un centro poblado"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="caserioId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Caserío</FormLabel>
            <FormControl>
              <SearchSelect<number>
                inputId="caserio"
                options={caserios.filter(caserio => caserio.id != null).map((caserio) => ({
                  value: caserio.id as number,
                  label: caserio.nombreCaserio,
                }))}
                value={caserios
                  .filter(caserio => caserio.id != null)
                  .map((caserio) => ({
                    value: caserio.id as number,
                    label: caserio.nombreCaserio,
                  }))
                  .find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={false}
                placeholder="Seleccione un caserío"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

