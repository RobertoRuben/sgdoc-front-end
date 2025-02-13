"use client";

import { ReactNode, useState } from 'react';
import { Bell, LogOut, Menu, User, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {UsuarioProfileModal} from "@/components/modal/usuario-modal/usuario-perfil-modal/UsuarioPerfilModal.tsx";
import LogoutModal from '../modal/alerts/logout-modal/LogoutModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import SuccessModal from '@/components/modal/alerts/success-modal/SuccessModal';
import ErrorModal from '@/components/modal/alerts/error-modal/ErrorModal';

import { getUsuarioById, updateUsuarioPassword } from '@/service/usuarioService';
import { Usuario } from '@/model/usuario';
import { UsuarioProfile } from '@/model/usuarioProfile';

const defaultUserProfile: UsuarioProfile = {
    id: 0,
    nombreUsuario: "",
    rolNombre: "",
    contrasena: "",
    trabajadorNombre: ""
};

type HeaderProps = {
    onOpenSidebar: () => void;
    title: ReactNode;
    notificationCount: number;
    onViewNotifications: () => void;
    onModalStateChange: (isOpen: boolean) => void;
};

export function Header({
                           onOpenSidebar,
                           title,
                           notificationCount,
                           onViewNotifications,
                           onModalStateChange,
                       }: HeaderProps) {
    const { logout } = useAuth();

    // Estados para abrir/cerrar modales
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Estado para almacenar la data del usuario a mostrar en el modal
    const [userProfile, setUserProfile] = useState<UsuarioProfile | null>(null);

    // Estados para mostrar modales de Éxito y Error
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("¡Contraseña actualizada correctamente!");

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleProfileModalOpen = async () => {
        try {
            const userIdStr = sessionStorage.getItem("userId");
            const rolName = sessionStorage.getItem("rolName");

            if (!userIdStr) {
                throw new Error("No se encontró userId en sessionStorage");
            }

            const userId = parseInt(userIdStr, 10);
            const userFromApi: Usuario = await getUsuarioById(userId);

            const userProfileData: UsuarioProfile = {
                id: userFromApi.id ?? 0,
                nombreUsuario: userFromApi.nombreUsuario,
                rolNombre: rolName || userFromApi.rolNombre || "",
                contrasena: userFromApi.contrasena || "",
                trabajadorNombre: userFromApi.trabajadorNombre || ""
            };

            setUserProfile(userProfileData);
            setIsProfileModalOpen(true);
            onModalStateChange(true);
        } catch (error: unknown) {
            console.error("Error al obtener el usuario:", error);
            const message = error instanceof Error ? error.message : "Ocurrió un error al obtener datos del usuario.";
            setErrorMessage(message);
            setIsErrorModalOpen(true);
        }
    };

    const handleProfileModalClose = () => {
        setIsProfileModalOpen(false);
        onModalStateChange(false);
    };

    const handlePasswordChange = async (newPassword: string) => {
        try {
            if (!userProfile?.id) {
                throw new Error("No existe un ID de usuario válido para actualizar contraseña.");
            }

            await updateUsuarioPassword(userProfile.id, newPassword);

            setSuccessMessage("¡Tu contraseña ha sido actualizada exitosamente!");
            setIsSuccessModalOpen(true);

            setIsProfileModalOpen(false);
            onModalStateChange(false);
        } catch (error: unknown) {
            console.error("Error al actualizar contraseña:", error);
            const message = error instanceof Error ? error.message : "Error al actualizar la contraseña.";
            setErrorMessage(message);
            setIsErrorModalOpen(true);
        }
    };

    const handleLogoutModalOpen = () => {
        setIsLogoutModalOpen(true);
        onModalStateChange(true);
    };

    const handleLogoutModalClose = () => {
        setIsLogoutModalOpen(false);
        onModalStateChange(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            handleLogoutModalClose();
        } catch (error: unknown) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <>
            <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-4 px-6 shadow-md w-full">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onOpenSidebar}
                        className="lg:hidden mr-4 text-white hover:text-[#E0E0E0] transition-colors duration-200"
                        aria-label="Abrir menú"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex-1 flex items-center">
                        <span className="font-bold text-lg">{title}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Notificaciones"
                                    className="relative text-white hover:bg-[#4F4F4F] transition-colors duration-200"
                                >
                                    <Bell className="h-5 w-5" strokeWidth={3} />
                                    {notificationCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-[#03A64A] text-white rounded-full">
                                            {notificationCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="mt-2 bg-white">
                                <DropdownMenuItem
                                    onClick={onViewNotifications}
                                    className="text-[#333333] hover:bg-[#F2F2F2] flex items-center"
                                >
                                    <Bell className="mr-2 h-4 w-4" strokeWidth={3} />
                                    Ver notificaciones
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Perfil de usuario"
                                    className="text-white hover:bg-[#4F4F4F] transition-colors duration-200"
                                >
                                    <User className="h-5 w-5" strokeWidth={3} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="mt-2 bg-white">
                                <DropdownMenuItem
                                    onClick={handleProfileModalOpen}
                                    className="text-[#333333] hover:bg-[#F2F2F2] flex items-center"
                                >
                                    <UserCircle className="mr-2 h-4 w-4" strokeWidth={3} />
                                    Mi Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogoutModalOpen}
                                    className="text-[#333333] hover:bg-[#F2F2F2] flex items-center"
                                >
                                    <LogOut className="mr-2 h-4 w-4" strokeWidth={3} />
                                    Cerrar sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Modal del Perfil */}
            <UsuarioProfileModal
                isOpen={isProfileModalOpen}
                onClose={handleProfileModalClose}
                user={userProfile || defaultUserProfile}
                onPasswordChange={handlePasswordChange}
            />

            {/* Modal de Logout */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={handleLogoutModalClose}
                onConfirm={handleLogout}
            />

            {/* Modal de Éxito */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Operación Exitosa"
                message={successMessage}
            />

            {/* Modal de Error */}
            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                errorMessage={errorMessage}
            />
        </>
    );
}
