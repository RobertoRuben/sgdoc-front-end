import { RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UpdateSuccessModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message?: string
}

export default function UpdateSuccessModal({
                                               isOpen,
                                               onClose,
                                               title = "Actualización Exitosa",
                                               message = "Registro actualizado correctamente"
                                           }: UpdateSuccessModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center flex items-center justify-center text-blue-600">
                        <RefreshCw className="w-8 h-8 mr-2" />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-6">
                    <DialogDescription className="text-center text-base text-gray-700">
                        {message}
                    </DialogDescription>
                </div>
                <div className="flex justify-center">
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                        Aceptar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}