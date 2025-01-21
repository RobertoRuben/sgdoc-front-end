import type React from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface DocumentoModalFormInputsProps {
  fileName: string
  setFileName: (name: string) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ActualizacionDocumentoModalFormInputs: React.FC<DocumentoModalFormInputsProps> = ({
  fileName,
  setFileName,
  handleFileChange,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormField
        control={control}
        name="nombre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoFocus
                placeholder="Ingrese el nombre del documento"
                onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
                className={`${errors.nombre ? "border-red-500" : ""}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="folios"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Folios</FormLabel>
            <FormControl>
              <Input
                min={1}
                {...field}
                placeholder="Ingrese la cantidad de folios"
                className={`${errors.folios ? "border-red-500" : ""}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="asunto"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Asunto</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Ingrese el asunto del documento"
                className={`w-full min-h-[100px] ${errors.asunto ? "border-red-500" : ""}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem className="col-span-full space-y-2">
        <FormLabel>Documento PDF</FormLabel>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={() => document.getElementById("documentoBytes")?.click()}
          >
            {fileName || "Seleccionar archivo"}
          </Button>
          {fileName && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setFileName("")
                const fileInput = document.getElementById("documentoBytes") as HTMLInputElement
                if (fileInput) fileInput.value = ""
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Input id="documentoBytes" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        {errors.documentoBytes && <p className="text-sm text-red-500">{errors.documentoBytes.message as string}</p>}
      </FormItem>
    </>
  )
}

