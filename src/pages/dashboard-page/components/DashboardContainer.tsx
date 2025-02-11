"use client"

import { useState } from "react"
import { DateRange } from "react-day-picker"
import { FileText, Clock, XCircle, CheckCircle } from "lucide-react"

import { DashboardDateFilter } from "./DashboardDateFilter"
import { StatCards, CardData } from "./StatCards"
import { ChartsSection } from "./ChartsSection"

export function DashboardContainer() {
  // Estado para el rango de fechas
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })

  // Data para las tarjetas de estadística
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
  ]

  // Data para los gráficos
  const areaChartData = [
    { month: "Ene", documentos: 65, tramites: 28 },
    { month: "Feb", documentos: 59, tramites: 48 },
    { month: "Mar", documentos: 80, tramites: 40 },
    { month: "Abr", documentos: 81, tramites: 19 },
    { month: "May", documentos: 56, tramites: 96 },
    { month: "Jun", documentos: 55, tramites: 27 },
    { month: "Jul", documentos: 40, tramites: 100 },
  ]

  const barChartData = [
    { categoria: "A", valor: 120 },
    { categoria: "B", valor: 80 },
    { categoria: "C", valor: 100 },
    { categoria: "D", valor: 60 },
  ]

  const horizontalBarChartData = [
    { departamento: "Ventas", ingresos: 4500 },
    { departamento: "Marketing", ingresos: 3200 },
    { departamento: "Desarrollo", ingresos: 5100 },
    { departamento: "Soporte", ingresos: 2800 },
  ]

  const pieChartData = [
    { name: "Completados", value: 60 },
    { name: "En Proceso", value: 25 },
    { name: "Pendientes", value: 15 },
  ]

  const lineChartData = [
    { year: "2019", documentos: 850 },
    { year: "2020", documentos: 940 },
    { year: "2021", documentos: 1250 },
    { year: "2022", documentos: 1420 },
    { year: "2023", documentos: 1680 },
  ]

  const dailyBarChartData = [
    { ciudad: "Nueva Aurora", documentos: 45 },
    { ciudad: "Puerto Cristal", documentos: 52 },
    { ciudad: "Valle Dorado", documentos: 38 },
    { ciudad: "Monte Azul", documentos: 41 },
    { ciudad: "Costa Verde", documentos: 55 },
    { ciudad: "Sierra Nevada", documentos: 48 },
    { ciudad: "Lago Luna", documentos: 43 },
    { ciudad: "Villa Sol", documentos: 39 },
    { ciudad: "Río Plata", documentos: 47 },
    { ciudad: "Bosque Real", documentos: 50 },
    { ciudad: "Isla Bella", documentos: 44 },
    { ciudad: "Ciudad Estrella", documentos: 51 },
    { ciudad: "Mar Esmeralda", documentos: 46 },
    { ciudad: "Valle Lunar", documentos: 42 },
    { ciudad: "Monte Oro", documentos: 49 },
    { ciudad: "Puerto Zafiro", documentos: 53 },
    { ciudad: "Costa Azul", documentos: 40 },
    { ciudad: "Sierra Alta", documentos: 45 },
    { ciudad: "Lago Cristal", documentos: 54 },
    { ciudad: "Villa Rosa", documentos: 47 },
    { ciudad: "Río Dorado", documentos: 43 },
    { ciudad: "Bosque Verde", documentos: 51 },
    { ciudad: "Isla Verde", documentos: 48 },
    { ciudad: "Ciudad Luna", documentos: 44 },
    { ciudad: "Mar Celeste", documentos: 50 },
    { ciudad: "Valle Sol", documentos: 46 },
    { ciudad: "Monte Luna", documentos: 52 },
    { ciudad: "Puerto Coral", documentos: 49 },
    { ciudad: "Costa Brillante", documentos: 45 },
    { ciudad: "Sierra Dorada", documentos: 53 },
    { ciudad: "Lago Azul", documentos: 47 },
    { ciudad: "Villa Diamante", documentos: 51 },
    { ciudad: "Río Cristalino", documentos: 48 }
];

  return (
      <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-3 sm:pl-2 bg-transparent">
        <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">
          <DashboardDateFilter
              dateRange={dateRange}
              onChange={(range) => setDateRange(range)}
          />

          <StatCards cards={cardData} />

          <ChartsSection
              areaChartData={areaChartData}
              barChartData={barChartData}
              horizontalBarChartData={horizontalBarChartData}
              pieChartData={pieChartData}
              lineChartData={lineChartData}
              dailyBarChartData={dailyBarChartData}
          />
        </div>
      </div>
  )
}
