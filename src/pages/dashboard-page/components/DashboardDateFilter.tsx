"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter } from "lucide-react";

interface DashboardDateFilterProps {
  onStartYearChange: (year: string) => void;
  onEndYearChange: (year: string) => void;
  onStartMonthChange: (month: string) => void;
  onEndMonthChange: (month: string) => void;
  selectedStartYear: string;
  selectedEndYear: string;
  selectedStartMonth: string;
  selectedEndMonth: string;
}

export function DashboardDateFilter({
  onStartYearChange,
  onEndYearChange,
  onStartMonthChange,
  onEndMonthChange,
  selectedStartYear,
  selectedEndYear,
  selectedStartMonth,
  selectedEndMonth,
}: DashboardDateFilterProps) {
  const years = ["2023", "2024", "2025"];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const handleReset = () => {
    onStartYearChange("2023");
    onEndYearChange("");
    onStartMonthChange("1");
    onEndMonthChange("");
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Filtros de Tiempo</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reiniciar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Fecha Inicial */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Fecha Inicial
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Año
                </label>
                <Select value={selectedStartYear} onValueChange={onStartYearChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={`start-${year}`} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Mes
                </label>
                <Select value={selectedStartMonth} onValueChange={onStartMonthChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={`start-${month}`} value={String(index + 1)}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fecha Final */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Fecha Final
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Año
                </label>
                <Select value={selectedEndYear} onValueChange={onEndYearChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={`end-${year}`} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Mes
                </label>
                <Select value={selectedEndMonth} onValueChange={onEndMonthChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={`end-${month}`} value={String(index + 1)}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}