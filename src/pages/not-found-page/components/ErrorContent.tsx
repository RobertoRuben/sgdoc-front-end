import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ErrorContentProps {
    isVisible: boolean;
    onBackClick: () => void;
}

export const ErrorContent = ({ isVisible, onBackClick }: ErrorContentProps) => {
    return (
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50">
            <div className="flex flex-col items-center text-center space-y-6">
                <h1 className={`text-8xl font-bold text-gray-900 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`}>
                    404
                </h1>

                <h2 className={`text-2xl font-semibold text-gray-700 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Página no encontrada
                </h2>

                <p className={`text-gray-500 max-w-md transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>

                <Button
                    className={`bg-[#145A32] text-white hover:bg-[#0E3D22] transition-all duration-300 ease-in-out transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    onClick={onBackClick}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la página principal
                </Button>

                <div className={`mt-12 transition-all duration-1000 delay-700 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <img 
                        src="/chirimoya-triste.png" 
                        alt="Chirimoya" 
                        className="w-64 h-64 object-contain hover:animate-pulse transition-all duration-300 ease-in-out transform hover:scale-110"
                    />
                </div>
            </div>
        </div>
    );
};