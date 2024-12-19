import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit, Save, XCircle, Plus } from "lucide-react";
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

interface CategoriaModalProps {
  isOpen: boolean;
  categoria?: Categoria;
  onClose: () => void;
  onSubmit: (data: Categoria) => Promise<void>;
}

export function CategoriaModal({
  isOpen,
  categoria,
  onClose,
  onSubmit,
}: CategoriaModalProps) {
  const isEditing = categoria?.id && categoria.id > 0;

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
    } else {
      form.reset({
        nombreCategoria: "",
      });
    }
  }, [categoria, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const categoriaData: Categoria = {
      id: categoria?.id || 0,
      nombreCategoria: values.nombreCategoria,
    };
    await onSubmit(categoriaData);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
          <DialogTitle className="text-2xl font-bold flex items-center">
            {isEditing ? (
              <Edit className="mr-2 h-6 w-6" />
            ) : (
              <Plus className="mr-2 h-6 w-6" />
            )}
            {isEditing ? "Editar Categoría" : "Registrar Categoría"}
          </DialogTitle>
          <DialogDescription className="text-sm text-emerald-100">
            {isEditing
              ? "Modifica los datos de la categoría según sea necesario."
              : "Complete el formulario para registrar una nueva categoría."}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-6 space-y-6"
            >
              <FormField
                control={form.control}
                name="nombreCategoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Categoría</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre de la categoría"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? "Guardar Cambios" : "Registrar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}