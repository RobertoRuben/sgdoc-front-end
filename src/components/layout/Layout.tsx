"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Footer } from "./Footer";
import ContentHeader from "./ContentHeader";
import { useLocation, Outlet } from "react-router-dom";
import { navItems } from "./SidebarConfig";
import { getBreadcrumb } from "@/utils/getBreadcrumb";
import { useLoading } from "@/context/LoadingContext";
import LoadingSpinner from "./LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";

// Importamos nuestro hook personalizado:
import { useAreaNotifications } from "@/hooks/useAreaNotifications";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); 
  const [notificationCount, setNotificationCount] = useState(0);

  const location = useLocation();
  const { isLoading, setLoading } = useLoading();

  // Incrementa el conteo de notificaciones al recibir un nuevo mensaje WebSocket
  const handleNewNotification = () => {
    setNotificationCount((prev) => prev + 1);
  };

  // Conecta al WebSocket si "areaId" existe. Evita reconexiones duplicadas.
  useAreaNotifications({ onNewNotification: handleNewNotification });

  // Genera el breadcrumb en base a la ruta
  const breadcrumb = useMemo(
    () => getBreadcrumb(location.pathname, navItems),
    [location.pathname]
  );

  const handleViewNotifications = () => {
    console.log("Depuración: Se hizo clic en 'Ver notificaciones'.");
    // Podrías resetear el contador a 0 aquí si deseas
    // setNotificationCount(0);
  };

  // Determina si se debe mostrar el ContentHeader
  const excludedRoutes = ["/inicio", "/dashboard"];
  const shouldShowContentHeader = !excludedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Manejo de transiciones de carga al navegar
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart();
    handleComplete();
  }, [location, setLoading]);

  // Determina el título del Header
  const headerTitle = location.pathname === "/inicio" ? "Bienvenido" : "SGDOC";

  return (
    <div
      className={`flex h-screen overflow-hidden bg-gray-100 ${
        modalOpen ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          title={headerTitle}
          notificationCount={notificationCount}
          onViewNotifications={handleViewNotifications}
          onModalStateChange={setModalOpen}
        />

        <MainContent>
          {shouldShowContentHeader && <ContentHeader breadcrumb={breadcrumb} />}
          <AnimatePresence>
            {isLoading && <LoadingSpinner />}
          </AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          )}
        </MainContent>

        <Footer />
      </div>
    </div>
  );
}