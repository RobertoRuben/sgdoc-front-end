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
  const allYears = Array.from({ length: 10 }, (_, index) => String(2025 + index));
  const years = ["all", ...allYears];

  const months = [
    { value: "all", label: "Todos" },
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const handleReset = () => {
    onStartYearChange("all");
    onEndYearChange("all");
    onStartMonthChange("all");
    onEndMonthChange("all");
  };

  const handleStartYearChange = (value: string) => {
    onStartYearChange(value);
    onEndYearChange(value === "all" ? "all" : "");
  };

  const handleStartMonthChange = (value: string) => {
    onStartMonthChange(value);
    onEndMonthChange(value === "all" ? "all" : "");
  };

  const getEndYears = () => {
    if (selectedStartYear === "all") return allYears;
    return allYears.filter(year => Number(year) > Number(selectedStartYear));
  };

  const getEndMonths = () => {
    if (selectedStartMonth === "all") return months;
    return months.filter(month => 
      month.value === "all" ? false : Number(month.value) > Number(selectedStartMonth)
    );
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
                <Select value={selectedStartYear} onValueChange={handleStartYearChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={`start-${year}`} value={year}>
                        {year === "all" ? "Todos los años" : year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Mes
                </label>
                <Select value={selectedStartMonth} onValueChange={handleStartMonthChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={`start-${month.value}`} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

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
                <Select 
                  value={selectedEndYear} 
                  onValueChange={onEndYearChange}
                  disabled={selectedStartYear === "all"}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue 
                      placeholder={
                        selectedStartYear === "all" 
                          ? "Seleccionar año" 
                          : `Seleccione después de ${selectedStartYear}`
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getEndYears().map((year) => (
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
                <Select 
                  value={selectedEndMonth} 
                  onValueChange={onEndMonthChange}
                  disabled={selectedStartMonth === "all"}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue 
                      placeholder={
                        selectedStartMonth === "all" 
                          ? "Seleccionar mes" 
                          : `Seleccione después de ${
                              months.find(m => m.value === selectedStartMonth)?.label
                            }`
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getEndMonths().map((month) => (
                      <SelectItem key={`end-${month.value}`} value={month.value}>
                        {month.label}
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