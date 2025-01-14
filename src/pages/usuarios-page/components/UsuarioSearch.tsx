import { Search } from "lucide-react";
import { PiBroom } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
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
    onClear: () => void; // Added to match TrabajadorSearch
}

export const UsuarioSearch: React.FC<UsuarioSearchProps> = ({
                                                                searchTerm,
                                                                statusFilter,
                                                                onSearch,
                                                                onStatusFilterChange,
                                                                onClear,
                                                            }) => {
    const [isBackspaceHeld, setIsBackspaceHeld] = useState(false);
    const [deferredValue, setDeferredValue] = useState(searchTerm);

    useEffect(() => {
        setDeferredValue(searchTerm);
    }, [searchTerm]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            setIsBackspaceHeld(true);
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            setIsBackspaceHeld(false);
            const syntheticEvent = {
                target: e.currentTarget,
            } as React.ChangeEvent<HTMLInputElement>;
            onSearch(syntheticEvent);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setDeferredValue(newValue);

        if (!isBackspaceHeld) {
            onSearch(e);
        }
    };

    return (
        <div className="relative mb-4 p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Buscar usuarios..."
                        className="pl-10 pr-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
                        aria-label="Buscar usuarios"
                        value={deferredValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                    />
                    {deferredValue && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                            onClick={onClear}
                            aria-label="Limpiar búsqueda"
                        >
                            <PiBroom className="w-5 h-5" />
                        </button>
                    )}
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
        </div>
    );
};