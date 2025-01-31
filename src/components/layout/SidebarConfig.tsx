// SidebarConfig.ts
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
    InboxIcon,
    Mail
} from 'lucide-react';
import React from 'react';

export type NavItem = {
    name: string;
    icon: React.ElementType;
    path?: string;
    subItems?: { 
        name: string; 
        path: string;
        allowedRoles?: string[];
    }[];
    allowedRoles?: string[];
};

export const navItems: NavItem[] = [
    {
        name: "Inicio",
        icon: Home,
        path: "/inicio",
        allowedRoles: ['Admin', 'Mesa de Partes', 'Alcalde'],
    },
    {
        name: "Dashboard",
        icon: ChartColumnIcon,
        path: "/dashboard",
        allowedRoles: ['Admin', 'Alcalde', 'Gerente Municipal'],
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
        name: "Bandeja de Entrada",
        path: "/bandeja-entrada",
        icon: Mail,
        subItems: [
            { 
                name: "Documentos Recibidos", 
                path: "/bandeja-entrada/recibidos",
                allowedRoles: ['Admin', 'Alcalde', 'Gerente Municipal', 'Subgerente'] 
            },
            { 
                name: "Documentos Enviados", 
                path: "/bandeja-entrada/enviados",
                allowedRoles: ['Admin', 'Alcalde', 'Gerente Municipal', 'Subgerente', 'Mesa de Partes'] 
            },
            { 
                name: "Documentos Rechazados", 
                path: "/bandeja-entrada/rechazados",
                allowedRoles: ['Admin', 'Alcalde', 'Gerente Municipal', 'Subgerente'] 
            },
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