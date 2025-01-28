'use client';

import { ReactNode, useState } from 'react';
import { Bell, LogOut, Menu, User, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UsuarioProfileModal } from '../modal/usuario-modal/usuario-perfil-modal/UsuarioPerfilModal';
import LogoutModal from '../modal/alerts/logout-modal/LogoutModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const mockUser = {
    id: 1,
    nombreUsuario: "usuario.demo",
    contrasena: "",
    rolNombre: "Administrador",
    trabajadorNombre: "Juan Pérez"
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
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handlePasswordChange = (newPassword: string) => {
        console.log('Cambio de contraseña:', newPassword);
        setIsProfileModalOpen(false);
        onModalStateChange(false);
    };

    const handleProfileModalOpen = () => {
        setIsProfileModalOpen(true);
        onModalStateChange(true);
    };

    const handleProfileModalClose = () => {
        setIsProfileModalOpen(false);
        onModalStateChange(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            handleLogoutModalClose();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleLogoutModalClose = () => {
        setIsLogoutModalOpen(false);
        onModalStateChange(false);
    };

    const handleLogoutModalOpen = () => {
        setIsLogoutModalOpen(true);
        onModalStateChange(true);
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

            <UsuarioProfileModal
                isOpen={isProfileModalOpen}
                onClose={handleProfileModalClose}
                user={mockUser}
                onPasswordChange={handlePasswordChange}
            />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={handleLogoutModalClose}
                onConfirm={handleLogout}
            />
        </>
    );
}