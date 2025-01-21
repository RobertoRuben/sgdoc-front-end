import type React from "react"
import { useFormContext } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  handleWheel,
  handleLetterKeyPress,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const scrollAreaStyle = { overscrollBehavior: "contain" }

  return (
    <>
      <FormField
        control={control}
        name="ambitoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ámbito</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value || "")}>
                <SelectTrigger className={`w-full ${errors.ambitoId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccione un ámbito" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-[200px] scroll-area" onWheel={handleWheel} style={scrollAreaStyle}>
                    <SelectGroup
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                          const items = Array.from(e.currentTarget.children)
                          handleLetterKeyPress(items as HTMLElement[], e.key)
                        }
                      }}
                    >
                      {ambitos.map((ambito) => (
                        <SelectItem
                          key={ambito.id}
                          value={String(ambito.id)}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                              e.preventDefault()
                              const items = Array.from(e.currentTarget.parentElement?.children || [])
                              const currentIndex = items.indexOf(e.currentTarget)
                              const nextIndex =
                                e.key === "ArrowDown"
                                  ? (currentIndex + 1) % items.length
                                  : (currentIndex - 1 + items.length) % items.length
                              ;(items[nextIndex] as HTMLElement).focus()
                            }
                          }}
                        >
                          {ambito.nombreAmbito}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
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
              <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value || "")}>
                <SelectTrigger className={`w-full ${errors.categoriaId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-[200px] scroll-area" onWheel={handleWheel} style={scrollAreaStyle}>
                    <SelectGroup
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                          const items = Array.from(e.currentTarget.children)
                          handleLetterKeyPress(items as HTMLElement[], e.key)
                        }
                      }}
                    >
                      {categorias.map((categoria) => (
                        <SelectItem
                          key={categoria.id}
                          value={String(categoria.id)}
                          className="hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                              e.preventDefault()
                              const items = Array.from(e.currentTarget.parentElement?.children || [])
                              const currentIndex = items.indexOf(e.currentTarget)
                              const nextIndex =
                                e.key === "ArrowDown"
                                  ? (currentIndex + 1) % items.length
                                  : (currentIndex - 1 + items.length) % items.length
                              ;(items[nextIndex] as HTMLElement).focus()
                            }
                          }}
                        >
                          {categoria.nombreCategoria}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
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
              <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value || "")}>
                <SelectTrigger className={`w-full ${errors.centroPobladoId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccione un centro poblado" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-[200px] scroll-area" onWheel={handleWheel} style={scrollAreaStyle}>
                    <SelectGroup
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                          const items = Array.from(e.currentTarget.children)
                          handleLetterKeyPress(items as HTMLElement[], e.key)
                        }
                      }}
                    >
                      {centrosPoblados.map((centroPoblado) => (
                        <SelectItem
                          key={centroPoblado.id}
                          value={String(centroPoblado.id)}
                          className="hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                              e.preventDefault()
                              const items = Array.from(e.currentTarget.parentElement?.children || [])
                              const currentIndex = items.indexOf(e.currentTarget)
                              const nextIndex =
                                e.key === "ArrowDown"
                                  ? (currentIndex + 1) % items.length
                                  : (currentIndex - 1 + items.length) % items.length
                              ;(items[nextIndex] as HTMLElement).focus()
                            }
                          }}
                        >
                          {centroPoblado.nombreCentroPoblado}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
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
              <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value || "")}>
                <SelectTrigger className={`w-full ${errors.caserioId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccione un caserío" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-[200px] scroll-area" onWheel={handleWheel} style={scrollAreaStyle}>
                    <SelectGroup
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                          const items = Array.from(e.currentTarget.children)
                          handleLetterKeyPress(items as HTMLElement[], e.key)
                        }
                      }}
                    >
                      {caserios.map((caserio) => (
                        <SelectItem
                          key={caserio.id}
                          value={String(caserio.id)}
                          className="hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                              e.preventDefault()
                              const items = Array.from(e.currentTarget.parentElement?.children || [])
                              const currentIndex = items.indexOf(e.currentTarget)
                              const nextIndex =
                                e.key === "ArrowDown"
                                  ? (currentIndex + 1) % items.length
                                  : (currentIndex - 1 + items.length) % items.length
                              ;(items[nextIndex] as HTMLElement).focus()
                            }
                          }}
                        >
                          {caserio.nombreCaserio}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

