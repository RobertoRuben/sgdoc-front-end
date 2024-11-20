// src/components/layout/Header.tsx
'use client';

import { ReactNode } from 'react';
import { Bell, LogOut, Menu, User, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type HeaderProps = {
    onOpenSidebar: () => void;
    title: ReactNode;
    notificationCount: number;
    onViewNotifications: () => void;
};

export function Header({ onOpenSidebar, title, notificationCount, onViewNotifications }: HeaderProps) {
    return (
        <header className="bg-[#2F2F2F] text-white py-4 px-6 shadow-md w-full">
            <div className="flex items-center justify-between">
                <button
                    onClick={onOpenSidebar}
                    className="lg:hidden mr-4 text-white hover:text-[#E0E0E0] transition-colors duration-200"
                    aria-label="Abrir menú"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex-1 flex items-center">
                    {title}
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
                                <Bell className="h-5 w-5" />
                                {notificationCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-[#03A64A] text-white rounded-full">
                                        {notificationCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mt-2 bg-white">
                            <DropdownMenuItem onClick={onViewNotifications} className="text-[#333333] hover:bg-[#F2F2F2] flex items-center">
                                <Bell className="mr-2 h-4 w-4" />
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
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mt-2 bg-white">
                            <DropdownMenuItem className="text-[#333333] hover:bg-[#F2F2F2] flex items-center">
                                <UserCircle className="mr-2 h-4 w-4" />
                                Mi Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[#333333] hover:bg-[#F2F2F2] flex items-center">
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
