import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { CentroPoblado } from "@/model/centroPoblado";
import { CentroPobladoModal } from "@/components/modal/centro-poblado-modal/CentroPobladoModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { CentroPobladoPaginatedResponse } from "@/model/centroPobladoPaginatedResponse";

const centrosPobladosData: CentroPoblado[] = [
  { id: 1, nombreCentroPoblado: "Centro Poblado 1" },
  { id: 2, nombreCentroPoblado: "Centro Poblado 2" },
  { id: 3, nombreCentroPoblado: "Centro Poblado 3" },
  { id: 4, nombreCentroPoblado: "Centro Poblado 4" },
  { id: 5, nombreCentroPoblado: "Centro Poblado 5" },
];

const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const CentroPobladoPage: React.FC = () => {
  const [centrosPobladosState, setCentrosPobladosState] = useState<CentroPobladoPaginatedResponse>({
    data: centrosPobladosData,
    pagination: {
      currentPage: 1,
      pageSize: 4,
      totalItems: centrosPobladosData.length,
      totalPages: Math.ceil(centrosPobladosData.length / 4),
    },
  });
  const [, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCentroPoblado, setSelectedCentroPoblado] = useState<CentroPoblado | undefined>(
    undefined
  );
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const totalPages = centrosPobladosState.pagination.totalPages;

  const filteredCentrosPoblados = useMemo(() => {
    return centrosPobladosState.data.filter((centroPoblado) =>
      centroPoblado.nombreCentroPoblado.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [centrosPobladosState.data, searchTerm]);

  const currentCentrosPoblados = useMemo(() => {
    const startIndex =
      (centrosPobladosState.pagination.currentPage - 1) *
      centrosPobladosState.pagination.pageSize;
    return filteredCentrosPoblados.slice(
      startIndex,
      startIndex + centrosPobladosState.pagination.pageSize
    );
  }, [centrosPobladosState.pagination.currentPage, centrosPobladosState.pagination.pageSize, filteredCentrosPoblados]);

  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const centroPoblado = centrosPobladosState.data.find((c) => c.id === id);
      if (centroPoblado) {
        setSelectedCentroPoblado(centroPoblado);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const centroPoblado = centrosPobladosState.data.find((c) => c.id === id);
      if (centroPoblado) {
        setSelectedCentroPoblado(centroPoblado);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCentroPoblado) {
      const updatedData = centrosPobladosState.data.filter(
        (c) => c.id !== selectedCentroPoblado.id
      );
      const totalItems = updatedData.length;
      const totalPages = Math.ceil(totalItems / centrosPobladosState.pagination.pageSize);
      setCentrosPobladosState({
        data: updatedData,
        pagination: {
          ...centrosPobladosState.pagination,
          totalItems,
          totalPages,
          currentPage:
            centrosPobladosState.pagination.currentPage > totalPages
              ? totalPages
              : centrosPobladosState.pagination.currentPage,
        },
      });
      setIsDeleteModalOpen(false);
      setSelectedCentroPoblado(undefined);
      setDataVersion((prev) => prev + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCentrosPobladosState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        currentPage: page,
      },
    }));
    setCurrentPage(page);
  };

  const handleModalSubmit = async (data: CentroPoblado) => {
    if (data.id) {
      const updatedData = centrosPobladosState.data.map((c) =>
        c.id === data.id ? data : c
      );
      setCentrosPobladosState((prevState) => ({
        ...prevState,
        data: updatedData,
      }));
    } else {
      const newId =
        centrosPobladosState.data.length > 0
          ? Math.max(...centrosPobladosState.data.map((c) => c.id || 0)) + 1
          : 1;
      const newCentroPoblado = { ...data, id: newId };
      const updatedData = [...centrosPobladosState.data, newCentroPoblado];
      const totalItems = updatedData.length;
      const totalPages = Math.ceil(totalItems / centrosPobladosState.pagination.pageSize);
      setCentrosPobladosState({
        data: updatedData,
        pagination: {
          ...centrosPobladosState.pagination,
          totalItems,
          totalPages,
        },
      });
    }
    setIsModalOpen(false);
    setSelectedCentroPoblado(undefined);
    setDataVersion((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setSelectedCentroPoblado(undefined);
    setIsModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCentrosPobladosState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        currentPage: 1,
      },
    }));
    setCurrentPage(1);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          Centros Poblados
        </h2>
        <Button
          onClick={() => {
            setSelectedCentroPoblado(undefined);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#03A64A] text-white rounded hover:bg-[#028a3b] transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Centro Poblado
        </Button>
      </div>

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="relative mb-4 p-4 border-b border-gray-200">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Buscar centros poblados..."
            className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
            aria-label="Buscar centros poblados"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${centrosPobladosState.pagination.currentPage}-${dataVersion}-${searchTerm}`}
              variants={tableVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Id
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre del Centro Poblado
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCentrosPoblados.map((centroPoblado) => (
                    <TableRow
                      key={centroPoblado.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        {centroPoblado.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        {centroPoblado.nombreCentroPoblado}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap text-right">
                        <Button
                          onClick={() => handleEdit(centroPoblado.id)}
                          className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(centroPoblado.id)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={centrosPobladosState.pagination.currentPage}
            totalPages={centrosPobladosState.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <CentroPobladoModal
          isOpen={isModalOpen}
          centroPoblado={selectedCentroPoblado}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedCentroPoblado?.nombreCentroPoblado || ""}
        />
      )}
    </div>
  );
};

export default CentroPobladoPage;