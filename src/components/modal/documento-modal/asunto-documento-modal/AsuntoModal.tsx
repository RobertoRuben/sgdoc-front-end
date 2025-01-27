import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AsuntoModalHeader } from "./components/AsuntoModalHeader"
import { AsuntoModalContent } from "./components/AsuntoModalContent"
import { AsuntoModalFooter } from "./components/AsuntoModalFooter"
import type { DocumentoDetails } from "@/model/documentoDetails"

interface AsuntoModalProps {
  isOpen: boolean
  documento: DocumentoDetails
  onClose: () => void
}

export function AsuntoModal({ isOpen, documento, onClose }: AsuntoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col rounded-lg shadow-xl">
        <AsuntoModalHeader />
        <div className="flex-grow p-6 overflow-hidden">
          <AsuntoModalContent documento={documento} />
        </div>
        <AsuntoModalFooter onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}

