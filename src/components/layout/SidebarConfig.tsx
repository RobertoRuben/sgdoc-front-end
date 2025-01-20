import {
    Home,
    Users,
    Briefcase,
    FileText,
    MapPin,
    Settings,
    UserPlus,
    UserCheck,
    ChartColumnIcon,
    InboxIcon
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
        allowedRoles: ['Admin', 'Mesa de Partes'],
    },
    {
        name: "Dashboard",
        icon: ChartColumnIcon,
        path: "/dashboard",
        allowedRoles: ['Admin'],
    },
    {
        name: "Mesa de Partes",
        icon: InboxIcon,
        allowedRoles: ['Admin', 'Mesa de Partes'],
        subItems: [
            { name: "Ingreso de Documentos", path: "/mesa-partes/ingreso" }
        ],
    },
    {
        name: "Documentos",
        path: "/documentos",
        icon: FileText,
        allowedRoles: ['Admin', 'Mesa de Partes'],
        subItems: [
            { name: "Lista de Documentos", path: "/documentos/lista" },
            { name: "Seguimiento", path: "/documentos/seguimiento/lista" },
            { name: "Categorias", path: "/documentos/categorias/lista" },
            { name: "Ambitos", path: "/documentos/ambitos/lista" },
        ],
    },
    {
        name: "Remitentes",
        icon: UserPlus,
        path: "/remitentes/lista",
        allowedRoles: ['Admin'],
    },
    {
        name: "Distrito",
        icon: MapPin,
        allowedRoles: ['Admin'],
        subItems: [
            { name: "Centros Poblados", path: "/distrito/centros-poblados/lista" },
            { name: "Caseríos", path: "/distrito/caserios/lista" },
        ],
    },
    {
        name: "Áreas",
        icon: Briefcase,
        allowedRoles: ['Admin'],
        subItems: [
            { name: "Lista de Áreas", path: "/areas/lista" },
            { name: "Comunicaciones", path: "/areas/comunicaciones/lista" },
        ]
    },
    {
        name: "Trabajadores",
        icon: UserCheck,
        path: "/trabajadores/lista",
        allowedRoles: ['Admin'],
    },
    {
        name: "Usuarios",
        icon: Users,
        allowedRoles: ['Admin'],
        subItems: [
            { name: "Lista de Usuarios", path: "/usuarios/lista" },
            { name: "Roles", path: "/usuarios/roles/lista" },
        ],
    },
    {
        name: "Configuración",
        icon: Settings,
        path: "/configuracion",
        allowedRoles: ['Admin'],
    },
];
