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
import { AmbitoModalFooter } from "./AmbitoModalFooter";
import { Ambito } from "@/model/ambito";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  nombreAmbito: z
    .string()
    .min(2, {
      message: "El nombre del ámbito debe tener al menos 2 caracteres",
    })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "El nombre del ámbito no debe contener números",
    }),
});

interface AmbitoModalFormProps {
  ambito?: Ambito;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: Ambito) => Promise<void>;
  isLoading?: boolean;
}

export const AmbitoModalForm: React.FC<AmbitoModalFormProps> = ({
  ambito,
  isEditing,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreAmbito: "",
    },
  });

  useEffect(() => {
    if (ambito) {
      form.reset({
        nombreAmbito: ambito.nombreAmbito
      });
    }
  }, [ambito, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const ambitoData: Ambito = {
        id: ambito?.id || 0,
        nombreAmbito: values.nombreAmbito,
      };
      await onSubmit(ambitoData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al guardar el ámbito"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="nombreAmbito"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Ámbito</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese el nombre del ámbito"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AmbitoModalFooter 
          isEditing={isEditing} 
          onClose={onClose}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};