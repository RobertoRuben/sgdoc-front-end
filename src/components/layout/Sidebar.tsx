// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { navItems, NavItem } from './SidebarConfig';
import logo from '../../assets/mda-logo.png';

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    const toggleMenu = (name: string) => {
        console.log(`Depuración: Alternando menú ${name}. Estado previo:`, openMenus[name]);
        setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    console.log('Depuración: Renderizando Sidebar con isOpen =', isOpen);

    return (
        <>
            {/* Overlay para pantallas pequeñas */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
                    onClick={() => {
                        console.log('Depuración: Haciendo clic en Overlay para cerrar Sidebar.');
                        onClose();
                    }}
                    aria-hidden="true"
                ></div>
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#03A64A] to-black text-white p-4 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-auto flex-shrink-0 flex flex-col h-full`}
                aria-label="Sidebar de navegación"
            >
                {/* Encabezado del Sidebar */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex justify-center items-center w-full">
                        <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
                    </div>
                    <button
                        onClick={() => {
                            console.log('Depuración: Haciendo clic en el botón de cerrar Sidebar.');
                            onClose();
                        }}
                        className="lg:hidden"
                        aria-label="Cerrar menú"
                    >
                        <X className="h-6 w-6"  strokeWidth={3}/>
                    </button>
                </div>

                {/* Contenido scrollable con barra de desplazamiento personalizada */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    <nav>
                        <ul className="space-y-2">
                            {navItems.map((item: NavItem, index: number) => (
                                <li key={index}>
                                    {item.subItems ? (
                                        <div>
                                            <button
                                                onClick={() => toggleMenu(item.name)}
                                                className="flex items-center justify-between w-full p-2 hover:bg-[#028a3b] rounded focus:outline-none font-semibold"
                                                aria-expanded={openMenus[item.name] || false}
                                            >
                                                <span className="flex items-center">
                                                    <item.icon className="w-5 h-5 mr-2" strokeWidth={3}/>
                                                    {item.name}
                                                </span>
                                                {openMenus[item.name] ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </button>
                                            {/* Submenú con animación */}
                                            <ul
                                                className={`ml-4 mt-2 space-y-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                                                    openMenus[item.name]
                                                        ? 'max-h-[9999px] opacity-100'
                                                        : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            to={subItem.path}
                                                            className="block p-2 hover:bg-[#028a3b] rounded"
                                                            onClick={() => {
                                                                console.log(`Depuración: Seleccionando subItem '${subItem.name}'.`);
                                                                onClose();
                                                            }}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.path || '#'}
                                            className="flex items-center p-2 hover:bg-[#028a3b] rounded font-semibold"
                                            onClick={() => {
                                                console.log(`Depuración: Seleccionando Item '${item.name}'.`);
                                                onClose();
                                            }}
                                        >
                                            <item.icon className="w-5 h-5 mr-2" strokeWidth={3} />
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}
