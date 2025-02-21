import { useEffect, useRef, useMemo } from "react";
import { Howl } from "howler";
import { toast } from "@/hooks/use-toast";

type UseAreaNotificationsProps = {
  onNewNotification: () => void;
};

export function useAreaNotifications({ onNewNotification }: UseAreaNotificationsProps) {
  const areaId = sessionStorage.getItem("areaId");
  const wsRef = useRef<WebSocket | null>(null);

  const notificationSound = useMemo(() => {
    return new Howl({
      src: ["/sounds/notification.wav"],
      volume: 0.5,
    });
  }, []);

  useEffect(() => {
    if (!areaId || wsRef.current) return;
    console.log("useAreaNotifications se monta / abre la conexión WebSocket.");
    const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;
    const wsUrl = `${wsBaseUrl}/notifications/${areaId}`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("Conectado al WebSocket de Notificaciones (Área: " + areaId + ")");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Mensaje WebSocket recibido:", data);

        if (data?.type === "NUEVA_NOTIFICACION") {
          onNewNotification();
          console.log("Reproduciendo sonido de notificación...");
          notificationSound.play();

          const notif = data.data;
          toast({
            title: "🔔 Nueva notificación",
            description: notif.comentario ?? "Sin descripción",
            className: "bg-yellow-100 border border-yellow-300 text-yellow-800",
          });
        }
      } catch (error) {
        console.error("Error parseando mensaje WebSocket:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socket.onclose = (ev) => {
      console.log("WebSocket de Notificaciones cerrado:", ev);
      wsRef.current = null;
    };

    return () => {
      console.log("Cleanup: cerrando WebSocket de Notificaciones...");
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [areaId, notificationSound, onNewNotification]);

  return null;
}