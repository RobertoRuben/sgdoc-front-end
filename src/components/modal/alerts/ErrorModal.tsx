import { AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ErrorModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    errorMessage: string
}

export default function ErrorModal({
                                       isOpen,
                                       onClose,
                                       title = "Error",
                                       errorMessage
                                   }: ErrorModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center flex items-center justify-center text-red-600">
                        <AlertCircle className="w-8 h-8 mr-2" />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-6">
                    <DialogDescription className="text-center text-base text-gray-700">
                        No se pudo completar la operación
                    </DialogDescription>
                    <p className="mt-2 text-center text-sm text-red-600 bg-red-100 p-2 rounded">
                        {errorMessage}
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-8 py-2">
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}