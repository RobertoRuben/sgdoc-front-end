import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Remitente } from '@/model/remitente';
import { Documento } from '@/model/documento';
import ProgressBar from './components/ProgressBar';
import DatosRemitenteForm from './components/datos-remitente-form/DatosRemitenteForm';
import DatosDocumentoForm from './components/datos-documento-form/DatosDocumentoForm';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

interface FormData {
  remitente?: Remitente;
  documento?: Documento;
}

interface RegistroDocumentoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = ["Datos del Remitente", "Datos del Documento"];

const RegistroDocumentoModal = ({ isOpen, onOpenChange }: RegistroDocumentoModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    remitente: undefined,
    documento: undefined
  });
  const [isStepComplete, setIsStepComplete] = useState([false, false]);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = (data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    setIsStepComplete(prev => {
      const newState = [...prev];
      newState[step - 1] = true;
      return newState;
    });
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsStepComplete(prev => {
      const newState = [...prev];
      newState[1] = true;
      return newState;
    });
    setStep(2);
    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Datos del formulario:', formData);
      setIsSaving(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al guardar el documento:', error);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        remitente: undefined,
        documento: undefined
      });
      setIsStepComplete([false, false]);
      setIsSaving(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] p-0 bg-[#f3f4f6] max-h-screen overflow-y-auto">
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
          <DialogTitle className="text-2xl font-bold mb-2 flex items-center">
            {step === 1 ? <User className="mr-2" /> : <FileText className="mr-2" />}
            {steps[step - 1]}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#e6f4e9]">
            {step === 1 
              ? "Ingrese los datos del remitente del documento" 
              : "Ingrese los detalles del documento a registrar"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          <ProgressBar 
            currentStep={step} 
            totalSteps={2} 
            steps={steps} 
            isStepComplete={isStepComplete} 
          />
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="remitente"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <DatosRemitenteForm 
                  onNext={handleNext}
                  onCancel={() => onOpenChange(false)}
                  initialData={formData.remitente}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="documento"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <DatosDocumentoForm 
                  onPrevious={handlePrevious}
                  onSubmit={handleSubmit}
                  onCancel={() => onOpenChange(false)}
                  initialData={formData.documento}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {isSaving && (
            <LoadingSpinner 
              size="md" 
              message="Guardando documento..." 
              className="mt-4" 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistroDocumentoModal;