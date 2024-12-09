'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast.ts"
import { AuthCredentials } from "@/model/authCredentials"
import logo from '../../assets/mda-logo.png'
import fondoLogin from '../../assets/fondo-login-folders.jpg'

export default function LoginForm() {
    const [credentials, setCredentials] = useState<AuthCredentials>({
        nombreUsuario: '',
        password: ''
    })

    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log('Credenciales:', credentials)

        if (credentials.nombreUsuario === 'admin' && credentials.password === 'password') {
            console.log('Inicio de sesión exitoso')
            try {

                toast({
                    title: "Inicio de sesión exitoso",
                    description: "Bienvenido al sistema SGDOC",
                })
            } catch (error) {
                console.error('Error al mostrar el toast:', error)
            }
        } else {
            console.log('Error de autenticación')
            try {

                toast({
                    title: "Error de autenticación",
                    description: "Nombre de usuario o contraseña incorrectos",
                    variant: "destructive",
                })
            } catch (error) {
                console.error('Error al mostrar el toast:', error)
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Fondo con animación */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${fondoLogin})`,
                    filter: "brightness(0.6)"
                }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#03A64A]/80 to-black/80 z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.7,
                    ease: "easeOut",
                }}
                className="w-full max-w-md z-20"
            >
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="text-center mb-8">
                            {/* Animación logo */}
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 35,
                                }}
                                src={logo}
                                alt="Logo de la institución"
                                className="mx-auto h-40 w-auto mb-4"
                            />

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                                className="text-3xl font-bold text-[#03A64A]"
                            >
                                SGDOC
                            </motion.h2>
                        </div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="nombreUsuario" className="text-gray-800">Nombre de Usuario</Label>
                                <Input
                                    id="nombreUsuario"
                                    name="nombreUsuario"
                                    type="text"
                                    value={credentials.nombreUsuario}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-800">Contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#03A64A] hover:bg-[#028a3d] text-white"
                            >
                                Iniciar sesión
                            </Button>
                        </motion.form>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
