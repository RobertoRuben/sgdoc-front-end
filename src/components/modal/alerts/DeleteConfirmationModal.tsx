import { AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemName: string
}

export function DeleteConfirmationModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            itemName
                                        }: DeleteConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center flex items-center justify-center text-red-600">
                        <AlertTriangle className="w-8 h-8 mr-2" />
                        Confirmar Eliminación
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center py-4">
                    <p className="text-lg font-medium text-gray-700">
                        ¿Está seguro que desea eliminar el siguiente elemento?
                    </p>
                    <p className="mt-2 text-xl font-bold text-gray-900">
                        {itemName}
                    </p>
                </DialogDescription>
                <DialogFooter className="sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="mr-2"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}