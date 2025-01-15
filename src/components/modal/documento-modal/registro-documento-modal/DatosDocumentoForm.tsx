import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DocumentoRequest } from "@/model/documento";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FiSave, FiArrowLeft } from "react-icons/fi";

interface DatosDocumentoFormProps {
  onPrevious: () => void;
  onSubmit: (data: { documento: DocumentoRequest }) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<DocumentoRequest>;
}

const DatosDocumentoForm = ({
  onPrevious,
  onSubmit,
  onCancel,
  initialData,
}: DatosDocumentoFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DocumentoRequest>({
    mode: "onChange",
    defaultValues: {
      ...initialData,
      documentoBytes: null,
      ambitoId: initialData?.ambitoId || 0,
      categoriaId: initialData?.categoriaId || 0,
      caserioId: initialData?.caserioId || 0,
      centroPobladoId: initialData?.centroPobladoId || 0,
    },
  });

  const watchedFields = watch([
    "nombre",
    "folios",
    "asunto",
    "ambitoId",
    "categoriaId",
    "caserioId",
    "centroPobladoId",
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("El archivo excede el tamaño máximo permitido de 5MB.");
        setFile(null);
        setFileName("");
        setValue("documentoBytes", null);
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setValue("documentoBytes", selectedFile, { shouldValidate: true });
      }
    }
  };

  const isFormValid = () => {
    const areFieldsFilled = watchedFields.every((field) => {
      if (typeof field === "number") {
        return field > 0;
      }
      return field !== undefined && field !== null && field !== "";
    });
    return areFieldsFilled && file !== null;
  };

  const onFormSubmit = (data: DocumentoRequest) => {
    if (isFormValid()) {
      const documentoRequest: DocumentoRequest = {
        ...data,
        documentoBytes: file,
        ambitoId: Number(data.ambitoId),
        categoriaId: Number(data.categoriaId),
        caserioId: Number(data.caserioId),
        centroPobladoId: Number(data.centroPobladoId),
      };
      onSubmit({ documento: documentoRequest });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del documento</Label>
          <Input
            id="nombre"
            {...register("nombre", {
              required: "Nombre del documento es requerido",
            })}
            className={`mt-1 block w-full ${
              errors.nombre
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-[#028a3b]"
            } rounded-md`}
          />
          {errors.nombre && (
            <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="folios">Número de folios</Label>
          <Input
            id="folios"
            type="number"
            {...register("folios", {
              required: "Número de folios es requerido",
              valueAsNumber: true,
              validate: {
                positive: (v) =>
                  v > 0 || "El número de folios debe ser positivo",
                integer: (v) =>
                  Number.isInteger(v) ||
                  "El número de folios debe ser un entero",
              },
            })}
            className={`mt-1 block w-full ${
              errors.folios
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-[#028a3b]"
            } rounded-md`}
          />
          {errors.folios && (
            <p className="text-red-600 text-sm mt-1">{errors.folios.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="asunto">Asunto</Label>
        <Textarea
          id="asunto"
          {...register("asunto", { required: "Asunto es requerido" })}
          className={`mt-1 block w-full ${
            errors.asunto
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#028a3b]"
          } rounded-md`}
        />
        {errors.asunto && (
          <p className="text-red-600 text-sm mt-1">{errors.asunto.message}</p>
        )}
      </div>
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
      <div>
        <Label htmlFor="documentoBytes">Documento (PDF)</Label>
        <Input
          id="documentoBytes"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className={`${
            errors.documentoBytes
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#028a3b]"
          } mt-1 block w-full text-sm sm:text-base rounded-md`}
        />
        {fileName && (
          <p className="text-sm text-gray-600 mt-1">
            Archivo seleccionado: {fileName}
          </p>
        )}
        {errors.documentoBytes && (
          <p className="text-red-600 text-sm mt-1">
            {errors.documentoBytes.message}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
        <Button
          type="button"
          onClick={onPrevious}
          variant="outline"
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 flex items-center justify-center"
        >
          <FiArrowLeft className="mr-2" />
          Anterior
        </Button>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            onClick={onCancel}
            className="bg-[#d82f2f] text-white hover:bg-[#991f1f] hover:text-white w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center w-full sm:w-auto"
            disabled={!isFormValid()}
          >
            <FiSave className="mr-2" />
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default DatosDocumentoForm;
