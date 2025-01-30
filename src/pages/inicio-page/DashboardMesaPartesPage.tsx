import React, { useState, useEffect } from 'react';
import { FileText, Send, Clock } from 'lucide-react';
import { InfoCard } from './components/InfoCard';
import { DocumentosChart } from './components/ChartCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import LoadingSpinner from '@/components/layout/LoadingSpinner'; // Asegúrate de ajustar la ruta correcta

const DashboardMesaPartesPage: React.FC = () => {
  const { dashboardData, isLoading, error } = useDashboardData();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Cargando datos de Mesa de Partes..."
      />
    );
  }

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-3 sm:pl-2 bg-transparent">    
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <InfoCard 
          title="Documentos ingresados hoy" 
          value={(dashboardData?.totalDocuments ?? 0).toString()} 
          color="#e2d111"  
          icon={<FileText size={24} />} 
        />
        <InfoCard 
          title="Derivados hoy" 
          value={(dashboardData?.totalDerivedDocuments ?? 0).toString()} 
          color="#168f54" 
          icon={<Send size={24} />} 
        />
        <InfoCard 
          title="Pendientes por derivar" 
          value={(dashboardData?.totalPendingDerivedDocuments ?? 0).toString()} 
          color="#d9504c" 
          icon={<Clock size={24} />} 
        />
      </div>

      <div className={`transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <DocumentosChart data={dashboardData?.documentsByCaserio ?? []} />
      </div>
    </div>
  );
};

export default DashboardMesaPartesPage;