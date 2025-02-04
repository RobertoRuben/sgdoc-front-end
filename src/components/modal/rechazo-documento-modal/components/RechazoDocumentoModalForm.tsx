import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RechazoDocumentoModalFooter } from "./RechazoDocumentoModalFooter";

const formSchema = z.object({
  comentario: z
    .string()
    .min(10, { message: "El comentario debe tener al menos 10 caracteres" })
    .max(500, { message: "El comentario no puede exceder los 500 caracteres" }),
});

interface RechazoDocumentoModalFormProps {
  onClose: () => void;
  onSubmit: (comentario: string) => Promise<void>;
}

export const RechazoDocumentoModalForm: React.FC<RechazoDocumentoModalFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comentario: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values.comentario);
    } catch (error) {
      console.error("Error al rechazar documento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <div className="flex-1 p-4 md:p-6">
          <FormField
            control={form.control}
            name="comentario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900">
                  Motivo del rechazo
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escriba aquí el motivo del rechazo..."
                    className="min-h-[150px] resize-none"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <RechazoDocumentoModalFooter
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};