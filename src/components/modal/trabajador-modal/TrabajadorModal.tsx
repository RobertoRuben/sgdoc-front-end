// TrabajadoresModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TrabajadorModalHeader} from "@/components/modal/trabajador-modal/components/TrabajadorModalHeader";
import { TrabajadorModalForm} from "@/components/modal/trabajador-modal/components/TrabajadorModalForm.tsx";
import { Trabajador } from "@/model/trabajador";
import { Area } from "@/model/area";

interface TrabajadoresModalProps {
    isOpen: boolean;
    trabajador?: Trabajador;
    onClose: () => void;
    onSubmit: (data: Trabajador) => void;
    areas: Area[];
}

export function TrabajadoresModal({
                                      isOpen,
                                      trabajador,
                                      onClose,
                                      onSubmit,
                                      areas,
                                  }: TrabajadoresModalProps) {
    const isEditing = !!(trabajador?.id && trabajador.id > 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
                <TrabajadorModalHeader isEditing={isEditing} />
                <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <TrabajadorModalForm
                        trabajador={trabajador}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                        areas={areas}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}