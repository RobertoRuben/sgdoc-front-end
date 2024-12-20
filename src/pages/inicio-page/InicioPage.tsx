// InicioPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { FileText, UserPlus, Send, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Documentos, Remitentes, Derivaciones,  CaseriosData} from '@/model/inicio';

// Datos ficticios tipados
const datosIniciales: {
  documentos: Documentos;
  remitentes: Remitentes;
  derivaciones: Derivaciones;
  caserios: CaseriosData;
} = {
  documentos: {
    documentosIngresadosHoy: 15
  },
  remitentes: {
    nuevosRemitentesRegistrados: 3
  },
  derivaciones: {
    derivadosHoy: 10,
    pendientesPorDerivar: 8
  },
  caserios: {
    documentosPorCaserio: [
      { name: "Caserío A", documentos: 5 },
      { name: "Caserío B", documentos: 3 },
      { name: "Caserío C", documentos: 7 },
      { name: "Caserío D", documentos: 2 },
      { name: "Caserío E", documentos: 4 },
    ]
  }
};

const InicioPage: React.FC = () => {
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [datos] = useState(datosIniciales);

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InfoCard 
          title="Documentos ingresados hoy" 
          value={datos.documentos.documentosIngresadosHoy.toString()} 
          color=" #168f54" 
          icon={<FileText size={24} />} 
        />
        <InfoCard 
          title="Nuevos remitentes registrados" 
          value={datos.remitentes.nuevosRemitentesRegistrados.toString()} 
          color= " #e2d111" 
          icon={<UserPlus size={24} />} 
        />
        <InfoCard 
          title="Derivados hoy" 
          value={datos.derivaciones.derivadosHoy.toString()} 
          color=" #d9504c" 
          icon={<Send size={24} />} 
        />
        <InfoCard 
          title="Pendientes por derivar" 
          value={datos.derivaciones.pendientesPorDerivar.toString()} 
          color=" #243328" 
          icon={<Clock size={24} />} 
        />
      </div>

      <Card className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documentos ingresados por caserío</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChartExpanded(!isChartExpanded)}
            aria-label={isChartExpanded ? "Contraer gráfico" : "Expandir gráfico"}
          >
            {isChartExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <motion.div
              initial={{ height: 400 }}
              animate={{ height: isChartExpanded ? 600 : 400 }}
              exit={{ height: 400 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datos.caserios.documentosPorCaserio}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke=" #888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke=" #888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '10px',
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                    cursor={{ fill: " #dbdad1" }}
                  />
                  <Bar
                    dataKey="documentos"
                    fill=" #7ebaad"
                    radius={[4, 4, 0, 0]}
                    name="Documentos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, color, icon }) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" style={{ backgroundColor: color }}>
      <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
      <div className="text-white">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </CardContent>
  </Card>
);

export default InicioPage;