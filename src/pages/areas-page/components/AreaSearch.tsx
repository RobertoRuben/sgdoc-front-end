import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AreaSearchProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AreaSearch: React.FC<AreaSearchProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="relative mb-4 p-4 border-b border-gray-200">
      <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        id="search"
        name="search"
        placeholder="Buscar áreas..."
        className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
        aria-label="Buscar áreas"
        value={searchTerm}
        onChange={onSearch}
      />
    </div>
  );
};