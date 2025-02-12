"use client";

import { useState, useEffect } from "react";
import { FileText, Clock, XCircle, CheckCircle } from "lucide-react";
import { DashboardDateFilter } from "./DashboardDateFilter";
import { StatCards, CardData } from "./StatCards";
import { ChartsSection } from "./ChartsSection";

// Importación de tus servicios
import {
  getTotalDocumentsByCentroPoblado,
  getTotalDocumentsByDocumentaryScope,
  getTotalDocumentsByVillage,
  getTopVillagesWithMostDocuments,
  getTopVillagesWithLeastDocuments // <-- IMPORTANTE
} from "@/service/dashboardService";

import { DashboardRequest } from "@/model/dashboardRequest";
import {
  IngresosCentroPobladoResponse,
  IngresosPorAmbitoResponse,
  IngresosPorCaserioResponse,
  TopIngresosResponse,
} from "@/model/dashboardResponse";

export function DashboardContainer() {
  const [selectedStartYear, setSelectedStartYear] = useState("2025");
  const [selectedEndYear, setSelectedEndYear] = useState("");
  const [selectedStartMonth, setSelectedStartMonth] = useState("");
  const [selectedEndMonth, setSelectedEndMonth] = useState("");

  // ---------------------------
  // ESTADOS PARA EL ÁREA CHART
  // ---------------------------
  const [areaChartData, setAreaChartData] = useState<unknown[]>([]);
  const [areaChartSeries, setAreaChartSeries] = useState<
    Array<{ dataKey: string; fill: string; stroke: string }>
  >([]);
  const [areaChartConfig, setAreaChartConfig] = useState<
    Record<string, { label: string; color: string }>
  >({});

  // ---------------------------
  // ESTADOS PARA TUS BARRAS VERTICALES
  // ---------------------------
  const [documentaryScopeBarData, setDocumentaryScopeBarData] = useState<
    { ambito: string; total: number }[]
  >([]);
  const [villageBarData, setVillageBarData] = useState<
    { caserio: string; totalDocumentos: number }[]
  >([]);

  // ---------------------------
  // ESTADOS PARA LOS BARRAS HORIZONTALES
  // ---------------------------
  // 1) Top con más documentos
  const [topMostVillagesBarData, setTopVillagesBarData] = useState<
    { caserio: string; totalDocumentos: number }[]
  >([]);

  // 2) Top con menos documentos
  const [topLeastVillagesBarData, setTopLeastVillagesBarData] = useState<
    { caserio: string; totalDocumentos: number }[]
  >([]);

  // EJEMPLO: data estática para un hipotético bar horizontal
  const [horizontalBarChartData] = useState<
    { departamento: string; ingresos: number }[]
  >([
    { departamento: "Ventas", ingresos: 4500 },
    { departamento: "Marketing", ingresos: 3200 },
    { departamento: "Desarrollo", ingresos: 5100 },
    { departamento: "Soporte", ingresos: 2800 },
  ]);

  // ---------------------------
  // TARJETAS DE EJEMPLO
  // ---------------------------
  const cardData: CardData[] = [
    {
      title: "Total Documentos",
      value: 1234,
      change: "+12.5%",
      icon: FileText,
      color: "text-rose-500",
      bgColor: "bg-black",
      trend: "up",
    },
    {
      title: "Tiempo Promedio",
      value: "2.5 días",
      change: "-8.3%",
      icon: Clock,
      color: "text-emerald-500",
      bgColor: "bg-orange-600",
      trend: "down",
    },
    {
      title: "Documentos Rechazados",
      value: 45,
      change: "+2.1%",
      icon: XCircle,
      color: "text-rose-500",
      bgColor: "bg-red-600",
      trend: "up",
    },
    {
      title: "Documentos Aprobados",
      value: 1189,
      change: "+15.3%",
      icon: CheckCircle,
      color: "text-violet-500",
      bgColor: "bg-green-600",
      trend: "up",
    },
  ];

  // ---------------------------
  // FUNCIÓN PARA TRANSFORMAR EL ÁREA CHART (centro poblado)
  // ---------------------------
  function transformDataCP(data: IngresosCentroPobladoResponse[]): unknown[] {
    const centrosSet = new Set<string>();

    data.forEach((item) => {
      item.centros?.forEach((c) => {
        centrosSet.add(c.centroPoblado);
      });
    });

    return data.map((item) => {
      const row: Record<string, unknown> = {};
      row.mes = item.mes;

      centrosSet.forEach((cp) => {
        row[cp] = 0;
      });

      item.centros?.forEach((c) => {
        row[c.centroPoblado] = c.totalDocumentos;
      });

      return row;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function generateSeriesAndConfig(data: any[]) {
    if (!data.length) {
      return { series: [], config: {} };
    }

    const allKeys = Object.keys(data[0]).filter((k) => k !== "mes");

    const palette = [
      "#EF4444",
      "#F97316",
      "#EAB308",
      "#84CC16",
      "#22C55E",
      "#14B8A6",
      "#3B82F6",
      "#6366F1",
      "#8B5CF6",
      "#EC4899",
    ];

    const series = allKeys.map((key, index) => {
      const color = palette[index % palette.length];
      return {
        dataKey: key,
        fill: color,
        stroke: color,
      };
    });

    const config = allKeys.reduce((acc, key, index) => {
      const color = palette[index % palette.length];
      acc[key] = { label: key, color };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);

    return { series, config };
  }

  // ---------------------------
  // useEffect PARA CARGAR DATA
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestPayload: DashboardRequest = {
          startYear: parseInt(selectedStartYear, 10),
          endYear: selectedEndYear ? parseInt(selectedEndYear, 10) : undefined,
          startMonth: parseInt(selectedStartMonth, 10),
          endMonth: selectedEndMonth ? parseInt(selectedEndMonth, 10) : undefined,
        };

        // 1) Documentos por Centro Poblado -> Área Chart
        const responseCP = await getTotalDocumentsByCentroPoblado(requestPayload);
        const transformedCP = transformDataCP(responseCP);
        const { series, config } = generateSeriesAndConfig(transformedCP);
        setAreaChartData(transformedCP);
        setAreaChartSeries(series);
        setAreaChartConfig(config);

        // 2) Documentos por Ámbito
        const responseDS: IngresosPorAmbitoResponse[] =
          await getTotalDocumentsByDocumentaryScope(requestPayload);
        setDocumentaryScopeBarData(
          responseDS.map((item) => ({
            ambito: item.ambito,
            total: item.total ?? 0,
          }))
        );

        // 3) Documentos por Caserío
        const responseVG: IngresosPorCaserioResponse[] =
          await getTotalDocumentsByVillage(requestPayload);
        setVillageBarData(
          responseVG.map((item) => ({
            caserio: item.caserio,
            totalDocumentos: item.totalDocumentos ?? 0,
          }))
        );

        // 4) Top Caseríos con Más Documentos
        const responseTopMost: TopIngresosResponse[] =
          await getTopVillagesWithMostDocuments(requestPayload);
        setTopVillagesBarData(
          responseTopMost.map((item) => ({
            caserio: item.caserio,
            totalDocumentos: item.totalDocumentos ?? 0,
          }))
        );

        // 5) Top Caseríos con Menos Documentos
        const responseTopLeast: TopIngresosResponse[] =
          await getTopVillagesWithLeastDocuments(requestPayload);
        setTopLeastVillagesBarData(
          responseTopLeast.map((item) => ({
            caserio: item.caserio,
            totalDocumentos: item.totalDocumentos ?? 0,
          }))
        );
      } catch (error) {
        console.error("Error al cargar data:", error);
      }
    };

    fetchData();
  }, [selectedStartYear, selectedEndYear, selectedStartMonth, selectedEndMonth]);

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-3 sm:pl-2 bg-transparent">
      <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">
        {/* Filtro de Fechas */}
        <DashboardDateFilter
          selectedStartYear={selectedStartYear}
          selectedEndYear={selectedEndYear}
          selectedStartMonth={selectedStartMonth}
          selectedEndMonth={selectedEndMonth}
          onStartYearChange={setSelectedStartYear}
          onEndYearChange={setSelectedEndYear}
          onStartMonthChange={setSelectedStartMonth}
          onEndMonthChange={setSelectedEndMonth}
        />

        {/* Tarjetas */}
        <StatCards cards={cardData} />

        {/* Sección de gráficos */}
        <ChartsSection
          // Área chart
          areaChartData={areaChartData}
          areaChartSeries={areaChartSeries}
          areaChartConfig={areaChartConfig}

          // Barras verticales
          documentaryScopeBarData={documentaryScopeBarData}
          villageBarData={villageBarData}

          // BARRAS HORIZONTALES
          topMostVillagesBarData={topMostVillagesBarData}
          topLeastVillagesBarData={topLeastVillagesBarData}

          // Data ejemplo
          horizontalBarChartData={horizontalBarChartData}
        />
      </div>
    </div>
  );
}
