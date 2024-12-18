"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, X, Save } from "lucide-react"; // Importar el ícono Save
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentoRequest } from "@/model/documento";

const formSchema = z.object({
  id: z.number().optional(),
  documentoBytes: z.instanceof(File).nullable(),
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

const ambitos = [
  { value: 1, label: "Ámbito 1" },
  { value: 2, label: "Ámbito 2" },
];

const categorias = [
  { value: 1, label: "Categoría 1" },
  { value: 2, label: "Categoría 2" },
];

const caserios = [
  { value: 1, label: "Caserío 1" },
  { value: 2, label: "Caserío 2" },
];

const centrosPoblados = [
  { value: 1, label: "Centro Poblado 1" },
  { value: 2, label: "Centro Poblado 2" },
];

interface ActualizacionDocumentoModalProps {
  isOpen: boolean;
  documento?: DocumentoRequest;
  onClose: () => void;
  onSubmit: (data: DocumentoRequest) => Promise<void>;
}

export function ActualizacionDocumentoModal({
  isOpen,
  documento,
  onClose,
  onSubmit,
}: ActualizacionDocumentoModalProps) {
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DocumentoRequest>({
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
      if (documento.documentoBytes) {
        setFile(documento.documentoBytes);
        setFileName("Archivo actual");
      }
    }
  }, [documento, reset]);

  // 4. Convertir datos a DocumentoRequest en el envío
  const handleFormSubmit: SubmitHandler<DocumentoRequest> = async (values) => {
    setIsSubmitting(true);
    try {
      const documentoRequest: DocumentoRequest = {
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
      await onSubmit(documentoRequest);
      handleClose();
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setFileName("");
    setFile(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB
        alert("El archivo excede el tamaño máximo permitido de 5MB.");
        setFile(null);
        setFileName("");
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Edit className="mr-2 h-6 w-6" />
            Actualizar Documento
          </DialogTitle>
          <DialogDescription className="text-sm text-emerald-100">
            Modifique los datos del documento según sea necesario.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Campo de Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  {...register("nombre")}
                  className={`w-full ${errors.nombre ? "border-red-500" : ""}`}
                  placeholder="Ingrese el nombre del documento"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Campo de Folios */}
              <div className="space-y-2">
                <Label htmlFor="folios">Folios</Label>
                <Input
                  id="folios"
                  type="number"
                  min={1}
                  {...register("folios", { valueAsNumber: true })}
                  className={`w-full ${errors.folios ? "border-red-500" : ""}`}
                  placeholder="Ingrese la cantidad de folios"
                />
                {errors.folios && (
                  <p className="text-sm text-red-500">
                    {errors.folios.message}
                  </p>
                )}
              </div>

              {/* Campo de Asunto */}
              <div className="col-span-full space-y-2">
                <Label htmlFor="asunto">Asunto</Label>
                <Textarea
                  id="asunto"
                  {...register("asunto")}
                  className={`w-full min-h-[100px] ${
                    errors.asunto ? "border-red-500" : ""
                  }`}
                  placeholder="Ingrese el asunto del documento"
                />
                {errors.asunto && (
                  <p className="text-sm text-red-500">
                    {errors.asunto.message}
                  </p>
                )}
              </div>

              {/* Select de Ámbito */}
              <div className="space-y-2">
                <Label htmlFor="ambitoId">Ámbito</Label>
                <Select
                  name="ambitoId"
                  onValueChange={(value) =>
                    setValue("ambitoId", parseInt(value, 10))
                  }
                >
                  <SelectTrigger
                    id="ambitoId"
                    className={`w-full ${
                      errors.ambitoId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un ámbito" />
                  </SelectTrigger>
                  <SelectContent>
                    {ambitos.map((ambito) => (
                      <SelectItem
                        key={ambito.value}
                        value={ambito.value.toString()}
                      >
                        {ambito.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ambitoId && (
                  <p className="text-sm text-red-500">
                    {errors.ambitoId.message}
                  </p>
                )}
              </div>

              {/* Select de Categoría */}
              <div className="space-y-2">
                <Label htmlFor="categoriaId">Categoría</Label>
                <Select
                  name="categoriaId"
                  onValueChange={(value) =>
                    setValue("categoriaId", parseInt(value, 10))
                  }
                >
                  <SelectTrigger
                    id="categoriaId"
                    className={`w-full ${
                      errors.categoriaId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem
                        key={categoria.value}
                        value={categoria.value.toString()}
                      >
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoriaId && (
                  <p className="text-sm text-red-500">
                    {errors.categoriaId.message}
                  </p>
                )}
              </div>

              {/* Select de Caserío */}
              <div className="space-y-2">
                <Label htmlFor="caserioId">Caserío</Label>
                <Select
                  name="caserioId"
                  onValueChange={(value) =>
                    setValue("caserioId", parseInt(value, 10))
                  }
                >
                  <SelectTrigger
                    id="caserioId"
                    className={`w-full ${
                      errors.caserioId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un caserío" />
                  </SelectTrigger>
                  <SelectContent>
                    {caserios.map((caserio) => (
                      <SelectItem
                        key={caserio.value}
                        value={caserio.value.toString()}
                      >
                        {caserio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.caserioId && (
                  <p className="text-sm text-red-500">
                    {errors.caserioId.message}
                  </p>
                )}
              </div>

              {/* Select de Centro Poblado */}
              <div className="space-y-2">
                <Label htmlFor="centroPobladoId">Centro Poblado</Label>
                <Select
                  name="centroPobladoId"
                  onValueChange={(value) =>
                    setValue("centroPobladoId", parseInt(value, 10))
                  }
                >
                  <SelectTrigger
                    id="centroPobladoId"
                    className={`w-full ${
                      errors.centroPobladoId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un centro poblado" />
                  </SelectTrigger>
                  <SelectContent>
                    {centrosPoblados.map((centro) => (
                      <SelectItem
                        key={centro.value}
                        value={centro.value.toString()}
                      >
                        {centro.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.centroPobladoId && (
                  <p className="text-sm text-red-500">
                    {errors.centroPobladoId.message}
                  </p>
                )}
              </div>

              {/* Campo de Documento PDF */}
              <div className="col-span-full space-y-2">
                <Label htmlFor="documentoBytes">Documento PDF</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() =>
                      document.getElementById("documentoBytes")?.click()
                    }
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
                        setFile(null);
                        // Reset the file input value
                        const fileInput = document.getElementById(
                          "documentoBytes"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.value = "";
                        }
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
              </div>
            </div>
          </form>
        </div>
        <DialogFooter className="p-6 bg-gray-50 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Guardando..."
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> {/* Ícono de Guardar */}
                Guardar Cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
