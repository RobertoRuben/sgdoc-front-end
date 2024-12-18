// DatosRemitenteForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { Remitente } from '@/model/remitente';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiArrowRight } from 'react-icons/fi';

interface DatosRemitenteFormProps {
  onNext: (data: Partial<FormData>) => void;
  onCancel: () => void;
  initialData?: Partial<Remitente>;
}

interface FormData {
  remitente?: Remitente;
}

const DatosRemitenteForm = ({ onNext, onCancel, initialData }: DatosRemitenteFormProps) => {
  const { register, handleSubmit, formState: { errors, isValid }, control } = useForm<Remitente>({ 
    mode: 'onChange',
    defaultValues: initialData
  });

  const onFormSubmit = (data: Remitente) => {
    // Aseguramos que todos los campos obligatorios estén presentes
    if (isValid && data.dni && data.nombres && data.apellidoPaterno && data.apellidoMaterno && data.genero) {
      onNext({ remitente: data });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dni">DNI</Label>
          <Input 
            id="dni" 
            type="number" 
            {...register('dni', { 
              required: 'DNI es requerido',
              setValueAs: (v: string) => parseInt(v, 10),
              validate: {
                positive: (v: number) => v > 0 || 'DNI debe ser positivo',
                eightDigits: (v: number) => (v >= 10000000 && v <= 99999999) || 'DNI debe tener 8 dígitos',
              }
            })} 
            className={`mt-1 block w-full ${errors.dni ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#028a3b]'} rounded-md`}
          />
          {errors.dni && <p className="text-red-600 text-sm mt-1">{errors.dni.message}</p>}
        </div>
        <div>
          <Label htmlFor="nombres">Nombres</Label>
          <Input 
            id="nombres" 
            {...register('nombres', { 
              required: 'Nombres son requeridos',
              minLength: { value: 4, message: 'Nombres deben tener al menos 4 caracteres' },
              pattern: { value: /^[a-zA-Z\s]+$/, message: 'Nombres deben contener solo letras y espacios' }
            })} 
            className={`mt-1 block w-full ${errors.nombres ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#028a3b]'} rounded-md`}
          />
          {errors.nombres && <p className="text-red-600 text-sm mt-1">{errors.nombres.message}</p>}
        </div>
        <div>
          <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
          <Input 
            id="apellidoPaterno" 
            {...register('apellidoPaterno', { 
              required: 'Apellido paterno es requerido',
              minLength: { value: 4, message: 'Apellido paterno debe tener al menos 4 caracteres' },
              pattern: { value: /^[a-zA-Z\s]+$/, message: 'Apellido paterno debe contener solo letras y espacios' }
            })} 
            className={`mt-1 block w-full ${errors.apellidoPaterno ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#028a3b]'} rounded-md`}
          />
          {errors.apellidoPaterno && <p className="text-red-600 text-sm mt-1">{errors.apellidoPaterno.message}</p>}
        </div>
        <div>
          <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
          <Input 
            id="apellidoMaterno" 
            {...register('apellidoMaterno', { 
              required: 'Apellido materno es requerido',
              minLength: { value: 4, message: 'Apellido materno debe tener al menos 4 caracteres' },
              pattern: { value: /^[a-zA-Z\s]+$/, message: 'Apellido materno debe contener solo letras y espacios' }
            })} 
            className={`mt-1 block w-full ${errors.apellidoMaterno ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#028a3b]'} rounded-md`}
          />
          {errors.apellidoMaterno && <p className="text-red-600 text-sm mt-1">{errors.apellidoMaterno.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="genero">Género</Label>
        <Controller
          name="genero"
          control={control}
          rules={{ required: 'Género es requerido' }}
          render={({ field }) => (
            <Select
              name="genero"
              value={field.value || ''}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger 
                id="genero"
                className={`mt-1 flex items-center justify-between w-full ${errors.genero ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#028a3b]'} rounded-md`}
              >
                <SelectValue placeholder="Seleccione un género" />
                {/* No es necesario añadir ningún ícono aquí */}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.genero && <p className="text-red-600 text-sm mt-1">{errors.genero.message}</p>}
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          type="button" 
          onClick={onCancel} 
          className="bg-[#d82f2f] text-white hover:bg-[#991f1f] hover:text-white w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center w-full sm:w-auto" 
          disabled={!isValid}
        >
          Siguiente
          <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </form>
  );
};

export default DatosRemitenteForm;
