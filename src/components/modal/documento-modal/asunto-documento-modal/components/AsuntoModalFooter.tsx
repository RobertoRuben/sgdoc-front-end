import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

interface AsuntoModalFooterProps {
  onClose: () => void
}

export const AsuntoModalFooter: React.FC<AsuntoModalFooterProps> = ({ onClose }) => {
  return (
    <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <Button
        type="button"
        onClick={onClose}
        className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
      >
        <XCircle className="w-5 h-5 mr-2" />
        Cerrar
      </Button>
    </DialogFooter>
  )
}

