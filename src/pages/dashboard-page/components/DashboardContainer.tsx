"use client";

import { useState, useEffect } from "react";
import { FileText, Clock, XCircle, CheckCircle } from "lucide-react";
import { DashboardDateFilter } from "./DashboardDateFilter";
import { StatCards, CardData } from "./StatCards";
import { ChartsSection } from "./ChartsSection";
import { getTotalDocumentsByCentroPoblado } from "@/service/dashboardService";
import { DashboardRequest } from "@/model/dashboardRequest";
import { IngresosCentroPobladoResponse } from "@/model/dashboardResponse";

export function DashboardContainer() {

  const [selectedStartYear, setSelectedStartYear] = useState("2025");
  const [selectedEndYear, setSelectedEndYear] = useState("");
  const [selectedStartMonth, setSelectedStartMonth] = useState("");
  const [selectedEndMonth, setSelectedEndMonth] = useState("");


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [areaChartData, setAreaChartData] = useState<any[]>([]);
  const [areaChartSeries, setAreaChartSeries] = useState<
    Array<{ dataKey: string; fill: string; stroke: string }>
  >([]);
  const [areaChartConfig, setAreaChartConfig] = useState<
    Record<string, { label: string; color: string }>
  >({});


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


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformData(data: IngresosCentroPobladoResponse[]): any[] {
    const centrosSet = new Set<string>();

    data.forEach((item) => {
      item.centros?.forEach((c) => {
        centrosSet.add(c.centroPoblado);
      });
    });

    return data.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row: Record<string, any> = {};
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

        const response = await getTotalDocumentsByCentroPoblado(requestPayload);

        const transformed = transformData(response);
        const { series, config } = generateSeriesAndConfig(transformed);

        setAreaChartData(transformed);
        setAreaChartSeries(series);
        setAreaChartConfig(config);
      } catch (error) {
        console.error("Error al cargar data de centro poblado:", error);
      }
    };

    fetchData();
  }, [selectedStartYear, selectedEndYear, selectedStartMonth, selectedEndMonth]);

  const barChartData = [
    { categoria: "A", valor: 120 },
    { categoria: "B", valor: 80 },
    { categoria: "C", valor: 100 },
    { categoria: "D", valor: 60 },
  ];

  const horizontalBarChartData = [
    { departamento: "Ventas", ingresos: 4500 },
    { departamento: "Marketing", ingresos: 3200 },
    { departamento: "Desarrollo", ingresos: 5100 },
    { departamento: "Soporte", ingresos: 2800 },
  ];

  const pieChartData = [
    { name: "Completados", value: 60 },
    { name: "En Proceso", value: 25 },
    { name: "Pendientes", value: 15 },
  ];

  const lineChartData = [
    { year: "2019", documentos: 850 },
    { year: "2020", documentos: 940 },
    { year: "2021", documentos: 1250 },
    { year: "2022", documentos: 1420 },
    { year: "2023", documentos: 1680 },
  ];

  const dailyBarChartData = [
    { ciudad: "Nueva Aurora", documentos: 45 },
    { ciudad: "Puerto Cristal", documentos: 52 },
    // ...
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
          barChartData={barChartData}
          horizontalBarChartData={horizontalBarChartData}
          pieChartData={pieChartData}
          lineChartData={lineChartData}
          dailyBarChartData={dailyBarChartData}
        />
      </div>
    </div>
  );
}
