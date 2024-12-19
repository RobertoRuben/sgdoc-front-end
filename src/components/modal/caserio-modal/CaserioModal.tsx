import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, XCircle, Plus } from "lucide-react";
import { Caserio } from "@/model/caserio";
import { CentroPoblado } from "@/model/centroPoblado";

const formSchema = z.object({
  nombreCaserio: z
    .string()
    .min(2, {
      message: "El nombre del caserío debe tener al menos 2 caracteres",
    })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
      message: "El nombre del caserío no debe contener números",
    }),
  CentroPobladoId: z.string({
    required_error: "Por favor seleccione un centro poblado",
  }),
});

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
  const isEditing = caserio?.id && caserio.id > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCaserio: "",
      CentroPobladoId: "",
    },
  });

  useEffect(() => {
    if (caserio) {
      form.reset({
        nombreCaserio: caserio.nombreCaserio,
        CentroPobladoId: caserio.CentroPobladoId?.toString() || "",
      });
    } else {
      form.reset({
        nombreCaserio: "",
        CentroPobladoId: "",
      });
    }
  }, [caserio, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const caserioData: Caserio = {
      id: caserio?.id || 0,
      nombreCaserio: values.nombreCaserio,
      CentroPobladoId: parseInt(values.CentroPobladoId),
    };
    await onSubmit(caserioData);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
          <DialogTitle className="text-2xl font-bold flex items-center">
            {isEditing ? (
              <Edit className="mr-2 h-6 w-6" />
            ) : (
              <Plus className="mr-2 h-6 w-6" />
            )}
            {isEditing ? "Editar Caserío" : "Registrar Caserío"}
          </DialogTitle>
          <DialogDescription className="text-sm text-emerald-100">
            {isEditing
              ? "Modifica los datos del caserío según sea necesario."
              : "Complete el formulario para registrar un nuevo caserío."}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-6 space-y-6"
            >
              <FormField
                control={form.control}
                name="nombreCaserio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="nombreCaserio-input">
                      Nombre del Caserío
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="nombreCaserio-input"
                        placeholder="Ingrese el nombre del caserío"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="CentroPobladoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="centroPoblado-select">
                      Centro Poblado
                    </FormLabel>
                    <Select
                      name="CentroPobladoId"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger id="centroPoblado-select">
                          <SelectValue placeholder="Seleccione un centro poblado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {centrosPoblados.map((cp) => (
                          <SelectItem
                            key={cp.id ?? 0}
                            value={(cp.id ?? 0).toString()}
                          >
                            {cp.nombreCentroPoblado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? "Guardar Cambios" : "Registrar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
