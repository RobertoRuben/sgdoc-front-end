"use client";

import { AreaChartLegend } from "@/components/chart/AreaChartLegend";
import { BarChart } from "@/components/chart/BarChart";
import { BarCharHorizontal } from "@/components/chart/BarChartHorizontal";

interface ChartsSectionProps {
  areaChartData: unknown[];
  areaChartSeries: Array<{ dataKey: string; fill: string; stroke: string }>;
  areaChartConfig: Record<string, { label: string; color: string }>;

  documentaryScopeBarData: { ambito: string; total: number }[];
  villageBarData: { caserio: string; totalDocumentos: number }[];
  topMostVillagesBarData: { caserio: string; totalDocumentos: number }[];
  topLeastVillagesBarData: { caserio: string; totalDocumentos: number }[];

  horizontalBarChartData?: { departamento: string; ingresos: number }[];
}

export function ChartsSection({
  areaChartData,
  areaChartSeries,
  areaChartConfig,

  documentaryScopeBarData,
  villageBarData,
  topMostVillagesBarData,
  topLeastVillagesBarData,

}: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

      {/* BARRA VERTICAL 1: Ámbito Documental */}
      <div className="lg:col-span-2">
        <BarChart
          data={documentaryScopeBarData}
          config={{
            total: { label: "Total", color: "hsl(200, 60%, 50%)" },
          }}
          title="Documentos por Ámbito Documental"
          description="Cantidad total de documentos por ámbito"
          xAxisDataKey="ambito"
          bar={{
            dataKey: "total",
            fill: "hsl(200, 60%, 50%)",
            radius: [4, 4, 0, 0],
          }}
        />
      </div>

      {/* BARRA VERTICAL 2: Documentos por Caserío */}
      <div className="lg:col-span-2">
        <BarChart
          data={villageBarData}
          config={{
            totalDocumentos: {
              label: "Documentos",
              color: "hsl(142, 76%, 36%)",
            },
          }}
          title="Documentos por Caserío"
          description="Cantidad total de documentos por cada caserío"
          xAxisDataKey="caserio"
          bar={{
            dataKey: "totalDocumentos",
            fill: "hsl(142, 76%, 36%)",
            radius: [4, 4, 0, 0],
          }}
        />
      </div>

      {/* PRIMER BAR HORIZONTAL -> Top con más documentos */}
      <BarCharHorizontal
        data={topMostVillagesBarData}
        config={{
          totalDocumentos: { label: "Documentos", color: "hsl(142, 71%, 45%)" },
        }}
        title="Top Caseríos con más Documentos"
        description="Muestra los 5 caseríos con mayor cantidad de documentos"
        yAxisDataKey="caserio"
        bar={{
          dataKey: "totalDocumentos",
          fill: "#22c55e",
          radius: [0, 4, 4, 0],
        }}
      />

      {/* SEGUNDO BAR HORIZONTAL -> Top con menos documentos */}
      <BarCharHorizontal
        data={topLeastVillagesBarData}
        config={{
          totalDocumentos: { label: "Documentos", color: "hsl(142, 71%, 45%)" },
        }}
        title="Top Caseríos con menos Documentos"
        description="Muestra los 5 caseríos con menor cantidad de documentos"
        yAxisDataKey="caserio"
        bar={{
          dataKey: "totalDocumentos",
          fill: "#86efac",
          radius: [0, 4, 4, 0],
        }}
      />
    </div>
  );
}
