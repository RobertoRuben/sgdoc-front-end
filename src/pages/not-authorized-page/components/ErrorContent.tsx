import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";

interface ErrorContentProps {
    isVisible: boolean;
    onBackClick: () => void;
}

export const ErrorContent = ({ isVisible, onBackClick }: ErrorContentProps) => {
    return (
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col items-center text-center space-y-6">
                <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping-slow">
                            <ShieldAlert className="w-24 h-24 text-red-500/30" />
                        </div>
                        <ShieldAlert className="w-24 h-24 text-red-500 relative z-10" />
                    </div>
                </div>

                <h1 className={`text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`}>
                    403
                </h1>

                <h2 className={`text-3xl font-bold text-gray-800 dark:text-gray-100 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Acceso no autorizado
                </h2>

                <p className={`text-gray-600 dark:text-gray-300 max-w-md transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Lo sentimos, no tienes los permisos necesarios para acceder a esta página. Por favor, verifica tus credenciales o contacta al administrador.
                </p>

                <Button
                    size="lg"
                    className={`bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    onClick={onBackClick}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Volver a la página principal
                </Button>
            </div>
        </div>
    );
};