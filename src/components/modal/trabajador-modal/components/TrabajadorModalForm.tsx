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
import { TrabajadorModalFooter } from "@/components/modal/trabajador-modal/components/TrabajadorModalFooter";

const formSchema = z.object({
    dni: z.string().regex(/^\d{8}$/, { message: "DNI debe tener 8 dígitos" }),
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
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

interface TrabajadoresModalFormProps {
    trabajador?: Trabajador;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Trabajador) => Promise<void>;
    areas: Area[];
    isLoading?: boolean;
}

export const TrabajadorModalForm: React.FC<TrabajadoresModalFormProps> = ({trabajador, isEditing, onClose, onSubmit, areas, isLoading = false,}) => {
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
            dni: trabajador.dni.toString(),
            nombre: trabajador.nombres,
            apellidoPaterno: trabajador.apellidoPaterno,
            apellidoMaterno: trabajador.apellidoMaterno,
            genero: trabajador.genero as "Masculino" | "Femenino" | "Otro",
            areaId: trabajador.areaId?.toString().trim() || "",
        });
        form.setFocus("dni");
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
                                <FormLabel htmlFor="dni-input" >DNI</FormLabel>
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
                                <FormLabel >Nombre</FormLabel>
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
                                <FormLabel >Apellido Materno</FormLabel>
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
                                <FormLabel htmlFor="areaId-select">Área</FormLabel>
                                <Select
                                    name="areaId"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger id="areaId-select">
                                            <SelectValue placeholder="Seleccione área" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {areas.map((area) => (
                                            <SelectItem
                                                key={area.id ?? 0}
                                                value={(area.id ?? 0).toString().trim()}
                                            >
                                                {area.nombreArea}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-xs sm:text-sm" />
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

