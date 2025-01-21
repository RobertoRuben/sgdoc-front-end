import { useEffect, useState } from "react";
import { SearchSelect } from "@/components/ui/search-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DerivacionModalFooter } from "./DerivacionModalFooter";
import { getAreasDestinoByAreaOrigenId } from "@/service/comunicacionAreaService";
import { ComunicacionAreaDestinoDetails } from "@/model/comunicacionAreaDestinoDetails";

const formSchema = z.object({
  areaId: z.number({
    required_error: "Debe seleccionar un área",
  }),
});

interface DerivacionModalFormProps {
  onClose: () => void;
  onSubmit: (areaId: number) => Promise<void>;
  isLoading?: boolean;
}

export const DerivacionModalForm: React.FC<DerivacionModalFormProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [areasDestino, setAreasDestino] = useState<
    ComunicacionAreaDestinoDetails[]
  >([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const loadAreasDestino = async () => {
      try {
        setLoadingAreas(true);
        const areaOrigenId = Number(sessionStorage.getItem("areaId"));
        const areas = await getAreasDestinoByAreaOrigenId(areaOrigenId);
        setAreasDestino(areas);
      } catch (error) {
        console.error("Error al cargar áreas destino:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    loadAreasDestino();
  }, []);

  const areasOptions = areasDestino.map((area) => ({
    value: area.areaDestinoId,
    label: area.nombreAreaDestino,
  }));

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values.areaId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="p-6 space-y-6"
      >
        <FormField
          control={form.control}
          name="areaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccione el área a derivar el documento</FormLabel>
              <FormControl>
                <SearchSelect<number>
                  inputId="area"
                  options={areasOptions}
                  value={areasOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption?.value);
                  }}
                  isDisabled={isLoading || loadingAreas}
                  isLoading={loadingAreas}
                  placeholder={
                    loadingAreas ? "Cargando áreas..." : "Seleccione un área"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DerivacionModalFooter onClose={onClose} isLoading={isLoading} />
      </form>
    </Form>
  );
};
