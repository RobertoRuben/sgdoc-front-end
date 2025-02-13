import { useState, useEffect } from "react";
import { Notificacion } from "@/model/notification";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationCard } from "./NotificationCard";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";

const mockNotifications: Notificacion[] = [
  {
    id: 1,
    comentario: "Se ha creado un nuevo documento en el área de Administración",
    areaDestinoId: 1,
    leido: false,
    fechaCreacion: new Date(2024, 1, 13, 10, 30)
  },
  {
    id: 2,
    comentario: "El documento #123 ha sido actualizado por Juan Pérez",
    areaDestinoId: 2,
    leido: false,
    fechaCreacion: new Date(2024, 1, 13, 9, 15)
  },
  {
    id: 3,
    comentario: "Se requiere su revisión en el documento #456",
    areaDestinoId: 1,
    leido: true,
    fechaCreacion: new Date(2024, 1, 12, 15, 45)
  },
  {
    id: 4,
    comentario: "María González ha compartido un documento con su departamento",
    areaDestinoId: 3,
    leido: false,
    fechaCreacion: new Date(2024, 1, 12, 14, 20)
  },
  {
    id: 5,
    comentario: "El documento #789 está pendiente de aprobación",
    areaDestinoId: 2,
    leido: false,
    fechaCreacion: new Date(2024, 1, 11, 16, 0)
  }
];

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
      // Simulamos una llamada a API con un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
    } catch (err) {
      setError({
        isOpen: true,
        message: "Error al cargar las notificaciones",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      // Aquí iría la llamada al servicio para marcar como leída
      // await markNotificationAsRead(id);
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
      setError({
        isOpen: true,
        message: "Error al marcar la notificación como leída",
      });
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Aquí iría la llamada al servicio para marcar todas como leídas
      // await markAllNotificationsAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({ ...notif, leido: true }))
      );
      setSuccess({
        isOpen: true,
        message: "Todas las notificaciones han sido marcadas como leídas",
      });
    } catch (err) {
      setError({
        isOpen: true,
        message: "Error al marcar las notificaciones como leídas",
      });
      console.error(err);
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
        onClose={() => setError({ ...error, isOpen: false })}
        title="Error"
        errorMessage={error.message}
      />

      <SuccessModal
        isOpen={success.isOpen}
        onClose={() => setSuccess({ ...success, isOpen: false })}
        title="Éxito"
        message={success.message}
      />
    </div>
  );
};