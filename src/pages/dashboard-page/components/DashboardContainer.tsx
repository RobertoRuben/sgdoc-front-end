"use client";

import { useState, useEffect } from "react";
import { FileText, Clock, XCircle, CheckCircle } from "lucide-react";
import { DashboardDateFilter } from "./DashboardDateFilter";
import { StatCards, CardData } from "./StatCards";
import { ChartsSection } from "./ChartsSection";

import {
  getTotalDocumentsByCentroPoblado,
  getTotalDocumentsByDocumentaryScope,
  getTotalDocumentsByVillage,
  getTopVillagesWithMostDocuments,
  getTopVillagesWithLeastDocuments,
  getTotalDocuments,
  getAverageTotalDocuments,
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

  const [areaChartData, setAreaChartData] = useState<unknown[]>([]);
  const [areaChartSeries, setAreaChartSeries] = useState<
    Array<{ dataKey: string; fill: string; stroke: string }>
  >([]);
  const [areaChartConfig, setAreaChartConfig] = useState<
    Record<string, { label: string; color: string }>
  >({});

  const [documentaryScopeBarData, setDocumentaryScopeBarData] = useState<
    { ambito: string; total: number }[]
  >([]);
  const [villageBarData, setVillageBarData] = useState<
    { caserio: string; totalDocumentos: number }[]
  >([]);

  const [topMostVillagesBarData, setTopVillagesBarData] = useState<
    { caserio: string; totalDocumentos: number }[]
  >([]);
  const [topLeastVillagesBarData, setTopLeastVillagesBarData] = useState<
    { caserio: string; totalDocumentos: number }[]
  >([]);

  const [totalDocuments, setTotalDocuments] = useState<number | null>(null);
  const [averageDocuments, setAverageDocuments] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestPayload: DashboardRequest = {
          startYear: parseInt(selectedStartYear, 10),
          endYear: selectedEndYear ? parseInt(selectedEndYear, 10) : undefined,
          startMonth: parseInt(selectedStartMonth, 10),
          endMonth: selectedEndMonth ? parseInt(selectedEndMonth, 10) : undefined,
        };

        const responseCP = await getTotalDocumentsByCentroPoblado(requestPayload);
        const transformedCP = transformDataCP(responseCP);
        const { series, config } = generateSeriesAndConfig(transformedCP);
        setAreaChartData(transformedCP);
        setAreaChartSeries(series);
        setAreaChartConfig(config);

        const responseDS: IngresosPorAmbitoResponse[] =
          await getTotalDocumentsByDocumentaryScope(requestPayload);
        setDocumentaryScopeBarData(
          responseDS.map((item) => ({
            ambito: item.ambito,
            total: item.total ?? 0,
          }))
        );

        const responseVG: IngresosPorCaserioResponse[] =
          await getTotalDocumentsByVillage(requestPayload);
        setVillageBarData(
          responseVG.map((item) => ({
            caserio: item.caserio,
            totalDocumentos: item.totalDocumentos ?? 0,
          }))
        );

        const responseTopMost: TopIngresosResponse[] =
          await getTopVillagesWithMostDocuments(requestPayload);
        setTopVillagesBarData(
          responseTopMost.map((item) => ({
            caserio: item.caserio,
            totalDocumentos: item.totalDocumentos ?? 0,
          }))
        );

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

  useEffect(() => {
    const fetchTotalAndAverage = async () => {
      try {
        const requestPayload: DashboardRequest = {
          startYear: parseInt(selectedStartYear, 10),
          endYear: selectedEndYear ? parseInt(selectedEndYear, 10) : undefined,
          startMonth: parseInt(selectedStartMonth, 10),
          endMonth: selectedEndMonth ? parseInt(selectedEndMonth, 10) : undefined,
        };

        const totalRes = await getTotalDocuments(requestPayload);
        setTotalDocuments(totalRes?.totalDocumentos ?? 0);

        const averageRes = await getAverageTotalDocuments(requestPayload);
        setAverageDocuments(averageRes?.promedioIngresos ?? 0);
      } catch (error) {
        console.error("Error al cargar total y promedio de documentos:", error);
      }
    };

    fetchTotalAndAverage();
  }, [selectedStartYear, selectedEndYear, selectedStartMonth, selectedEndMonth]);

  const cardData: CardData[] = [
    {
      title: "Total de Documentos Ingresados",
      value: totalDocuments !== null ? totalDocuments : "Cargando...",
      change: "",
      icon: FileText,
      color: "text-rose-500",
      bgColor: "bg-black",
      trend: "up",
    },
    {
      title: "Promedio de Documentos Ingresados por Día",
      value: averageDocuments !== null ? averageDocuments : "Cargando...",
      change: "",
      icon: Clock,
      color: "text-emerald-500",
      bgColor: "bg-yellow-500",
      trend: "down",
    },
    {
      title: "Documentos Rechazados",
      value: 45,
      change: "",
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

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-3 sm:pl-2 bg-transparent">
      <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">
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

        <StatCards cards={cardData} />

        <ChartsSection
          areaChartData={areaChartData}
          areaChartSeries={areaChartSeries}
          areaChartConfig={areaChartConfig}
          documentaryScopeBarData={documentaryScopeBarData}
          villageBarData={villageBarData}
          topMostVillagesBarData={topMostVillagesBarData}
          topLeastVillagesBarData={topLeastVillagesBarData}
        />
      </div>
    </div>
  );
}
