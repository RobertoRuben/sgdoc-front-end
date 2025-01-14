import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UsuarioSearchProps {
    searchTerm: string;
    statusFilter: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStatusFilterChange: (value: string) => void;
}

export const UsuarioSearch: React.FC<UsuarioSearchProps> = ({
                                                                searchTerm,
                                                                statusFilter,
                                                                onSearch,
                                                                onStatusFilterChange,
                                                            }) => {
    return (
        <div className="relative mb-4 p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Buscar usuarios..."
                    className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
                    aria-label="Buscar usuarios"
                    value={searchTerm}
                    onChange={onSearch}
                />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};