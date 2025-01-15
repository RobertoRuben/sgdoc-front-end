import React from "react";
import { useForm } from "react-hook-form";
import { Remitente } from "@/model/remitente";
import DatosRemitenteFormFields from "./DatosRemitenteFormFields";
import DatosRemitenteFormGenderSelect from "./DatosRemitenteFormGenderSelect";
import DatosRemitenteFormButtons from "./DatosRemitenteFormButtons";

interface DatosRemitenteFormProps {
  onNext: (data: Partial<FormData>) => void;
  onCancel: () => void;
  initialData?: Partial<Remitente>;
}

interface FormData {
  remitente?: Remitente;
}

const DatosRemitenteForm: React.FC<DatosRemitenteFormProps> = ({
  onNext,
  onCancel,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<Remitente>({
    mode: "onChange",
    defaultValues: initialData,
  });

  const onFormSubmit = (data: Remitente) => {
    if (
      isValid &&
      data.dni &&
      data.nombres &&
      data.apellidoPaterno &&
      data.apellidoMaterno &&
      data.genero
    ) {
      onNext({ remitente: data });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm"
    >
      <DatosRemitenteFormFields register={register} errors={errors} />

      <DatosRemitenteFormGenderSelect control={control} errors={errors} />

      <DatosRemitenteFormButtons onCancel={onCancel} isValid={isValid} />
    </form>
  );
};

export default DatosRemitenteForm;
