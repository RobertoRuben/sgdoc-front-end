import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FiGrid, FiEdit } from "react-icons/fi"
import { Area } from "@/model/area"

const formSchema = z.object({
    nombreArea: z.string().min(2, { message: "El nombre del área debe tener al menos 2 caracteres" }),
})

interface AreaRegistroModalProps {
    isOpen: boolean;
    area?: Area;
    onClose: () => void;
    onSubmit: (data: Area) => void;
}

export function AreaModal({ isOpen, area, onClose, onSubmit }: AreaRegistroModalProps) {
    const isEditing = area?.id && area.id > 0

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombreArea: "",
        },
    })

    useEffect(() => {
        if (area) {
            form.reset({
                nombreArea: area.nombreArea,
            })
        } else {
            form.reset({
                nombreArea: "",
            })
        }
    }, [area, form])

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const areaData: Area = {
            id: area?.id || 0,
            nombreArea: values.nombreArea,
        }
        await onSubmit(areaData)
        handleClose()
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-center space-x-2">
                        {isEditing ? (
                            <FiEdit className="text-primary text-2xl" />
                        ) : (
                            <FiGrid className="text-primary text-2xl" />
                        )}
                        <DialogTitle className="text-2xl font-semibold text-center">
                            {isEditing ? "Editar Área" : "Registrar Área"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-center text-muted-foreground mt-2">
                        {isEditing
                            ? "Modifica los datos del área en el formulario a continuación."
                            : "Complete el formulario para registrar una nueva área."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombreArea"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Área</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el nombre del área" {...field} />
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
    )
}