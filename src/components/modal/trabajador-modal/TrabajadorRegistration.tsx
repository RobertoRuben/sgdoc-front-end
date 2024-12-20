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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trabajador } from "@/model/trabajador";
import { Area } from "@/model/area";
import { Edit, Save, XCircle, Plus } from "lucide-react";

const formSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, { message: "DNI debe tener 8 dígitos" }),
  nombre: z
    .string()
    .min(2, { message: "Nombre debe tener al menos 2 caracteres" }),
  apellidoPaterno: z
    .string()
    .min(2, { message: "Apellido paterno debe tener al menos 2 caracteres" }),
  apellidoMaterno: z
    .string()
    .min(2, { message: "Apellido materno debe tener al menos 2 caracteres" }),
  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    required_error: "Debe seleccionar un género",
  }),
  areaId: z.number({ required_error: "Debe seleccionar un área" }),
});

interface TrabajadoresModalProps {
  isOpen: boolean;
  trabajador?: Trabajador;
  onClose: () => void;
  onSubmit: (data: Trabajador) => void;
  areas: Area[];
}

export function TrabajadoresModal({
  isOpen,
  trabajador,
  onClose,
  onSubmit,
  areas,
}: TrabajadoresModalProps) {
  const isEditing = trabajador?.id && trabajador.id > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      genero: undefined,
      areaId: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (trabajador) {
        form.reset({
          dni: trabajador.dni.toString(),
          nombre: trabajador.nombres,
          apellidoPaterno: trabajador.apellidoPaterno,
          apellidoMaterno: trabajador.apellidoMaterno,
          genero: trabajador.genero as "Masculino" | "Femenino" | "Otro",
          areaId: trabajador.areaId,
        });
      } else {
        form.reset({
          dni: "",
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          genero: undefined,
          areaId: undefined,
        });
      }
    }
  }, [isOpen, trabajador, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const data: Trabajador = {
      id: trabajador?.id || 0,
      dni: parseInt(values.dni, 10),
      nombres: values.nombre,
      apellidoPaterno: values.apellidoPaterno,
      apellidoMaterno: values.apellidoMaterno,
      genero: values.genero,
      areaId: values.areaId,
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
              <Edit className="mr-2 h-6 w-6" />
            ) : (
              <Plus className="mr-2 h-6 w-6" />
            )}
            {isEditing ? "Editar Trabajador" : "Registrar Trabajador"}
          </DialogTitle>
          <DialogDescription className="text-sm text-emerald-100">
            {isEditing
              ? "Modifica los datos del trabajador en el formulario a continuación."
              : "Complete el formulario para registrar un nuevo trabajador."}
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
                        <Input
                          placeholder="Ingrese DNI"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese nombre"
                          {...field}
                          className="w-full"
                        />
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
                          className="w-full"
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
                          className="w-full"
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
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                        name="genero"
                      >
                        <FormControl>
                          <SelectTrigger className="w-full" id="genero-select">
                            <SelectValue placeholder="Seleccione género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="areaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="area-select">Área</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value ? String(field.value) : ""}
                        name="areaId"
                      >
                        <FormControl>
                          <SelectTrigger className="w-full" id="area-select">
                            <SelectValue placeholder="Seleccione área" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={area.id} value={String(area.id)}>
                              {area.nombreArea}
                            </SelectItem>
                          ))}
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
