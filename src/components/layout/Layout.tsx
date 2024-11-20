// src/components/layout/Layout.tsx
'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { Footer } from './Footer';
import ContentHeader from './ContentHeader';
import { useLocation, Outlet } from 'react-router-dom';
import { navItems } from './SidebarConfig';
import { getBreadcrumb } from '../../utils/getBreadcrumb';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationCount] = useState(0);
    const location = useLocation();

    // Generar el breadcrumb basado en la ruta actual
    const breadcrumb = useMemo(
        () => getBreadcrumb(location.pathname, navItems),
        [location.pathname, navItems]
    );

    // Ya no necesitamos sectionTitle
    // const sectionTitle = breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].name : '';

    const handleViewNotifications = () => {
        console.log("Depuración: Se hizo clic en 'Ver notificaciones'.");
        // Implementa la lógica para ver notificaciones
    };


    // Definir las rutas donde no se debe mostrar ContentHeader
    const excludedRoutes = ['/inicio', '/dashboard'];

    // Determinar si la ruta actual está en las rutas excluidas o es una subruta de ellas
    const shouldShowContentHeader = !excludedRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <Header
                    onOpenSidebar={() => {
                        console.log("Depuración: Abriendo Sidebar.");
                        setSidebarOpen(true);
                    }}
                    title="SGDOC"
                    notificationCount={notificationCount}
                    onViewNotifications={handleViewNotifications}
                />

                {/* Main Content with Conditional ContentHeader */}
                <MainContent>
                    {/* Solo renderizar ContentHeader si la ruta no está excluida */}
                    {shouldShowContentHeader && (
                        <ContentHeader
                            breadcrumb={breadcrumb}
                            // Eliminamos sectionTitle y onButtonClick
                            // sectionTitle={sectionTitle}
                            // onButtonClick={handleButtonClick}
                        />
                    )}
                    {/* Renderiza las rutas hijas aquí */}
                    <Outlet />
                </MainContent>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
