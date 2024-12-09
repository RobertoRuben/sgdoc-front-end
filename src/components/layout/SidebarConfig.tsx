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
        path: "/remitentes/lista",
        allowedRoles: ['Administrador', 'Director', 'Auxiliar'],
    },
    {
        name: "Documentos",
        path: "/documentos",
        icon: FileText,
        allowedRoles: ['Administrador', 'Director', 'Auxiliar'],
        subItems: [
            { name: "Lista de Documentos", path: "/documentos/lista" },
            { name: "Derivaciones", path: "/documentos/derivaciones/lista" },
            { name: "Estado de Documentos", path: "/documentos/estado/lista" },
            { name: "Categorias", path: "/documentos/categorias/lista" },
            { name: "Ambitos", path: "/documentos/ambitos/lista" },
        ],
    },
    {
        name: "Distrito",
        icon: MapPin,
        allowedRoles: ['Administrador', 'Director'],
        subItems: [
            { name: "Centros Poblados", path: "/distrito/centros-poblados/lista" },
            { name: "Caseríos", path: "/distrito/caserios/lista" },
        ],
    },
    {
        name: "Usuarios",
        icon: Users,
        allowedRoles: ['Administrador'],
        subItems: [
            { name: "Lista de Usuarios", path: "/usuarios/lista" },
            { name: "Roles", path: "/usuarios/roles/lista" },
        ],
    },
    {
        name: "Áreas",
        icon: Briefcase,
        allowedRoles: ['Administrador', 'Director'],
        subItems: [
            { name: "Lista de Áreas", path: "/areas/lista" },
            { name: "Comunicaciones", path: "/areas/comunicaciones/lista" },
        ]
    },
    {
        name: "Trabajadores",
        icon: UserCheck,
        path: "/trabajadores/lista",
        allowedRoles: ['Administrador', 'Director'],
    },
    {
        name: "Configuración",
        icon: Settings,
        path: "/configuracion",
        allowedRoles: ['Administrador'],
    },
];
