"use client";

import { AreaChartLegend } from "@/components/chart/AreaChartLegend";
import { BarChart } from "@/components/chart/BarChart";
import { BarCharHorizontal } from "@/components/chart/BarChartHorizontal";
import { PieChartLabel } from "@/components/chart/PieChartLabel";
import { LineChart } from "./LineChart";

interface ChartsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  areaChartData: any[];
  areaChartSeries: Array<{ dataKey: string; fill: string; stroke: string }>;
  areaChartConfig: Record<string, { label: string; color: string }>;

  barChartData: { categoria: string; valor: number }[];
  horizontalBarChartData: { departamento: string; ingresos: number }[];
  pieChartData: { name: string; value: number }[];
  lineChartData: { year: string; documentos: number }[];
  dailyBarChartData: { ciudad: string; documentos: number }[];
}

export function ChartsSection({
  areaChartData,
  areaChartSeries,
  areaChartConfig,  horizontalBarChartData,
  pieChartData,
  lineChartData,
  dailyBarChartData,
}: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Área con leyenda - UNA LÍNEA POR CADA CENTRO POBLADO */}
      <div className="lg:col-span-2">
        <AreaChartLegend
          data={areaChartData}
          config={areaChartConfig}
          title="Documentos por Centro Poblado"
          description="Líneas generadas dinámicamente"
          xAxisDataKey="mes"
          series={areaChartSeries}
        />
      </div>

      {/* Ejemplo: Gráfica de barras (vertical) */}
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

      {/* Otros gráficos, repetidos o adicionales... */}
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

      <LineChart
        data={lineChartData}
        config={{
          documentos: { label: "Documentos", color: "hsl(142, 76%, 36%)" },
        }}
        title="Documentos por Año"
        description="Evolución anual de documentos ingresados"
        xAxisDataKey="year"
      />

      <PieChartLabel
        data={pieChartData}
        config={{
          value: { label: "Valor", color: "hsl(142, 76%, 36%)" },
          colors: [
            "hsl(142, 76%, 36%)",
            "hsl(33, 100%, 50%)",
            "hsl(0, 84%, 60%)",
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
