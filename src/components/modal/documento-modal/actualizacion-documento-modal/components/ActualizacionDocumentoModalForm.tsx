import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Documento } from "@/model/documento";
import { Ambito } from "@/model/ambito";
import { CentroPoblado } from "@/model/centroPoblado";
import { Caserio } from "@/model/caserio";
import { Categoria } from "@/model/categoria";
import { ActualizacionDocumentoModalFooter } from "./ActualizacionDocumentoModalFooter";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAmbitos } from "@/service/ambitoService";
import { getCategorias } from "@/service/categoriaService";
import { getCentrosPoblados } from "@/service/centroPobladoService";
import { getAllCaserios } from "@/service/caserioService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

const formSchema = z.object({
  id: z.number().optional(),
  documentoBytes: z
    .preprocess((val) => {
      if (!val) return null;
      if (val instanceof FileList) {
        return val.item(0);
      }
      return val;
    }, z.union([z.instanceof(File), z.null()])),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  folios: z.number().min(1, "Debe tener al menos 1 folio"),
  asunto: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  ambitoId: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(1, "Seleccione un ámbito")
  ),
  categoriaId: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(1, "Seleccione una categoría")
  ),
  caserioId: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(1, "Seleccione un caserío")
  ),
  centroPobladoId: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(1, "Seleccione un centro poblado")
  ),
});

interface ActualizacionDocumentoModalFormProps {
  documento?: Documento;
  onClose: () => void;
  onSubmit: (data: Documento) => Promise<void>;
}

export const ActualizacionDocumentoModalForm: React.FC<
  ActualizacionDocumentoModalFormProps
> = ({ documento, onClose, onSubmit }) => {
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const [centrosPoblados, setCentrosPoblados] = useState<CentroPoblado[]>([]);
  const [caserios, setCaserios] = useState<Caserio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [catalogsLoaded, setCatalogsLoaded] = useState(false);

  const form = useForm<Documento>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: documento?.id,
      documentoBytes: null,
      nombre: documento?.nombre || "",
      folios: documento?.folios || 1,
      asunto: documento?.asunto || "",
      ambitoId: documento?.ambitoId || 0,
      categoriaId: documento?.categoriaId || 0,
      caserioId: documento?.caserioId || 0,
      centroPobladoId: documento?.centroPobladoId || 0,
      remitenteId: documento?.remitenteId,
    },
  });
  const { handleSubmit, formState: { errors }, reset, control } = form;

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [ambitosData, centrosPobladosData, categoriasData, caseriosData] =
          await Promise.all([
            getAmbitos(),
            getCentrosPoblados(),
            getCategorias(),
            getAllCaserios(),
          ]);
        setAmbitos(ambitosData);
        setCentrosPoblados(centrosPobladosData);
        setCategorias(categoriasData);
        setCaserios(caseriosData);
        setCatalogsLoaded(true);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      }
    };
    loadCatalogs();
  }, []);

  useEffect(() => {
    if (documento) {
      reset({
        id: documento.id,
        documentoBytes: documento.documentoBytes,
        nombre: documento.nombre,
        folios: documento.folios,
        asunto: documento.asunto,
        ambitoId: documento.ambitoId,
        categoriaId: documento.categoriaId,
        caserioId: documento.caserioId,
        centroPobladoId: documento.centroPobladoId,
      });
      if (documento.documentoBytes instanceof File) {
        setFile(documento.documentoBytes);
        setFileName("Archivo actual");
      }
    }
  }, [documento, reset]);

  const handleFormSubmit: SubmitHandler<Documento> = async (values) => {
    setIsSubmitting(true);
    try {
      const documentoRequest: Partial<Documento> = {
        id: values.id,
        nombre: values.nombre,
        folios: values.folios,
        asunto: values.asunto,
        ambitoId: values.ambitoId,
        categoriaId: values.categoriaId,
        caserioId: values.caserioId,
        centroPobladoId: values.centroPobladoId,
        documentoBytes: file,
      };
      await onSubmit(documentoRequest as Documento);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("El archivo excede el tamaño máximo permitido de 5MB.");
        setFile(null);
        setFileName("");
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
      }
    }
  };

  if (!catalogsLoaded) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <LoadingSpinner size="lg" color="#145A32" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    onFocus={(e) =>
                      e.target.setSelectionRange(e.target.value.length, e.target.value.length)
                    }
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
                    type="number"
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

          <FormField
            control={control}
            name="ambitoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ámbito</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value || "")}
                  >
                    <SelectTrigger className={`w-full ${errors.ambitoId ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Seleccione un ámbito" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value || "")}
                  >
                    <SelectTrigger className={`w-full ${errors.categoriaId ? "border-red-500" : ""}`}>
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value || "")}
                  >
                    <SelectTrigger className={`w-full ${errors.centroPobladoId ? "border-red-500" : ""}`}>
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value || "")}
                  >
                    <SelectTrigger className={`w-full ${errors.caserioId ? "border-red-500" : ""}`}>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input para Documento PDF */}
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
                    setFileName("");
                    const fileInput = document.getElementById("documentoBytes") as HTMLInputElement;
                    if (fileInput) fileInput.value = "";
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Input
              id="documentoBytes"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {errors.documentoBytes && (
              <p className="text-sm text-red-500">
                {errors.documentoBytes.message as string}
              </p>
            )}
          </FormItem>

          <div className="col-span-full">
            <ActualizacionDocumentoModalFooter onClose={onClose} isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </Form>
  );
};
