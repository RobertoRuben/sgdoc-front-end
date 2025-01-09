import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { CentroPobladoModalFooter } from "./CentroPobladoModalFooter";
import { CentroPoblado } from "@/model/centroPoblado";

const formSchema = z.object({
  nombreCentroPoblado: z
    .string()
    .min(2, {
      message: "El nombre del centro poblado debe tener al menos 2 caracteres",
    })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "El nombre del centro poblado no debe contener números",
    }),
});

interface CentroPobladoModalFormProps {
  centroPoblado?: CentroPoblado;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: CentroPoblado) => Promise<void>;
  isLoading?: boolean;
}

export const CentroPobladoModalForm: React.FC<CentroPobladoModalFormProps> = ({
  centroPoblado,
  isEditing,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCentroPoblado: "",
    },
  });

  useEffect(() => {
    if (centroPoblado) {
      form.reset({
        nombreCentroPoblado: centroPoblado.nombreCentroPoblado,
      });
    }
  }, [centroPoblado, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const centroPobladoData: CentroPoblado = {
      id: centroPoblado?.id || 0,
      nombreCentroPoblado: values.nombreCentroPoblado,
    };
    await onSubmit(centroPobladoData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="nombreCentroPoblado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Centro Poblado</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese el nombre del centro poblado"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CentroPobladoModalFooter 
          isEditing={isEditing} 
          onClose={onClose}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};