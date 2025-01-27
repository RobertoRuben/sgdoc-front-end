import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface IngresoDocumentosSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const IngresoDocumentosSearch: React.FC<IngresoDocumentosSearchProps> = ({
  searchTerm,
  onSearch,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="relative mb-4 p-4 border-b border-gray-200">
      <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        id="search"
        placeholder="Buscar documento por DNI o por N° de Registro"
        className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
        aria-label="Buscar documentos"
        value={localSearchTerm}
        onChange={handleChange}
      />
    </div>
  );
};
