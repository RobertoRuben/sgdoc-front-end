import { AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

export function DeleteConfirmationModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            itemName
                                        }: DeleteConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 overflow-hidden">
                <div className="absolute inset-0 bg-red-50/50 dark:bg-red-950/20" />
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/10 via-red-500/40 to-red-500/10" />

                    <DialogHeader className="pt-6 px-6">
                        <DialogTitle className="text-2xl font-semibold text-center flex flex-col items-center justify-center text-red-600 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 animate-ping bg-red-100 dark:bg-red-900 rounded-full" />
                                <AlertTriangle className="w-12 h-12 animate-pulse relative" />
                            </div>
                            <span>Confirmar Eliminación</span>
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-center py-6 px-6">
                        {/* Consolidar el texto en un solo <p> */}
                        <span className="text-lg font-medium text-gray-900 dark:text-gray-300 block">
                            ¿Está seguro que desea realizar esta acción?
                        </span>
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200 block mt-2">
                            Se eliminará el siguiente ítem:
                        </span>
                    </DialogDescription>

                    <div className="text-center py-2 px-6">
                        <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded">
                            <span className="text-xl font-medium text-gray-700 dark:text-gray-200 break-all">
                                {itemName}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="bg-gray-50/80 dark:bg-gray-950/80 p-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className={cn(
                                "w-full sm:w-auto bg-white dark:bg-gray-900",
                                "hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={cn(
                                "w-full sm:w-auto",
                                "animate-pulse hover:animate-none",
                                "bg-red-600 hover:bg-red-700",
                                "dark:bg-red-700 dark:hover:bg-red-800"
                            )}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
