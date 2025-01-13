// components/TrabajadoresModalForm.tsx
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
import { Trabajador } from "@/model/trabajador";
import { Area } from "@/model/area";
import { TrabajadorModalFooter} from "@/components/modal/trabajador-modal/components/TrabajadorModalFooter";

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

interface TrabajadoresModalFormProps {
    trabajador?: Trabajador;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Trabajador) => void;
    areas: Area[];
}

export const TrabajadorModalForm: React.FC<TrabajadoresModalFormProps> = ({trabajador, isEditing, onClose, onSubmit, areas,}) => {
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
        if (trabajador) {
            form.reset({
                dni: trabajador.dni.toString(),
                nombre: trabajador.nombres,
                apellidoPaterno: trabajador.apellidoPaterno,
                apellidoMaterno: trabajador.apellidoMaterno,
                genero: trabajador.genero as "Masculino" | "Femenino" | "Otro",
                areaId: trabajador.areaId,
            });
        }
    }, [trabajador, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
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
        onClose();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
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
                <TrabajadorModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};