import { useEffect}  from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Trabajador } from "@/model/trabajador"
import { Area } from "@/model/area"
import { FiUserPlus, FiEdit } from "react-icons/fi"

const formSchema = z.object({
    dni: z.string().regex(/^\d{8}$/, { message: "DNI debe tener 8 dígitos" }),
    nombre: z.string().min(2, { message: "Nombre debe tener al menos 2 caracteres" }),
    apellidoPaterno: z.string().min(2, { message: "Apellido paterno debe tener al menos 2 caracteres" }),
    apellidoMaterno: z.string().min(2, { message: "Apellido materno debe tener al menos 2 caracteres" }),
    genero: z.enum(["Masculino", "Femenino", "Otro"], { required_error: "Debe seleccionar un género" }),
    areaId: z.number({ required_error: "Debe seleccionar un área" }),
})

interface TrabajadoresModalProps {
    isOpen: boolean
    trabajador?: Trabajador
    onClose: () => void
    onSubmit: (data: Trabajador) => void
    areas: Area[]
}

export function TrabajadoresModal({ isOpen, trabajador, onClose, onSubmit, areas }: TrabajadoresModalProps) {
    const isEditing = trabajador?.id && trabajador.id > 0

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
    })

    useEffect(() => {
        if (isOpen) {
            if (trabajador) {
                form.reset({
                    dni: trabajador.dni.toString(),
                    nombre: trabajador.nombres,
                    apellidoPaterno: trabajador.apellidoPaterno,
                    apellidoMaterno: trabajador.apellidoMaterno,
                    genero: trabajador.genero as "Masculino" | "Femenino" | "Otro",
                    areaId: trabajador.areaId,
                })
            } else {
                form.reset({
                    dni: "",
                    nombre: "",
                    apellidoPaterno: "",
                    apellidoMaterno: "",
                    genero: undefined,
                    areaId: undefined,
                })
            }
        }
    }, [isOpen, trabajador, form])

    const handleClose = () => {
        form.reset()
        onClose()
    }

    function handleSubmit(values: z.infer<typeof formSchema>) {
        const data: Trabajador = {
            id: trabajador?.id || 0,
            dni: parseInt(values.dni, 10),
            nombres: values.nombre,
            apellidoPaterno: values.apellidoPaterno,
            apellidoMaterno: values.apellidoMaterno,
            genero: values.genero,
            areaId: values.areaId,
        }
        onSubmit(data)
        handleClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-center space-x-2">
                        {isEditing ? (
                            <FiEdit className="text-black-500 text-2xl" />
                        ) : (
                            <FiUserPlus className="text-black-500 text-2xl" />
                        )}
                        <DialogTitle className="text-2xl font-semibold text-center">
                            {isEditing ? "Editar Trabajador" : "Registrar Trabajador"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-center text-gray-600 mt-2">
                        {isEditing
                            ? "Modifica los datos del trabajador en el formulario a continuación."
                            : "Completa el formulario para registrar un nuevo trabajador."}
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
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese nombre" {...field} />
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
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value}>
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
                        <FormField
                            control={form.control}
                            name="areaId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Área</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value ? String(field.value) : ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione área" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {areas.map(area => (
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
                                className="bg-[#028a3b] hover:bg-[#027a33]"
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
