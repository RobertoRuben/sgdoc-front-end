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
import { RemitenteModalFooter } from "./RemitenteModalFooter";
import { Remitente } from "@/model/remitente";

const formSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, { message: "DNI debe tener 8 dígitos" }),
  nombres: z
    .string()
    .min(2, { message: "Nombres debe tener al menos 2 caracteres" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "Nombres debe contener solo letras",
    }),
  apellidoPaterno: z
    .string()
    .min(2, { message: "Apellido paterno debe tener al menos 2 caracteres" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "Apellido paterno debe contener solo letras",
    }),
  apellidoMaterno: z
    .string()
    .min(2, { message: "Apellido materno debe tener al menos 2 caracteres" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "Apellido materno debe contener solo letras",
    }),
  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    required_error: "Debe seleccionar un género",
  }),
});

interface RemitenteModalFormProps {
  remitente?: Remitente;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: Remitente) => Promise<void>;
  isLoading?: boolean;
}

export const RemitenteModalForm: React.FC<RemitenteModalFormProps> = ({
  remitente,
  isEditing,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
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

  const generoOptions = [
    { value: "Masculino", label: "Masculino" },
    { value: "Femenino", label: "Femenino" },
  ] as const;

  useEffect(() => {
    if (remitente) {
      const generoNormalizado = remitente.genero.trim(); // elimina espacios
      const generoValue = generoOptions.find(
        option => option.value === generoNormalizado
      )?.value || undefined;
  
      form.reset({
        dni: remitente.dni.toString(),
        nombres: remitente.nombres,
        apellidoPaterno: remitente.apellidoPaterno,
        apellidoMaterno: remitente.apellidoMaterno,
        genero: generoValue,
      });
    }
  }, [remitente, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const data: Remitente = {
      id: remitente?.id || 0,
      dni: parseInt(values.dni, 10),
      nombres: values.nombres,
      apellidoPaterno: values.apellidoPaterno,
      apellidoMaterno: values.apellidoMaterno,
      genero: values.genero,
    };
    await onSubmit(data);
  };

  return (
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
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese nombres"
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
            name="apellidoPaterno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Paterno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese apellido paterno"
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
            name="apellidoMaterno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Materno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese apellido materno"
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
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="genero-select">Género</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value }
                  name="genero"
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <RemitenteModalFooter
          isEditing={isEditing}
          onClose={onClose}
          onSubmit={form.handleSubmit(handleSubmit)}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};
