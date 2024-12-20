import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, XCircle, UserPen, UserPlus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Remitente } from "@/model/remitente";

const formSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, { message: "DNI debe tener 8 dígitos" }),
  nombres: z
    .string()
    .min(2, { message: "Nombres debe tener al menos 2 caracteres" }),
  apellidoPaterno: z
    .string()
    .min(2, { message: "Apellido paterno debe tener al menos 2 caracteres" }),
  apellidoMaterno: z
    .string()
    .min(2, { message: "Apellido materno debe tener al menos 2 caracteres" }),
  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    required_error: "Debe seleccionar un género",
  }),
});

interface RemitentesModalProps {
  isOpen: boolean;
  remitente?: Remitente;
  onClose: () => void;
  onSubmit: (data: Remitente) => void;
}

export function RemitentesModal({
  isOpen,
  remitente,
  onClose,
  onSubmit,
}: RemitentesModalProps) {
  const isEditing = remitente?.id && remitente.id > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      genero: undefined,
    },
  });

  useEffect(() => {
    if (remitente) {
      form.reset({
        dni: remitente.dni.toString(),
        nombres: remitente.nombres,
        apellidoPaterno: remitente.apellidoPaterno,
        apellidoMaterno: remitente.apellidoMaterno,
        genero: remitente.genero as "Masculino" | "Femenino" | "Otro",
      });
    } else {
      form.reset({
        dni: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        genero: undefined,
      });
    }
  }, [remitente, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const data: Remitente = {
      id: remitente?.id || 0,
      dni: parseInt(values.dni, 10),
      nombres: values.nombres,
      apellidoPaterno: values.apellidoPaterno,
      apellidoMaterno: values.apellidoMaterno,
      genero: values.genero,
    };
    onSubmit(data);
    handleClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
          <DialogTitle className="text-2xl font-bold flex items-center">
            {isEditing ? (
              <UserPen className="mr-2 h-6 w-6" />
            ) : (
              <UserPlus className="mr-2 h-6 w-6" />
            )}
            {isEditing ? "Editar Remitente" : "Registrar Remitente"}
          </DialogTitle>
          <DialogDescription className="text-sm text-emerald-100">
            {isEditing
              ? "Modifica los datos del remitente en el formulario a continuación."
              : "Complete el formulario para registrar un nuevo remitente."}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese DNI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese nombres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellidoPaterno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Paterno</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese apellido paterno"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellidoMaterno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Materno</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese apellido materno"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="genero-select">Género</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name="genero"
                      >
                        <FormControl>
                          <SelectTrigger id="genero-select">
                            <SelectValue placeholder="Seleccione género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="p-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
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
            onClick={form.handleSubmit(handleSubmit)}
            className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? "Guardar Cambios" : "Registrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
