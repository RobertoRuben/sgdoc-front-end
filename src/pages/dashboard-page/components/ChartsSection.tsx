"use client";

import { AreaChartLegend } from "@/components/chart/AreaChartLegend";
import { BarChart } from "@/components/chart/BarChart";
import { BarCharHorizontal } from "@/components/chart/BarChartHorizontal";
import { PieChartLabel } from "@/components/chart/PieChartLabel";
import { LineChart } from "./LineChart";

interface ChartsSectionProps {
  areaChartData: { month: string; documentos: number; tramites: number }[];
  barChartData: { categoria: string; valor: number }[];
  horizontalBarChartData: { departamento: string; ingresos: number }[];
  pieChartData: { name: string; value: number }[];
  lineChartData: { year: string; documentos: number }[];
  dailyBarChartData: { ciudad: string; documentos: number }[];
}

export function ChartsSection({
  areaChartData,
  horizontalBarChartData,
  pieChartData,
  lineChartData,
  dailyBarChartData,
}: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Área con leyenda */}
      <div className="lg:col-span-2">
        <AreaChartLegend
          data={areaChartData}
          config={{
            documentos: { label: "Documentos", color: "hsl(142, 76%, 36%)" },
            tramites: { label: "Trámites", color: "hsl(142, 71%, 45%)" },
          }}
          title="Documentos y Trámites por Mes"
          description="Evolución mensual de documentos y trámites procesados"
          xAxisDataKey="month"
          series={[
            {
              dataKey: "documentos",
              fill: "hsl(142, 76%, 36%)",
              stroke: "hsl(142, 76%, 36%)",
            },
            {
              dataKey: "tramites",
              fill: "hsl(142, 71%, 45%)",
              stroke: "hsl(142, 71%, 45%)",
            },
          ]}
        />
      </div>
      <div className="lg:col-span-2">
        <BarChart
          data={dailyBarChartData}
          config={{
            documentos: { label: "Documentos", color: "hsl(142, 76%, 36%)" },
          }}
          title="Documentos Diarios"
          description="Distribución diaria de documentos del último mes"
          xAxisDataKey="ciudad"
          bar={{
            dataKey: "documentos",
            fill: "hsl(142, 76%, 36%)",
            radius: [4, 4, 0, 0],
          }}
        />
      </div>
      <div className="lg:col-span-2">
        <BarChart
          data={dailyBarChartData}
          config={{
            documentos: { label: "Documentos", color: "hsl(142, 76%, 36%)" },
          }}
          title="Documentos Diarios"
          description="Distribución diaria de documentos del último mes"
          xAxisDataKey="ciudad"
          bar={{
            dataKey: "documentos",
            fill: "hsl(142, 76%, 36%)",
            radius: [4, 4, 0, 0],
          }}
        />
      </div>

      {/* Barra horizontal */}
      <BarCharHorizontal
        data={horizontalBarChartData}
        config={{
          ingresos: { label: "Ingresos", color: "hsl(142, 71%, 45%)" },
        }}
        title="Ingresos por Departamento"
        description="Ingresos generados por cada departamento"
        yAxisDataKey="departamento"
        bar={{
          dataKey: "ingresos",
          fill: "hsl(142, 71%, 45%)",
          radius: [0, 4, 4, 0],
        }}
      />

      <BarCharHorizontal
        data={horizontalBarChartData}
        config={{
          ingresos: { label: "Ingresos", color: "hsl(142, 71%, 45%)" },
        }}
        title="Ingresos por Departamento"
        description="Ingresos generados por cada departamento"
        yAxisDataKey="departamento"
        bar={{
          dataKey: "ingresos",
          fill: "hsl(142, 71%, 45%)",
          radius: [0, 4, 4, 0],
        }}
      />

      {/* Línea temporal */}
      <LineChart
        data={lineChartData}
        config={{
          documentos: { label: "Documentos", color: "hsl(142, 76%, 36%)" },
        }}
        title="Documentos por Año"
        description="Evolución anual de documentos ingresados"
        xAxisDataKey="year"
      />

      {/* Gráfico de pastel */}
      <PieChartLabel
        data={pieChartData}
        config={{
          value: { label: "Valor", color: "hsl(142, 76%, 36%)" },
          colors: [
            "hsl(142, 76%, 36%)", // Verde para Completados
            "hsl(33, 100%, 50%)", // Naranja para En Proceso
            "hsl(0, 84%, 60%)", // Rojo para Pendientes
          ],
        }}
        title="Estado de Documentos"
        description="Distribución de documentos por estado"
        dataKey="value"
        nameKey="name"
      />
    </div>
  );
}
