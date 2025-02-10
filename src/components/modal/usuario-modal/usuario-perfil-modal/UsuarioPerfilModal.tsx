import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {Usuario} from "@/model/usuario";
import { UsuarioPerfilModalHeader } from "./components/UsuarioPerfilModalHeader";
import { UsuarioPerfilModalForm } from "./components/UsuarioPerfilModalForm";
import { UsuarioPerfilModalFooter } from "./components/UsuarioPerfilModalFooter";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: Usuario;
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

        handleClose();
    };

    const handleClose = () => {
        if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
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

            <DialogContent className="sm:max-w-[425px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
                <UsuarioPerfilModalHeader />
                <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <UsuarioPerfilModalForm
                        user={user}
                        newPassword={newPassword}
                        confirmPassword={confirmPassword}
                        error={error}
                        setNewPassword={setNewPassword}
                        setConfirmPassword={setConfirmPassword}
                    />
                </div>
                <UsuarioPerfilModalFooter
                    onClose={handleClose}
                    onPasswordChange={handlePasswordChange}
                />
            </DialogContent>
        </Dialog>
    );
}
