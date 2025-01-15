// ListaDocumentosSearch.tsx
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Ambito } from "@/model/ambito";
import { CentroPoblado } from "@/model/centroPoblado";
import { Caserio } from "@/model/caserio";

interface ListaDocumentosSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  selectedCaserio: string | undefined;
  setSelectedCaserio: React.Dispatch<React.SetStateAction<string | undefined>>;

  selectedCentroPoblado: string | undefined;
  setSelectedCentroPoblado: React.Dispatch<React.SetStateAction<string | undefined>>;

  selectedAmbito: string | undefined;
  setSelectedAmbito: React.Dispatch<React.SetStateAction<string | undefined>>;

  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;

  ambitos: Ambito[];
  centrosPoblados: CentroPoblado[];
  caserios: Caserio[];
}

export const ListaDocumentosSearch: React.FC<ListaDocumentosSearchProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCaserio,
  setSelectedCaserio,
  selectedCentroPoblado,
  setSelectedCentroPoblado,
  selectedAmbito,
  setSelectedAmbito,
  selectedDate,
  setSelectedDate,
  ambitos,
  centrosPoblados,
  caserios,
}) => {
  return (
    <div className="mb-4 p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
      {/* Campo de búsqueda */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          id="search"
          placeholder="Buscar documentos..."
          className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
          aria-label="Buscar documentos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Select de Centro Poblado */}
      <Select
        onValueChange={(val) =>
          setSelectedCentroPoblado(val === "all" ? undefined : val)
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={selectedCentroPoblado || "Centro Poblado"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {centrosPoblados.map((centroPoblado) => (
            // Usamos el id como valor (convertido a string)
            <SelectItem key={centroPoblado.id} value={String(centroPoblado.id)}>
              {centroPoblado.nombreCentroPoblado}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select de Caserío */}
      <Select
        onValueChange={(val) =>
          setSelectedCaserio(val === "all" ? undefined : val)
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={selectedCaserio || "Caserío"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {caserios.map((caserio) => (
            // Aquí se muestran solo los nombres, tal como se requiere
            <SelectItem key={caserio.id} value={caserio.nombreCaserio}>
              {caserio.nombreCaserio}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select de Ámbito */}
      <Select
        onValueChange={(val) =>
          setSelectedAmbito(val === "all" ? undefined : val)
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={selectedAmbito || "Ámbito"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {ambitos.map((ambito) => (
            // Si necesitas enviar el id, usa String(ambito.id), sino, si el valor se muestra con el nombre, ajústalo
            <SelectItem key={ambito.id} value={String(ambito.id)}>
              {ambito.nombreAmbito}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selección de Fecha */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-[180px] justify-start text-left font-normal">
            {selectedDate ? selectedDate.toLocaleDateString() : "Seleccionar Fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
};
