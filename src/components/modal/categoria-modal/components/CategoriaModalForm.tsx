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
import { CategoriaModalFooter } from "./CategoriaModalFooter";
import { Categoria } from "@/model/categoria";

const formSchema = z.object({
  nombreCategoria: z
    .string()
    .min(2, {
      message: "El nombre de la categoría debe tener al menos 2 caracteres",
    })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "El nombre de la categoría no debe contener números",
    }),
});

interface CategoriaModalFormProps {
  categoria?: Categoria;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: Categoria) => Promise<void>;
  isLoading?: boolean;
}

export const CategoriaModalForm: React.FC<CategoriaModalFormProps> = ({
  categoria,
  isEditing,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCategoria: "",
    },
  });

  useEffect(() => {
    if (categoria) {
      form.reset({
        nombreCategoria: categoria.nombreCategoria,
      });
    }
  }, [categoria, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const categoriaData: Categoria = {
      id: categoria?.id || 0,
      nombreCategoria: values.nombreCategoria,
    };
    await onSubmit(categoriaData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="nombreCategoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Categoría</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese el nombre de la categoría"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CategoriaModalFooter 
          isEditing={isEditing} 
          onClose={onClose}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};