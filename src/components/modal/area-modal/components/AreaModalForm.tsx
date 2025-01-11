import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {AreaModalFooter} from "./AreaModalFooter";
import {Area} from "@/model/area";

const formSchema = z.object({
    nombreArea: z
        .string()
        .min(2, {
            message: "El nombre del área debe tener al menos 2 caracteres",
        })
        .regex(/^[A-Za-zÀ-ÿ\s]+$/, {
            message: "El nombre del área no debe contener números",
        }),
});

interface AreaModalFormProps {
    area?: Area;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Area) => Promise<void>;
    isLoading?: boolean;
}

export const AreaModalForm: React.FC<AreaModalFormProps> = ({area, isEditing, onClose, onSubmit, isLoading = false,}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombreArea: "",
        },
    });

    useEffect(() => {
        if (area) {
            form.reset({
                nombreArea: area.nombreArea,
            });
        }
    }, [area, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const areaData: Area = {
            id: area?.id || 0,
            nombreArea: values.nombreArea,
        };
        await onSubmit(areaData);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="p-6 space-y-6"
            >
                <FormField
                    control={form.control}
                    name="nombreArea"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nombre del Área</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ingrese el nombre del área"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <AreaModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    isLoading={isLoading}
                />
            </form>
        </Form>
    );
};