import { Button } from "@/components/ui/button";
import { XCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DetalleDerivacionDetails } from "@/model/detalleDerivacionDetails";

interface DetalleDerivacionModalContentProps {
  detalles: DetalleDerivacionDetails[];
  onClose: () => void;
}

export const DetalleDerivacionModalContent: React.FC<
  DetalleDerivacionModalContentProps
> = ({ detalles, onClose }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "iniciada":
        return "bg-blue-100 text-blue-800";
      case "recepcionada":
        return "bg-green-100 text-green-800";
      case "en progreso":
        return "bg-yellow-100 text-yellow-800";
      case "finalizada":
        return "bg-green-200 text-green-900";
      case "rechazada":
        return "bg-red-100 text-red-800";
      case "reasignada":
        return "bg-purple-100 text-purple-800";
      case "archivado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 space-y-6">
        <div className="space-y-4">
          {detalles.map((detalle, index) => (
            <div
              key={detalle.id}
              className="bg-white rounded-lg shadow-sm border p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    detalle.estado
                  )}`}
                >
                  {detalle.estado}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(detalle.fecha)}
                </span>
              </div>

              <div className="space-y-2">
                {/* Sección de motivo para rechazos */}
                {detalle.estado.toLowerCase() === "rechazada" && (
                  <div className="font-medium text-gray-700">Motivo de Rechazo:</div>
                )}
                <p className="text-gray-700">{detalle.comentario}</p>
                
                {/* Recepcionado por Área Destino - Solo muestra si no es estado "iniciada" */}
                {detalle.estado.toLowerCase() !== "iniciada" && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">
                      Recepcionado por Área Destino:
                    </span>
                    <span>{detalle.recepcionada ? "Sí" : "No"}</span>
                    {detalle.recepcionada ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}

                {/* Usuario - No muestra en estado "en progreso" */}
                {detalle.estado.toLowerCase() !== "en progreso" && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">
                      Usuario que{" "}
                      {detalle.estado.toLowerCase() === "rechazada"
                        ? "rechazó"
                        : detalle.estado.toLowerCase() === "iniciada"
                        ? "envio"
                        : "recepcionó"}{" "}
                      el documento:
                    </span>
                    <span>
                      {detalle.nombreUsuario?.trim()
                        ? detalle.nombreUsuario
                        : "Ningún usuario confirmó la recepción"}
                    </span>
                  </div>
                )}
              </div>

              {index < detalles.length - 1 && (
                <div className="border-b border-gray-200 my-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 mt-auto">
        <Button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
        >
          <XCircle className="w-5 h-5 mr-2" />
          Cerrar
        </Button>
      </div>
    </div>
  );
};