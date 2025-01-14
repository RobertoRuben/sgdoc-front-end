import { UserCircle } from "lucide-react";
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export const UsuarioPerfilModalHeader = () => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <div className="flex items-center justify-center mb-4">
                <UserCircle className="w-20 h-20" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
                Perfil de Usuario
            </DialogTitle>
            <DialogDescription className="text-center text-emerald-100">
                Configura tu nombre de usuario y contraseña
            </DialogDescription>
        </DialogHeader>
    );
};