import React, { useState } from 'react';
import { FileText, Send, Clock } from 'lucide-react';
import { InfoCard } from './components/InfoCard';
import { DocumentosChart } from './components/ChartCard';
import { datosIniciales } from './components/datosIniciales';

const InicioPage: React.FC = () => {
  const [datos] = useState(datosIniciales);

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-3 sm:pl-2 bg-transparent">    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <InfoCard 
          title="Documentos ingresados hoy" 
          value={datos.documentos.documentosIngresadosHoy.toString()} 
          color="#e2d111"  
          icon={<FileText size={24} />} 
        />
        <InfoCard 
          title="Derivados hoy" 
          value={datos.derivaciones.derivadosHoy.toString()} 
          color="#168f54" 
          icon={<Send size={24} />} 
        />
        <InfoCard 
          title="Pendientes por derivar" 
          value={datos.derivaciones.pendientesPorDerivar.toString()} 
          color="#d9504c" 
          icon={<Clock size={24} />} 
        />
      </div>

      <DocumentosChart data={datos.caserios.documentosPorCaserio} />
    </div>
  );
};

export default InicioPage;