import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentosChartProps {
  data: {
    name: string;
    documentos: number;
  }[];
}

export const DocumentosChart: React.FC<DocumentosChartProps> = ({ data }) => {
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  return (
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
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
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
                  cursor={{ fill: "#dbdad1" }}
                />
                <Bar
                  dataKey="documentos"
                  fill="#7ebaad"
                  radius={[4, 4, 0, 0]}
                  name="Documentos"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};