import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, UserCircle, Building2, Save, XCircle } from "lucide-react";
import { UsuarioProfile } from "@/model/usuarioProfile";

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

  const handleClose = () => {
    // Quitar el foco del elemento activo antes de cerrar
    document.activeElement && (document.activeElement as HTMLElement).blur();
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
          />
        )}
      </AnimatePresence>

      <DialogContent
        className="sm:max-w-[425px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Evita la propagación de clics al fondo
      >
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

        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordChange();
            }}
            className="p-6 space-y-6"
          >
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
        </div>

        <DialogFooter className="p-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handlePasswordChange}
            className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Actualizar Contraseña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
