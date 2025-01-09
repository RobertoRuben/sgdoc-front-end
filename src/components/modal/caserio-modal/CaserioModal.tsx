import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CaserioModalHeader } from "./components/CaserioModalHeader";
import { CaserioModalForm } from "./components/CaserioModalForm";
import { Caserio } from "@/model/caserio";
import { CentroPoblado } from "@/model/centroPoblado";

interface CaserioModalProps {
  isOpen: boolean;
  caserio?: Caserio;
  centrosPoblados: CentroPoblado[];
  onClose: () => void;
  onSubmit: (data: Caserio) => Promise<void>;
}

export function CaserioModal({
  isOpen,
  caserio,
  centrosPoblados,
  onClose,
  onSubmit,
}: CaserioModalProps) {
  const isEditing = Boolean(caserio?.id && caserio.id > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
        <CaserioModalHeader isEditing={isEditing} />
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <CaserioModalForm
            caserio={caserio}
            centrosPoblados={centrosPoblados}
            isEditing={isEditing}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}