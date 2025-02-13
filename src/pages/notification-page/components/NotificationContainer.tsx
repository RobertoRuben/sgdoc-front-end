import { useState, useEffect } from "react";
import { Notificacion } from "@/model/notification";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationCard } from "./NotificationCard";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import { getNotificationsByAreaId, markNotificationAsRead } from "@/service/notificactionService";

export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });
  const [success, setSuccess] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const areaId = sessionStorage.getItem("areaId");
      
      if (!areaId) {
        throw new Error("ID de área no encontrado en sesión");
      }
      
      const areaIdNumber = parseInt(areaId, 10);
      if (isNaN(areaIdNumber)) {
        throw new Error("ID de área no válido");
      }

      const data = await getNotificationsByAreaId(areaIdNumber);
      setNotifications(data);
    } catch (err) {
      let errorMessage = "Error al cargar las notificaciones";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError({
        isOpen: true,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, leido: true } : notif
        )
      );
      setSuccess({
        isOpen: true,
        message: "Notificación marcada como leída",
      });
    } catch (err) {
      let errorMessage = "Error al marcar la notificación como leída";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError({
        isOpen: true,
        message: errorMessage,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.leido);
      const unreadIds = unreadNotifications.map(notif => notif.id).filter((id): id is number => id !== undefined);
      
      await Promise.all(unreadIds.map(id => markNotificationAsRead(id)));
      
      // Actualizar estado local después de éxito
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({ ...notif, leido: true }))
      );
      
      setSuccess({
        isOpen: true,
        message: "Todas las notificaciones marcadas como leídas",
      });
    } catch (err) {
      let errorMessage = "Error al marcar las notificaciones como leídas";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError({
        isOpen: true,
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <NotificationHeader onMarkAllAsRead={handleMarkAllAsRead} />

      <div className="w-full bg-gray-50 rounded-lg shadow-lg p-4">
        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <LoadingSpinner
              size="lg"
              message="Cargando notificaciones..."
              color="#145A32"
              backgroundColor="rgba(20, 90, 50, 0.2)"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
            {notifications.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No hay notificaciones pendientes
              </div>
            )}
          </div>
        )}
      </div>

      <ErrorModal
        isOpen={error.isOpen}
        onClose={() => setError(prev => ({ ...prev, isOpen: false }))}
        title="Error"
        errorMessage={error.message}
      />

      <SuccessModal
        isOpen={success.isOpen}
        onClose={() => setSuccess(prev => ({ ...prev, isOpen: false }))}
        title="Éxito"
        message={success.message}
      />
    </div>
  );
};