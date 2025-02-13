"use client";

import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Footer } from "./Footer";
import ContentHeader from "./ContentHeader";
import { useLocation, useNavigate, Outlet } from "react-router-dom"; // <-- Importa useNavigate
import { navItems } from "./SidebarConfig";
import { getBreadcrumb } from "@/utils/getBreadcrumb";
import { useLoading } from "@/context/LoadingContext";
import LoadingSpinner from "./LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import { getDocumentosNoConfirmados } from "@/service/documentoService";
import { useAreaNotifications } from "@/hooks/useAreaNotifications";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); 
  const [notificationCount, setNotificationCount] = useState(0);
  const [unconfirmedCount, setUnconfirmedCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate(); // <-- Define navigate
  const { isLoading, setLoading } = useLoading();

  const handleNewNotification = () => {
    setNotificationCount((prev) => prev + 1);
  };

  useAreaNotifications({ onNewNotification: handleNewNotification });

  const breadcrumb = useMemo(
    () => getBreadcrumb(location.pathname, navItems),
    [location.pathname]
  );

  // Función para navegar a la página de notificaciones
  const handleViewNotifications = () => {
    navigate("/notificaciones");
  };

  const excludedRoutes = ["/inicio", "/dashboard"];
  const shouldShowContentHeader = !excludedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart();
    handleComplete();
  }, [location, setLoading]);

  useEffect(() => {
    const fetchUnconfirmedCount = async () => {
      try {
        const areaId = Number(sessionStorage.getItem('areaId'));
        if (areaId) {
          const response = await getDocumentosNoConfirmados(areaId);
          setUnconfirmedCount(response.totalDocumentosNoConfirmados);
        }
      } catch (error) {
        console.error("Error obteniendo documentos no confirmados:", error);
      }
    };
  
    fetchUnconfirmedCount();
  }, []);

  const headerTitle = location.pathname === "/inicio" ? "Bienvenido" : "SGDOC";

  return (
    <div
      className={`flex h-screen overflow-hidden bg-gray-100 ${
        modalOpen ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        unconfirmedCount={unconfirmedCount}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          title={headerTitle}
          notificationCount={notificationCount}
          onViewNotifications={handleViewNotifications} // Pasa la función
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
