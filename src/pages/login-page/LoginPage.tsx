'use client'

import { useState } from 'react'
import { motion} from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AuthCredentials } from "@/model/authCredentials"
import { Loader2, Lock, User } from 'lucide-react'
import logo from '../../assets/mda-logo.png'
import fondoLogin from '../../assets/fondo-login-folders.jpg'

export default function LoginForm() {
    const [credentials, setCredentials] = useState<AuthCredentials>({
        nombreUsuario: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (credentials.nombreUsuario === 'admin' && credentials.password === 'password') {
            toast({
                title: "¡Bienvenido!",
                description: "Has iniciado sesión exitosamente en SGDOC",
                className: "bg-green-50 border-green-200",
            })
        } else {
            toast({
                title: "Error de autenticación",
                description: "Las credenciales ingresadas son incorrectas",
                variant: "destructive",
            })
        }

        setIsLoading(false)
    }

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background with parallax effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${fondoLogin})`,
                    filter: "brightness(0.6)"
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#03A64A]/80 to-black/80 z-10" />

            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="w-full max-w-md z-20"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                }}
                            >
                                <motion.img
                                    src={logo}
                                    alt="Logo de la institución"
                                    className="mx-auto h-40 w-auto mb-4"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.7 }}
                                className="text-3xl font-bold bg-gradient-to-r from-[#03A64A] to-[#028a3d] bg-clip-text text-transparent"
                            >
                                SGDOC
                            </motion.h2>
                        </div>

                        <motion.form
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="nombreUsuario" className="text-gray-800 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Nombre de Usuario
                                </Label>
                                <Input
                                    id="nombreUsuario"
                                    name="nombreUsuario"
                                    type="text"
                                    value={credentials.nombreUsuario}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/50 backdrop-blur-sm focus:ring-[#03A64A] focus:border-[#03A64A]"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="password" className="text-gray-800 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/50 backdrop-blur-sm focus:ring-[#03A64A] focus:border-[#03A64A]"
                                />
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#03A64A] hover:bg-[#028a3d] text-white transition-all duration-300 ease-out"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        'Iniciar sesión'
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}