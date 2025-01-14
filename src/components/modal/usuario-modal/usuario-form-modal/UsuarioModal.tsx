import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  UsuarioModalHeader
} from "@/components/modal/usuario-modal/usuario-form-modal/components/UsuarioModalHeader.tsx";
import {UsuarioModalForm} from "@/components/modal/usuario-modal/usuario-form-modal/components/UsuarioModalForm.tsx";
import {
  UsuarioModalFooter
} from "@/components/modal/usuario-modal/usuario-form-modal/components/UsuarioModalFooter.tsx";
import { Usuario } from "@/model/usuario";

interface RegistroUsuarioModalProps {
  isOpen: boolean;
  usuario?: Usuario;
  onClose: () => void;
  onSubmit: (data: Usuario) => void;
}

export function RegistroUsuarioModal({
                                       isOpen,
                                       usuario,
                                       onClose,
                                       onSubmit,
                                     }: RegistroUsuarioModalProps) {
  const isEditing = usuario?.id ? true : false;

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
          <UsuarioModalHeader isEditing={isEditing} />
          <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <UsuarioModalForm
                usuario={usuario}
                onSubmit={onSubmit}
            />
          </div>
          <UsuarioModalFooter
              isEditing={isEditing}
              onClose={onClose}
              onSubmit={() => {}}
          />
        </DialogContent>
      </Dialog>
  );
}