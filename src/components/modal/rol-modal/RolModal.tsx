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
import { Rol } from "@/model/rol";
import { Edit, Plus, Save, XCircle } from "lucide-react";

const formSchema = z.object({
    nombre: z.string()
        .min(2, { message: "El nombre del rol debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El nombre del rol solo debe contener letras" }),
});

interface RolModalProps {
    isOpen: boolean;
    rol?: Rol;
    onClose: () => void;
    onSubmit: (data: Rol) => void;
}

export function RolModal({ isOpen, rol, onClose, onSubmit }: RolModalProps) {
    const isEditing = rol?.id && rol.id > 0;

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
        } else {
            form.reset({
                nombre: "",
            });
        }
    }, [rol, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const rolData: Rol = {
            id: rol?.id || 0,
            nombreRol: values.nombre,
        };
        await onSubmit(rolData);
        handleClose();
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

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
                        {isEditing ? "Editar Rol" : "Registrar Rol"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-emerald-100">
                        {isEditing
                            ? "Modifica los datos del rol en el formulario a continuación."
                            : "Complete el formulario para registrar un nuevo rol."}
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
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