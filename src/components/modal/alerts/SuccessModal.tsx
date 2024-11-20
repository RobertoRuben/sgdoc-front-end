import { CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SuccessModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message?: string
}

export default function SuccessModal({
                                         isOpen,
                                         onClose,
                                         title = "Éxito",
                                         message = "Registro guardado Exitosamente"
                                     }: SuccessModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center flex items-center justify-center text-green-600">
                        <CheckCircle className="w-8 h-8 mr-2" />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-6">
                    <DialogDescription className="text-center text-base text-gray-700">
                        {message}
                    </DialogDescription>
                </div>
                <div className="flex justify-center">
                    <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2">
                        Aceptar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}