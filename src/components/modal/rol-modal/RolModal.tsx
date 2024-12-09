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
import { FiUser, FiEdit } from "react-icons/fi";
import { Rol } from "@/model/rol";

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-center space-x-2">
                        {isEditing ? (
                            <FiEdit className="text-primary text-2xl" />
                        ) : (
                            <FiUser className="text-primary text-2xl" />
                        )}
                        <DialogTitle className="text-2xl font-semibold text-center">
                            {isEditing ? "Editar Rol" : "Registrar Rol"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-center text-muted-foreground mt-2">
                        {isEditing
                            ? "Modifica los datos del rol en el formulario a continuación."
                            : "Complete el formulario para registrar un nuevo rol."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Rol</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el nombre del rol" {...field} />
                                    </FormControl>
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