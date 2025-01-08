import { Search } from 'lucide-react';
import { PiBroom } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';

interface CategoriaSearchProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const CategoriaSearch: React.FC<CategoriaSearchProps> = ({ 
  searchTerm, 
  onSearch, 
  onClear 
}) => {
  const [isBackspaceHeld, setIsBackspaceHeld] = useState(false);
  const [deferredValue, setDeferredValue] = useState(searchTerm);

  useEffect(() => {
    setDeferredValue(searchTerm);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      setIsBackspaceHeld(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      setIsBackspaceHeld(false);
      const syntheticEvent = {
        target: e.currentTarget
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
      <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        id="search"
        name="search"
        placeholder="Buscar categorías..."
        className="pl-10 pr-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
        aria-label="Buscar categorías"
        value={deferredValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
      {deferredValue && (
        <button
          type="button"
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
          onClick={onClear}
          aria-label="Limpiar búsqueda"
        >
          <PiBroom className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};