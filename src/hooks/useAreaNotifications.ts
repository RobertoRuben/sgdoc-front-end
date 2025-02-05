import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast"; // Ajusta la importación a donde tengas tu "useToast" o "toast"

/**
 * Hook para conectarse al WebSocket de notificaciones
 * usando el 'areaId' almacenado en sessionStorage.
 */
export function useAreaNotifications() {
  // 1. Obtenemos el areaId del sessionStorage.
  const areaId = sessionStorage.getItem("areaId");

  // 2. Creamos una referencia para guardar la instancia del WebSocket
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Si no hay areaId (no logueado o sin área asignada), no conectamos.
    if (!areaId) {
      return;
    }

    // 3. Construimos la URL del WebSocket
    //    Ajusta a tu dominio o puerto si no usas localhost:8000
    const wsUrl = `ws://127.0.0.1:8000/api/v1/ws/notificaciones/${areaId}`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("Conectado al WebSocket de Notificaciones (Área: " + areaId + ")");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Mensaje WebSocket recibido:", data);

        // Asume un formato como { "type": "NUEVA_NOTIFICACION", "data": {...} }
        if (data?.type === "NUEVA_NOTIFICACION") {
          const notif = data.data;
          // Lanza un toast con la info
          toast({
            title: "🔔 Nueva notificación",
            description: notif.comentario ?? "Sin descripción",
            className: "bg-yellow-100 border border-yellow-300 text-yellow-800"
          });
        }

        // Podrías manejar otras acciones (NOTIFICACION_LEIDA, etc.)
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

    // 6. Cleanup: cerrar el socket al desmontar
    return () => {
      if (wsRef.current) {
        console.log("Cerrando WebSocket de Notificaciones...");
        wsRef.current.close();
      }
    };
  }, [areaId]);

  // No retornamos nada, pero podrías exponer funciones para enviar datos por WebSocket.
  return null;
}
