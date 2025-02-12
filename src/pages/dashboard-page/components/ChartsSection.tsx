"use client";

import { useMemo } from "react";
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
  // Genera un color base verde aleatorio en formato hsl para la paleta,
  // tomando como referencia "hsl(142, 76%, 36%)"
  const randomGreen = useMemo(() => {
    const baseHue = 142;
    const baseSaturation = 76;
    const baseLightness = 36;
    const variation = 5; // Variación de ±5 puntos para el color base
    const randomSaturation =
      baseSaturation + (Math.floor(Math.random() * (2 * variation + 1)) - variation);
    const randomLightness =
      baseLightness + (Math.floor(Math.random() * (2 * variation + 1)) - variation);
    return `hsl(${baseHue}, ${randomSaturation}%, ${randomLightness}%)`;
  }, []);

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
            fill: randomGreen, // Color base para este gráfico (no verde)
            radius: [4, 4, 0, 0],
          }}
        />
      </div>

      {/* BARRA VERTICAL 2: Documentos por Caserío, con paleta de verdes */}
      <div className="lg:col-span-2">
        <BarChart
          data={villageBarData}
          config={{
            totalDocumentos: { label: "Documentos", color: randomGreen },
          }}
          title="Documentos por Caserío"
          description="Cantidad total de documentos por cada caserío"
          xAxisDataKey="caserio"
          bar={{
            dataKey: "totalDocumentos",
            fill: randomGreen, // Color base para generar la paleta de verdes
            radius: [4, 4, 0, 0],
          }}
        />
      </div>

      {/* PRIMER BAR HORIZONTAL -> Top Caseríos con más documentos */}
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

      {/* SEGUNDO BAR HORIZONTAL -> Top Caseríos con menos documentos */}
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
