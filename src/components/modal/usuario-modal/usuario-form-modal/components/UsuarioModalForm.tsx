import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Usuario} from "@/model/usuario";
import {Rol} from "@/model/rol";
import {TrabajadorNombresDetails} from "@/model/trabajadorNombresDetails";
import ReactSelect from "react-select";
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
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base">Rol</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full text-sm sm:text-sm">
                                            <SelectValue placeholder="Seleccione rol"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roles.map((rol) => (
                                            <SelectItem
                                                key={rol.id ?? 0}
                                                value={(rol.id ?? 0).toString()}
                                            >
                                                {rol.nombreRol}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-xs sm:text-sm"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="trabajadorId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base">Trabajador</FormLabel>
                                <FormControl>
                                    <ReactSelect
                                        inputId="trabajador"
                                        options={trabajadoresOptions}
                                        value={trabajadoresOptions.find(
                                            (option) => option.value === field.value
                                        )}
                                        onChange={(option) => field.onChange(option?.value)}
                                        isDisabled={isLoading}
                                        isClearable
                                        isSearchable
                                        placeholder="Seleccione un trabajador"
                                        className="basic-single text-sm"
                                        classNamePrefix="select"
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderWidth: "0.5px",
                                                borderColor: state.isFocused ? "black" : "#e2e8f0",
                                                boxShadow: "none",
                                                fontSize: "0.875rem",
                                                "&:hover": {
                                                    borderColor: "black",
                                                    borderWidth: "0.5px",
                                                },
                                            }),
                                            option: (baseStyles, state) => ({
                                                ...baseStyles,
                                                fontSize: "0.875rem",
                                                backgroundColor: state.isSelected
                                                    ? "#f3f4f6"
                                                    : state.isFocused
                                                        ? "#f9fafb"
                                                        : "white",
                                                "&:hover": {
                                                    backgroundColor: "#f3f4f6",
                                                },
                                            }),
                                            placeholder: (baseStyles) => ({
                                                ...baseStyles,
                                                fontSize: "0.875rem",
                                                color: "black",
                                            }),
                                            singleValue: (baseStyles) => ({
                                                ...baseStyles,
                                                fontSize: "0.875rem",
                                                color: "black",
                                            }),
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm"/>
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