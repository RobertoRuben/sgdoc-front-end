import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, UserCircle, Building2, Save } from "lucide-react";
import { UsuarioProfile } from "@/model/usuarioProfile";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UsuarioProfile;
  onPasswordChange: (newPassword: string) => void;
}

export function UsuarioProfileModal({
  isOpen,
  onClose,
  user,
  onPasswordChange,
}: UserProfileModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    onPasswordChange(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePasswordChange();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div
              className={cn(
                "bg-gradient-to-l from-[#028a3b] via-[#014920] to-black",
                "text-white p-6 rounded-t-lg shadow-md -mt-6 -mx-6 mb-6"
              )}
            >
              <div className="flex items-center justify-center mb-4">
                <UserCircle className="w-20 h-20" />
              </div>
              <DialogTitle className="text-2xl font-bold text-center">
                Perfil de Usuario
              </DialogTitle>
              <DialogDescription className="text-center">
                Configura tu nombre de usuario y contraseña
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6">
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

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#028a3b] hover:bg-[#014920]">
                <Save className="w-4 h-4 mr-2" />
                Actualizar Contraseña
              </Button>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}