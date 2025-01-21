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
import { DerivacionModalFooter } from "./DerivacionModalFooter";
import ReactSelect from "react-select";

const formSchema = z.object({
  areaId: z.number({
    required_error: "Debe seleccionar un área",
  }),
});

interface DerivacionModalFormProps {
  onClose: () => void;
  onSubmit: (areaId: number) => Promise<void>;
  isLoading?: boolean;
}

const areasOptions = [
  // Aquí deberías llenar con las áreas disponibles
  { value: 1, label: "Área 1" },
  { value: 2, label: "Área 2" },
];

export const DerivacionModalForm: React.FC<DerivacionModalFormProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values.areaId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="areaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccione el área a derivar el documento</FormLabel>
              <FormControl>
                <ReactSelect
                  inputId="area"
                  options={areasOptions}
                  value={areasOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                  isDisabled={isLoading}
                  isClearable
                  isSearchable
                  placeholder="Seleccione un área"
                  className="basic-single text-sm"
                  classNamePrefix="select"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderWidth: "0.5px",
                      borderColor: state.isFocused ? "black" : "#e2e8f0",
                      boxShadow: "none",
                      fontSize: "0.875rem",
                      "&:hover": {
                        borderColor: "black",
                        borderWidth: "0.5px",
                      },
                    }),
                    option: (baseStyles, state) => ({
                      ...baseStyles,
                      fontSize: "0.875rem",
                      backgroundColor: state.isSelected
                        ? "#f3f4f6"
                        : state.isFocused
                        ? "#f9fafb"
                        : "white",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                    placeholder: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: "0.875rem",
                      color: "black",
                    }),
                    singleValue: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: "0.875rem",
                      color: "black",
                    }),
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DerivacionModalFooter 
          onClose={onClose}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};