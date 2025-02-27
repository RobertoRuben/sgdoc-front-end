import { useEffect, useState } from "react";
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
import { SearchSelect } from "@/components/ui/search-select";
import { ComunicacionAreaModalFooter } from "./ComunicacionAreaModalFooter";
import { ComunicacionArea } from "@/model/comunicacionArea";
import { getAreas } from "@/service/areaService";
import { Area } from "@/model/area";

// Esquema de validación con Zod
const formSchema = z.object({
  areaOrigenId: z.number({
    required_error: "Debe seleccionar un área de origen",
  }),
  areaDestinoId: z.number({
    required_error: "Debe seleccionar un área de destino",
  }),
});

interface ComunicacionAreaModalFormProps {
  comunicacionArea?: ComunicacionArea;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: ComunicacionArea) => Promise<void>;
  isLoading?: boolean; // Para deshabilitar el formulario mientras se envía
}

export const ComunicacionAreaModalForm: React.FC<ComunicacionAreaModalFormProps> = ({
  comunicacionArea,
  isEditing,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaOrigenId: 0,
      areaDestinoId: 0,
    },
  });

  // Estado local para las opciones de áreas y su estado de carga
  const [areasOptions, setAreasOptions] = useState<{ value: number; label: string }[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  // Cargar las áreas desde la API al montar el componente
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoadingAreas(true);
        const areas: Area[] = await getAreas();
        // Mapeamos las áreas para adaptarlas al formato { value, label }
        const options = areas.map((area) => ({
          value: area.id || 0,
          label: area.nombreArea,
        }));
        setAreasOptions(options);
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  // Si se recibe un comunicacionArea en props, reseteamos el formulario con esos valores
  useEffect(() => {
    if (comunicacionArea) {
      form.reset({
        areaOrigenId: comunicacionArea.areaOrigenId || 0,
        areaDestinoId: comunicacionArea.areaDestinoId || 0,
      });
    }
  }, [comunicacionArea, form]);

  // Manejo del submit
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const comunicacionAreaData: ComunicacionArea = {
      id: comunicacionArea?.id || 0,
      areaOrigenId: values.areaOrigenId,
      areaDestinoId: values.areaDestinoId,
    };
    await onSubmit(comunicacionAreaData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
        {/* Campo Área de Origen */}
        <FormField
          control={form.control}
          name="areaOrigenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área de Origen</FormLabel>
              <FormControl>
                <SearchSelect
                  options={areasOptions}
                  value={areasOptions.find(option => option.value === field.value)}
                  onChange={(newValue) => field.onChange(newValue?.value)}
                  isDisabled={isLoading || loadingAreas}
                  placeholder="Seleccione el área de origen"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Área de Destino */}
        <FormField
          control={form.control}
          name="areaDestinoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área de Destino</FormLabel>
              <FormControl>
                <SearchSelect
                  options={areasOptions}
                  value={areasOptions.find(option => option.value === field.value)}
                  onChange={(newValue) => field.onChange(newValue?.value)}
                  isDisabled={isLoading || loadingAreas}
                  placeholder="Seleccione el área de destino"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer con botones */}
        <ComunicacionAreaModalFooter 
          isEditing={isEditing}
          onClose={onClose}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};
