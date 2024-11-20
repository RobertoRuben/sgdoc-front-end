// src/components/layout/SidebarConfig.tsx
import {
    Home,
    Users,
    Briefcase,
    FileText,
    MapPin,
    Settings,
    UserPlus,
    UserCheck,
    Search,
    ChartColumnIcon
} from 'lucide-react';
import React from 'react';

export type NavItem = {
    name: string;
    icon: React.ElementType;
    path?: string;
    subItems?: { name: string; path: string }[];
    allowedRoles?: string[];
};

export const navItems: NavItem[] = [
    {
        name: "Inicio",
        icon: Home,
        path: "/inicio",
        allowedRoles: ['Administrador', 'Director', 'Auxiliar', 'Psicologo'],
    },
    {
        name: "Consultas",
        icon: Search,
        path: "/consultas",
        allowedRoles: ['Administrador', 'Director', 'Auxiliar', 'Psicologo'],
    },
    {
        name: "Dashboard",
        icon: ChartColumnIcon,
        path: "/dashboard",
        allowedRoles: ['Administrador', 'Director', 'Auxiliar', 'Psicologo'],
    },
    {
        name: "Remitentes",
        icon: UserPlus,
        path: "/remitentes",
        allowedRoles: ['Administrador', 'Director', 'Auxiliar'],
    },
    {
        name: "Documentos",
        icon: FileText,
        allowedRoles: ['Administrador', 'Director', 'Auxiliar'],
        subItems: [
            { name: "Lista de Documentos", path: "/documentos/lista" },
            { name: "Derivaciones", path: "/documentos/derivaciones" },
            { name: "Estado de Documentos", path: "/documentos/estado" },
            { name: "Categorias", path: "/documentos/categorias" },
            { name: "Ambitos", path: "/documentos/ambitos" },
        ],
    },
    {
        name: "Distrito",
        icon: MapPin,
        allowedRoles: ['Administrador', 'Director'],
        subItems: [
            { name: "Centros Poblados", path: "/ubicaciones/centros-poblados" },
            { name: "Caseríos", path: "/ubicaciones/caserios" },
        ],
    },
    {
        name: "Usuarios",
        icon: Users,
        allowedRoles: ['Administrador'],
        subItems: [
            { name: "Lista de Usuarios", path: "/usuarios/lista" },
            { name: "Roles", path: "/usuarios/roles" },
        ],
    },
    {
        name: "Áreas",
        icon: Briefcase,
        path: "/areas",
        allowedRoles: ['Administrador', 'Director'],
        subItems: [
            { name: "Lista de Áreas", path: "/areas/lista" },
            { name: "Comunicaciones", path: "/areas/comunicacion" },
        ]
    },
    {
        name: "Trabajadores",
        icon: UserCheck,
        path: "/trabajadores",
        allowedRoles: ['Administrador', 'Director'],
    },
    {
        name: "Configuración",
        icon: Settings,
        path: "/configuracion",
        allowedRoles: ['Administrador'],
    },
];
