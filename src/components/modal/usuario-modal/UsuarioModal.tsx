"use client"

import * as React from "react"
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Usuario } from "@/model/usuario"

// Esquema según la interfaz Usuario
const schema = z.object({
    nombreUsuario: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" }),
    contrasena: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    rolId: z.number().int().positive({ message: "Debe seleccionar un rol válido" }),
    trabajadorId: z.number().int().positive({ message: "Debe seleccionar un trabajador válido" }),
})

const trabajadores = [
    { value: 1, label: "Juan Pérez" },
    { value: 2, label: "María García" },
    { value: 3, label: "Carlos López" },
    { value: 4, label: "Ana Martínez" },
    { value: 5, label: "Luis Rodríguez" },
]

interface RegistroUsuarioModalProps {
    isOpen: boolean;
    usuario?: Usuario; // Se recibe un Usuario directamente
    onClose: () => void;
    onSubmit: (data: Usuario) => void;
}

export function RegistroUsuarioModal({ isOpen, usuario, onClose, onSubmit }: RegistroUsuarioModalProps) {
    const [popoverOpen, setPopoverOpen] = React.useState(false)

    const { control, register, handleSubmit, formState: { errors }, setValue } = useForm<Usuario>({
        resolver: zodResolver(schema),
        defaultValues: usuario ? usuario : {
            nombreUsuario: "",
            contrasena: "",
            rolId: 1, // Un valor por defecto
            trabajadorId: 1, // Un valor por defecto
        }
    })

    const handleFormSubmit: SubmitHandler<Usuario> = (data) => {
        onSubmit(data)
    }

    const isEditing = usuario?.id ? true : false;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-center space-x-2">
                        <UserPlus className="h-6 w-6 text-black-500" />
                        <DialogTitle className="text-2xl font-semibold text-center">
                            {isEditing ? "Editar Usuario" : "Registrar Usuario"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-center text-gray-600 mt-2">
                        Complete la información para {isEditing ? "editar" : "registrar"} el usuario.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nombreUsuario">
                                Nombre de Usuario
                            </Label>
                            <Input
                                id="nombreUsuario"
                                {...register("nombreUsuario")}
                                aria-invalid={errors.nombreUsuario ? "true" : "false"}
                            />
                            {errors.nombreUsuario && (
                                <p className="text-sm text-red-500">
                                    {errors.nombreUsuario.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contrasena">
                                Contraseña
                            </Label>
                            <Input
                                id="contrasena"
                                type="password"
                                {...register("contrasena")}
                                aria-invalid={errors.contrasena ? "true" : "false"}
                            />
                            {errors.contrasena && (
                                <p className="text-sm text-red-500">
                                    {errors.contrasena.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rolId">
                                Rol
                            </Label>
                            <Select onValueChange={(value) => setValue("rolId", parseInt(value))} defaultValue={String(usuario?.rolId ?? 1)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Administrador</SelectItem>
                                    <SelectItem value="2">Usuario</SelectItem>
                                    <SelectItem value="3">Invitado</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.rolId && (
                                <p className="text-sm text-red-500">
                                    {errors.rolId.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="trabajadorId">
                                Trabajador
                            </Label>
                            <Controller
                                name="trabajadorId"
                                control={control}
                                render={({ field }) => (
                                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={popoverOpen}
                                                className="w-full justify-between"
                                            >
                                                {field.value
                                                    ? trabajadores.find((t) => t.value === field.value)?.label
                                                    : "Seleccione un trabajador"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar trabajador..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontró ningún trabajador.</CommandEmpty>
                                                    <CommandGroup>
                                                        {trabajadores.map((trabajador) => (
                                                            <CommandItem
                                                                key={trabajador.value}
                                                                value={String(trabajador.value)}
                                                                onSelect={(currentValue) => {
                                                                    const numValue = parseInt(currentValue, 10)
                                                                    field.onChange(numValue)
                                                                    setPopoverOpen(false)
                                                                }}
                                                            >
                                                                {trabajador.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        field.value === trabajador.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.trabajadorId && (
                                <p className="text-sm text-red-500">
                                    {errors.trabajadorId.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="bg-[#d82f2f] text-white hover:bg-[#991f1f] hover:text-white"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#028a3b] hover:bg-[#027a33] text-white"
                        >
                            {isEditing ? "Guardar Cambios" : "Registrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
