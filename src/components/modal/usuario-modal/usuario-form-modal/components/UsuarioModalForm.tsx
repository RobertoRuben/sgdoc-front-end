import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import { SearchSelect } from "@/components/ui/search-select";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Usuario} from "@/model/usuario";
import {Rol} from "@/model/rol";
import {TrabajadorNombresDetails} from "@/model/trabajadorNombresDetails";
import {UsuarioModalFooter} from "./UsuarioModalFooter";

const formSchema = z.object({
    nombreUsuario: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .regex(
            /^[a-zA-Z0-9._]+$/,
            "Solo se permiten letras, números, puntos y guiones bajos"
        ),
    contrasena: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    rolId: z.string({required_error: "Por favor seleccione un rol"}),
    trabajadorId: z.number({
        required_error: "Por favor seleccione un trabajador",
    }),
});

interface UsuarioModalFormProps {
    usuario?: Usuario;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Usuario) => Promise<void>;
    roles: Rol[];
    trabajadores: TrabajadorNombresDetails[];
    isLoading?: boolean;
}

export const UsuarioModalForm: React.FC<UsuarioModalFormProps> = ({
                                                                      usuario,
                                                                      isEditing,
                                                                      onClose,
                                                                      onSubmit,
                                                                      roles,
                                                                      trabajadores,
                                                                      isLoading = false,
                                                                  }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombreUsuario: "",
            contrasena: "",
            rolId: "",
            trabajadorId: undefined,
        },
    });

    useEffect(() => {
        if (!usuario) return;
        if (!roles || roles.length === 0 || isLoading) return;
        form.reset({
            nombreUsuario: usuario.nombreUsuario,
            contrasena: "",
            rolId: usuario.rolId?.toString() || "",
            trabajadorId: usuario.trabajadorId,
        });
        form.setFocus(isEditing ? "contrasena" : "nombreUsuario");
    }, [usuario, roles, isLoading, form, isEditing]);

    const trabajadoresOptions = trabajadores.map((trabajador) => ({
        value: trabajador.id,
        label: trabajador.nombres,
    }));

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const data: Usuario = {
            id: usuario?.id,
            nombreUsuario: values.nombreUsuario,
            contrasena: values.contrasena,
            rolId: parseInt(values.rolId, 10),
            trabajadorId: values.trabajadorId,
        };
        await onSubmit(data);
        onClose();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6">
                    <FormField
                        control={form.control}
                        name="nombreUsuario"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base">Nombre de Usuario</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Ingrese nombre de usuario"
                                        className="text-sm sm:text-base"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contrasena"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base">Contraseña</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Ingrese contraseña"
                                        className="text-sm sm:text-base"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm"/>
                            </FormItem>
                        )}
                    />

<FormField
  control={form.control}
  name="rolId"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm sm:text-base">Rol</FormLabel>
      <FormControl>
        <SearchSelect<string>
          inputId="rol"
          options={roles.map((rol) => ({
            value: (rol.id ?? 0).toString(),
            label: rol.nombreRol
          }))}
          value={roles
            .map((rol) => ({
              value: (rol.id ?? 0).toString(),
              label: rol.nombreRol
            }))
            .find((option) => option.value === field.value)}
          onChange={(option) => field.onChange(option?.value)}
          isDisabled={isLoading}
          placeholder="Seleccione rol"
        />
      </FormControl>
      <FormMessage className="text-xs sm:text-sm" />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="trabajadorId"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm sm:text-base">Trabajador</FormLabel>
      <FormControl>
        <SearchSelect<number>
          inputId="trabajador"
          options={trabajadoresOptions}
          value={trabajadoresOptions.find(
            (option) => option.value === field.value
          )}
          onChange={(option) => field.onChange(option?.value)}
          isDisabled={isLoading}
          placeholder="Seleccione un trabajador"
        />
      </FormControl>
      <FormMessage className="text-xs sm:text-sm" />
    </FormItem>
  )}
/>
                </div>

                <UsuarioModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};