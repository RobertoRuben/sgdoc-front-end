import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, UserCircle, Building2 } from "lucide-react";
import { UsuarioProfile } from "@/model/usuarioProfile";

interface UsuarioPerfilModalFormProps {
    user: UsuarioProfile;
    newPassword: string;
    confirmPassword: string;
    error: string;
    setNewPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
}

export const UsuarioPerfilModalForm: React.FC<UsuarioPerfilModalFormProps> = ({
    user,
    newPassword,
    confirmPassword,
    error,
    setNewPassword,
    setConfirmPassword,
}) => {
    return (
        <form className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm text-muted-foreground">
                        Usuario
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-[#028a3b]" />
                        <Input
                            id="username"
                            value={user.nombreUsuario}
                            className="pl-10"
                            disabled
                            autoComplete="username"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm text-muted-foreground">
                        Rol
                    </Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-[#028a3b]" />
                        <Input
                            id="role"
                            value={user.rolNombre}
                            className="pl-10"
                            disabled
                            autoComplete="organization-title"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="worker" className="text-sm text-muted-foreground">
                        Trabajador
                    </Label>
                    <div className="relative">
                        <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-[#028a3b]" />
                        <Input
                            id="worker"
                            value={user.trabajadorNombre}
                            className="pl-10"
                            disabled
                            autoComplete="name"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="Ingrese nueva contraseña"
                            className="pl-10"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            name="newPassword"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirme nueva contraseña"
                            className="pl-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            name="confirmPassword"
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        </form>
    );
};