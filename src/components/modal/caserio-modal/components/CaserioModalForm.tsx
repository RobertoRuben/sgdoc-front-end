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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Caserio } from "@/model/caserio";
import { CentroPoblado } from "@/model/centroPoblado";
import { CaserioModalFooter } from "./CaserioModalFooter";

const formSchema = z.object({
  nombreCaserio: z
    .string()
    .min(2, {
      message: "El nombre del caserío debe tener al menos 2 caracteres",
    })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "El nombre del caserío no debe contener números",
    }),
  CentroPobladoId: z.string({
    required_error: "Por favor seleccione un centro poblado",
  }),
});

interface CaserioModalFormProps {
  caserio?: Caserio;
  centrosPoblados: CentroPoblado[];
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: Caserio) => Promise<void>;
  isLoading?: boolean;
}

export const CaserioModalForm: React.FC<CaserioModalFormProps> = ({
  caserio,
  centrosPoblados,
  isEditing,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCaserio: "",
      CentroPobladoId: "",
    },
  });

  useEffect(() => {
    if (caserio) {
      form.reset({
        nombreCaserio: caserio.nombreCaserio,
        CentroPobladoId: caserio.CentroPobladoId?.toString() || "",
      });
    }
  }, [caserio, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const caserioData: Caserio = {
      id: caserio?.id || 0,
      nombreCaserio: values.nombreCaserio,
      CentroPobladoId: parseInt(values.CentroPobladoId),
    };
    await onSubmit(caserioData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="nombreCaserio"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="nombreCaserio-input">
                Nombre del Caserío
              </FormLabel>
              <FormControl>
                <Input
                  id="nombreCaserio-input"
                  placeholder="Ingrese el nombre del caserío"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="CentroPobladoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="centroPoblado-select">
                Centro Poblado
              </FormLabel>
              <Select
                name="CentroPobladoId"
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger id="centroPoblado-select">
                    <SelectValue placeholder="Seleccione un centro poblado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {centrosPoblados.map((cp) => (
                    <SelectItem
                      key={cp.id ?? 0}
                      value={(cp.id ?? 0).toString()}
                    >
                      {cp.nombreCentroPoblado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <CaserioModalFooter 
          isEditing={isEditing} 
          onClose={onClose}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};