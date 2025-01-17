import React, { useState } from "react";
import { useForm} from "react-hook-form";
import { Documento } from "@/model/documento";
import DatosDocumentoFormFields from "./DatosDocumentoFormFields";
import DatosDocumentoFormSelects from "./DatosDocumentoFormSelects";
import DatosDocumentoFormFileUpload from "./DatosDocumentoFormFileUpload";
import DatosDocumentoFormButtons from "./DatosDocumentoFormButtons";

interface DatosDocumentoFormProps {
  onPrevious: () => void;
  onSubmit: (data: { documento: Documento }) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Documento>;
}

const DatosDocumentoForm: React.FC<DatosDocumentoFormProps> = ({
  onPrevious,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Documento>({
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

  const onFormSubmit = (data: Documento) => {
    if (isFormValid()) {
      const documentoRequest: Documento = {
        ...data,
        documentoBytes: file,
        nombre: data.nombre.trim(),
        asunto: data.asunto.trim(),
        folios: Number(data.folios),
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
      <DatosDocumentoFormFields register={register} errors={errors} />

      <DatosDocumentoFormSelects control={control} errors={errors} />

      <DatosDocumentoFormFileUpload
        handleFileChange={handleFileChange}
        fileName={fileName}
        errors={errors}
      />

      <DatosDocumentoFormButtons
        onPrevious={onPrevious}
        onCancel={onCancel}
        isFormValid={isFormValid()}
      />
    </form>
  );
};

export default DatosDocumentoForm;
