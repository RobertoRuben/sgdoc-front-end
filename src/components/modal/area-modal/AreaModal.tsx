import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AreaModalHeader } from "./components/AreaModalHeader";
import { AreaModalForm } from "./components/AreaModalForm";
import { Area } from "@/model/area";

interface AreaModalProps {
  isOpen: boolean;
  area?: Area;
  onClose: () => void;
  onSubmit: (data: Area) => Promise<void>;
}

export function AreaModal({
  isOpen,
  area,
  onClose,
  onSubmit,
}: AreaModalProps) {
  const isEditing = !!(area?.id && area.id > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
        <AreaModalHeader isEditing={isEditing} />
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <AreaModalForm
            area={area}
            isEditing={isEditing}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}