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

import { SearchSelect } from "@/components/ui/search-select";
import { Trabajador } from "@/model/trabajador";
import { Area } from "@/model/area";
import { TrabajadorModalFooter } from "./TrabajadorModalFooter";

const formSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, { message: "DNI debe tener 8 dígitos" }),
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellidoPaterno: z
    .string()
    .min(2, { message: "El apellido paterno debe tener al menos 2 caracteres" }),
  apellidoMaterno: z
    .string()
    .min(2, { message: "El apellido materno debe tener al menos 2 caracteres" }),
  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    required_error: "Debe seleccionar un género",
  }),
  areaId: z.string({ required_error: "Debe seleccionar un área" }),
});

interface TrabajadorModalFormProps {
  trabajador?: Trabajador;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: Trabajador) => Promise<void>;
  areas: Area[];
  isLoading?: boolean;
}

export const TrabajadorModalForm: React.FC<TrabajadorModalFormProps> = ({
  trabajador,
  isEditing,
  onClose,
  onSubmit,
  areas,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      genero: undefined,
      areaId: "",
    },
  });

  useEffect(() => {
    if (!trabajador) return;
    if (!areas || areas.length === 0 || isLoading) return;

    form.reset({
      dni: trabajador.dni ? trabajador.dni.toString() : "",
      nombre: trabajador.nombres,
      apellidoPaterno: trabajador.apellidoPaterno,
      apellidoMaterno: trabajador.apellidoMaterno,
      genero: trabajador.genero as "Masculino" | "Femenino",
      areaId: trabajador.areaId?.toString().trim() || "",
    });
  }, [trabajador, areas, isLoading, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const data: Trabajador = {
      id: trabajador?.id || 0,
      dni: parseInt(values.dni, 10),
      nombres: values.nombre,
      apellidoPaterno: values.apellidoPaterno,
      apellidoMaterno: values.apellidoMaterno,
      genero: values.genero,
      areaId: parseInt(values.areaId, 10),
    };
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      {/* Estructura que sigue el ejemplo de RemitenteModalForm */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        {/* Contenedor scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dni-input">DNI</FormLabel>
                  <FormControl>
                    <Input
                      id="dni-input"
                      placeholder="Ingrese DNI"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
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
                    name="genero"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    disabled={isLoading}
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
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <FormControl>
                    <SearchSelect<string>
                      inputId="area"
                      options={areas.map((area) => ({
                        value: (area.id ?? 0).toString(),
                        label: area.nombreArea,
                      }))}
                      value={areas
                        .map((area) => ({
                          value: (area.id ?? 0).toString(),
                          label: area.nombreArea,
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value)}
                      isDisabled={isLoading}
                      placeholder="Seleccione un área"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Footer "pegado" al fondo, como en el ejemplo */}
        <div className="sticky bottom-0 w-full mt-auto">
          <TrabajadorModalFooter
            isEditing={isEditing}
            onClose={onClose}
            onSubmit={form.handleSubmit(handleSubmit)}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Form>
  );
};
