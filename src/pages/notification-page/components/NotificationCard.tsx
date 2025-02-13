import { motion } from "framer-motion";
import { Check, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notificacion } from "@/model/notification";
import { formatDateToLocal } from "@/utils/formatDateToLocal";

interface NotificationCardProps {
  notification: Notificacion;
  onMarkAsRead: (id: number) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        ${notification.leido 
          ? "bg-gray-50/60 backdrop-blur-sm" 
          : "bg-white border-l-4 sm:border-l-4 border-t-4 sm:border-t-0 border-[#145A32]"
        }
        rounded-xl shadow-sm hover:shadow-lg p-4 sm:p-6 mb-4 
        transition-all duration-300 transform hover:-translate-y-1
        relative overflow-hidden w-full
      `}
    >
      {!notification.leido && (
        <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-[#145A32]/5 rounded-full hidden sm:block" />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 relative">
        <motion.div
          whileHover={{ rotate: 15 }}
          className={`
            ${notification.leido 
              ? "bg-gray-100" 
              : "bg-amber-100"
            }
            rounded-xl p-3 transition-colors duration-300
            shadow-sm self-start
          `}
        >
          <Bell className={`
            w-5 h-5 
            ${notification.leido 
              ? "text-gray-400" 
              : "text-amber-500"
            }
          `} />
        </motion.div>
        
        <div className="flex-1 space-y-2 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1 w-full">
              <p className={`
                text-gray-800 leading-relaxed text-sm sm:text-base
                ${notification.leido 
                  ? "text-gray-500" 
                  : "font-medium"
                }
              `}>
                {notification.comentario}
              </p>
              <div className="flex items-center gap-2">
                <div className={`
                  w-2 h-2 rounded-full
                  ${notification.leido 
                    ? "bg-gray-300" 
                    : "bg-[#145A32] animate-pulse"
                  }
                `} />
                <p className="text-xs sm:text-sm text-gray-400 font-medium">
                  {notification.fechaCreacion && formatDateToLocal(notification.fechaCreacion)}
                </p>
              </div>
            </div>
            
            {!notification.leido && notification.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full sm:w-auto mt-3 sm:mt-0"
              >
                <Button
                  onClick={() => onMarkAsRead(notification.id!)}
                  className="w-full sm:w-auto bg-[#145A32] text-white hover:bg-[#0E3D22] 
                    transition-all duration-300
                    shadow-sm hover:shadow-md flex items-center justify-center gap-2 
                    px-4 py-2 rounded-full hover:scale-105 text-sm sm:text-base"
                >
                  <Check className="w-4 h-4" />
                  <span>Marcar como leída</span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};