import {Dialog, DialogContent} from "@/components/ui/dialog";
import {RolModalHeader} from "./components/RolModalHeader";
import {RolModalForm} from "./components/RolModalForm";
import {Rol} from "@/model/rol";

interface RolModalProps {
    isOpen: boolean;
    rol?: Rol;
    onClose: () => void;
    onSubmit: (data: Rol) => void;
}

export function RolModal({isOpen, rol, onClose, onSubmit,}: RolModalProps) {
    const isEditing = !!(rol?.id && rol.id > 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
                <RolModalHeader isEditing={isEditing}/>
                <div
                    className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <RolModalForm
                        rol={rol}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}