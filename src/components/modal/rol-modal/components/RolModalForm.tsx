// rol-modal-form.tsx
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
import { Rol } from "@/model/rol";
import { RolModalFooter } from "./RolModalFooter";

const formSchema = z.object({
    nombre: z
        .string()
        .min(2, { message: "El nombre del rol debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El nombre del rol solo debe contener letras" }),
});

interface RolModalFormProps {
    rol?: Rol;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Rol) => void;
}

export const RolModalForm: React.FC<RolModalFormProps> = ({
                                                              rol,
                                                              isEditing,
                                                              onClose,
                                                              onSubmit,
                                                          }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
        },
    });

    useEffect(() => {
        if (rol) {
            form.reset({
                nombre: rol.nombreRol,
            });
        }
    }, [rol, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const rolData: Rol = {
            id: rol?.id || 0,
            nombreRol: values.nombre,
        };
        await onSubmit(rolData);
        onClose();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Rol</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ingrese el nombre del rol"
                                    {...field}
                                    className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <RolModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};