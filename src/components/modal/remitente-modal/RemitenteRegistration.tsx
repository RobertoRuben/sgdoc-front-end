import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { Remitente } from "@/model/remitente.ts";
import { FiUserPlus, FiEdit } from "react-icons/fi"; // Importar íconos

const formSchema = z.object({
    dni: z.string().regex(/^\d{8}$/, { message: "DNI debe tener 8 dígitos" }),
    nombres: z.string().min(2, { message: "Nombres debe tener al menos 2 caracteres" }),
    apellidoPaterno: z.string().min(2, { message: "Apellido paterno debe tener al menos 2 caracteres" }),
    apellidoMaterno: z.string().min(2, { message: "Apellido materno debe tener al menos 2 caracteres" }),
    genero: z.enum(["Masculino", "Femenino", "Otro"], { required_error: "Debe seleccionar un género" }),
});

interface RemitentesModalProps {
    isOpen: boolean;
    remitente?: Remitente; // Objeto opcional para edición
    onClose: () => void;
    onSubmit: (data: Remitente) => void;
}

export function RemitentesModal({ isOpen, remitente, onClose, onSubmit }: RemitentesModalProps) {
    const isEditing = remitente?.id && remitente.id > 0; // Determinar si es edición o registro

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

    // Resetear valores del formulario al abrir el modal
    useEffect(() => {
        if (remitente) {
            // Cargar datos del remitente en caso de edición
            form.reset({
                dni: remitente.dni.toString(),
                nombres: remitente.nombres,
                apellidoPaterno: remitente.apellidoPaterno,
                apellidoMaterno: remitente.apellidoMaterno,
                genero: remitente.genero as "Masculino" | "Femenino" | "Otro",
            });
        } else {
            // Resetear el formulario para un nuevo registro
            form.reset({
                dni: "",
                nombres: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
                genero: undefined,
            });
        }
    }, [remitente, form]);

    // Cerrar el modal y resetear el formulario
    const handleClose = () => {
        form.reset({
            dni: "",
            nombres: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            genero: undefined,
        }); // Resetear valores vacíos
        onClose(); // Llamar a la función para cerrar el modal
    };

    function handleSubmit(values: z.infer<typeof formSchema>) {
        const data: Remitente = {
            id: remitente?.id || 0, // Agregar el ID si existe
            dni: parseInt(values.dni, 10), // Convertir DNI a número
            nombres: values.nombres,
            apellidoPaterno: values.apellidoPaterno,
            apellidoMaterno: values.apellidoMaterno,
            genero: values.genero,
        };
        onSubmit(data);
        handleClose(); // Cerrar y resetear después de enviar
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-center space-x-2">
                        {/* Ícono dinámico */}
                        {isEditing ? (
                            <FiEdit className="text-black-500 text-2xl" />
                        ) : (
                            <FiUserPlus className="text-black-500 text-2xl" />
                        )}
                        <DialogTitle className="text-2xl font-semibold text-center">
                            {isEditing ? "Editar Remitente" : "Registrar Remitente"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-center text-gray-600 mt-2">
                        {isEditing
                            ? "Modifica los datos del remitente en el formulario a continuación."
                            : "Completa el formulario para registrar un nuevo remitente."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                                        <Input placeholder="Ingrese apellido paterno" {...field} />
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
                                        <Input placeholder="Ingrese apellido materno" {...field} />
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
                                    <FormLabel>Género</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
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
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="bg-[#d82f2f] text-white hover:bg-[#991f1f] hover:text-white"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className={isEditing ? "bg-[#028a3b] hover:bg-[#027a33]" : "bg-[#028a3b] hover:bg-[#027a33]"}
                            >
                                {isEditing ? "Guardar Cambios" : "Registrar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
