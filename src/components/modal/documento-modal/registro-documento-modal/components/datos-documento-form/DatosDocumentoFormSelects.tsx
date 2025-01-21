import type React from "react"
import { useState, useEffect } from "react"
import { Controller, type Control, type FieldErrorsImpl } from "react-hook-form"
import type { Documento } from "@/model/documento"
import type { Ambito } from "@/model/ambito"
import type { Categoria } from "@/model/categoria"
import type { CentroPoblado } from "@/model/centroPoblado"
import type { Caserio } from "@/model/caserio"
import { getAmbitos } from "@/service/ambitoService"
import { getCategorias } from "@/service/categoriaService"
import { getCentrosPoblados } from "@/service/centroPobladoService"
import { getCaseriosByCentroPobladoId } from "@/service/caserioService"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem, SelectGroup } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

const scrollAreaStyle = { overscrollBehavior: "contain" }

interface DatosDocumentoFormSelectsProps {
  control: Control<Documento>
  errors: FieldErrorsImpl<Documento>
}

const DatosDocumentoFormSelects: React.FC<DatosDocumentoFormSelectsProps> = ({ control, errors }) => {
  const [ambitos, setAmbitos] = useState<Ambito[]>([])
  const [centrosPoblados, setCentrosPoblados] = useState<CentroPoblado[]>([])
  const [caserios, setCaserios] = useState<Caserio[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [ambitosData, centrosPobladosData, categoriasData] = await Promise.all([
          getAmbitos(),
          getCentrosPoblados(),
          getCategorias(),
        ])
        setAmbitos(ambitosData)
        setCentrosPoblados(centrosPobladosData)
        setCategorias(categoriasData)
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
      }
    }
    loadInitialData()
  }, [])

  const loadCaserios = async (centroPobladoId: number) => {
    try {
      const caseriosData = await getCaseriosByCentroPobladoId(centroPobladoId)
      setCaserios(caseriosData || [])
    } catch (error) {
      console.error("Error al cargar caseríos:", error)
    }
  }

  const handleLetterKeyPress = (items: HTMLElement[], key: string) => {
    const matchingItem = items.find((item) => item.textContent?.toLowerCase().startsWith(key.toLowerCase()))
    if (matchingItem) {
      matchingItem.scrollIntoView({ behavior: "smooth", block: "nearest" })
      matchingItem.focus()
    }
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const scrollArea = event.currentTarget.closest(".scroll-area") as HTMLElement
    if (scrollArea) {
      scrollArea.scrollTop += event.deltaY
      event.preventDefault()
    }
  }

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
                  errors.ambitoId ? "border-red-500 focus:ring-red-500" : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
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
          )}
        />
        {errors.ambitoId && <p className="text-red-600 text-sm mt-1">{errors.ambitoId.message}</p>}
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
                  errors.categoriaId ? "border-red-500 focus:ring-red-500" : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
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
          )}
        />
        {errors.categoriaId && <p className="text-red-600 text-sm mt-1">{errors.categoriaId.message}</p>}
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
                field.onChange(Number(value))
                loadCaserios(Number(value))
              }}
              value={String(field.value || "")}
            >
              <SelectTrigger
                id="centroPobladoId"
                className={`mt-1 flex items-center justify-between w-full ${
                  errors.centroPobladoId ? "border-red-500 focus:ring-red-500" : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
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
          )}
        />
        {errors.centroPobladoId && <p className="text-red-600 text-sm mt-1">{errors.centroPobladoId.message}</p>}
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
                  errors.caserioId ? "border-red-500 focus:ring-red-500" : "focus:ring-[#028a3b]"
                } rounded-md`}
              >
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
          )}
        />
        {errors.caserioId && <p className="text-red-600 text-sm mt-1">{errors.caserioId.message}</p>}
      </div>
    </div>
  )
}

export default DatosDocumentoFormSelects

