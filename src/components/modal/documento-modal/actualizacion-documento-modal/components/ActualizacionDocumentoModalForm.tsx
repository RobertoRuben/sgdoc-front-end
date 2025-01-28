import type React from "react";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Documento } from "@/model/documento";
import type { Ambito } from "@/model/ambito";
import type { CentroPoblado } from "@/model/centroPoblado";
import type { Caserio } from "@/model/caserio";
import type { Categoria } from "@/model/categoria";
import { ActualizacionDocumentoModalFooter } from "./ActualizacionDocumentoModalFooter";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { ActualizacionDocumentoModalFormInputs } from "./ActualizacionDocumentoModalFormInputs";
import { ActualizacionDocumentoModalFormSelects } from "./ActualizacionDocumentoModalFormSelects";
import { getAmbitos } from "@/service/ambitoService";
import { getCategorias } from "@/service/categoriaService";
import { getCentrosPoblados } from "@/service/centroPobladoService";
import {
  getAllCaserios,
  getCaseriosByCentroPobladoId,
} from "@/service/caserioService";
const formSchema = z.object({
  id: z.number().optional(),
  documentoBytes: z.preprocess((val) => {
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
    (val) => Number.parseInt(val as string, 10),
    z.number().min(1, "Seleccione un ámbito")
  ),
  categoriaId: z.preprocess(
    (val) => Number.parseInt(val as string, 10),
    z.number().min(1, "Seleccione una categoría")
  ),
  caserioId: z.preprocess(
    (val) => Number.parseInt(val as string, 10),
    z.number().min(1, "Seleccione un caserío")
  ),
  centroPobladoId: z.preprocess(
    (val) => Number.parseInt(val as string, 10),
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
  const [caseriosFiltrados, setCaseriosFiltrados] = useState<Caserio[]>([]);

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
        
        // Si hay documento para editar, cargar sus caseríos específicos
        if (documento?.centroPobladoId) {
          const caseriosFiltered = await getCaseriosByCentroPobladoId(documento.centroPobladoId);
          setCaseriosFiltrados(caseriosFiltered ?? []);
        } else {
          setCaseriosFiltrados(caseriosData);
        }
        
        setCatalogsLoaded(true);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      }
    };
    loadCatalogs();
  }, [documento?.centroPobladoId]); // Agregar dependencia

  useEffect(() => {
    const centroPobladoId = form.watch("centroPobladoId");
  
    const filterCaserios = async () => {
      if (centroPobladoId && centroPobladoId > 0) {
        try {
          const caseriosData = await getCaseriosByCentroPobladoId(centroPobladoId);
          setCaseriosFiltrados(caseriosData ?? []);
        } catch (error) {
          console.error("Error al cargar caseríos:", error);
        }
      } else {
        setCaseriosFiltrados(caserios);
      }
    };
  
    filterCaserios();
  }, [form.watch("centroPobladoId"), caserios]); // Agregar dependencia caserios

  useEffect(() => {
    if (documento) {
      form.reset({
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
  }, [documento, form.reset]);

  const handleFormSubmit = async (values: Documento) => {
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

  const handleLetterKeyPress = (items: HTMLElement[], key: string) => {
    const matchingItem = items.find((item) =>
      item.textContent?.toLowerCase().startsWith(key.toLowerCase())
    );
    if (matchingItem) {
      matchingItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      matchingItem.focus();
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const scrollArea = event.currentTarget.closest(
      ".scroll-area"
    ) as HTMLElement;
    if (scrollArea) {
      scrollArea.scrollTop += event.deltaY;
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
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <ActualizacionDocumentoModalFormInputs
                fileName={fileName}
                setFileName={setFileName}
                handleFileChange={handleFileChange}
              />
              <ActualizacionDocumentoModalFormSelects
                ambitos={ambitos}
                categorias={categorias}
                centrosPoblados={centrosPoblados}
                caserios={caseriosFiltrados} 
                handleWheel={handleWheel}
                handleLetterKeyPress={handleLetterKeyPress}
              />
            </div>
          </div>
          <div className="sticky bottom-0 w-full mt-auto">
            <ActualizacionDocumentoModalFooter
              onClose={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default ActualizacionDocumentoModalForm;
