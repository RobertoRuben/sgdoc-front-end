import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Ambito } from "@/model/ambito";
import { AmbitoModal } from "@/components/modal/ambito-modal/AmbitoModal";
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
import { AmbitoPaginatedResponse } from "@/model/ambitoPaginatedResponse";

const ambitosData: Ambito[] = [
  { id: 1, nombreAmbito: "Ámbito 1" },
  { id: 2, nombreAmbito: "Ámbito 2" },
  { id: 3, nombreAmbito: "Ámbito 3" },
  { id: 4, nombreAmbito: "Ámbito 4" },
  { id: 5, nombreAmbito: "Ámbito 5" },
];

const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const rowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const AmbitoPage: React.FC = () => {
  const [ambitosState, setAmbitosState] = useState<AmbitoPaginatedResponse>({
    data: ambitosData,
    pagination: {
      currentPage: 1,
      pageSize: 4,
      totalItems: ambitosData.length,
      totalPages: Math.ceil(ambitosData.length / 4),
    },
  });
  const [, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedAmbito, setSelectedAmbito] = useState<Ambito | undefined>(
    undefined
  );
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const totalPages = ambitosState.pagination.totalPages;

  const filteredAmbitos = useMemo(() => {
    return ambitosState.data.filter((ambito) =>
      ambito.nombreAmbito.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ambitosState.data, searchTerm]);

  const currentAmbitos = useMemo(() => {
    const startIndex =
      (ambitosState.pagination.currentPage - 1) *
      ambitosState.pagination.pageSize;
    return filteredAmbitos.slice(
      startIndex,
      startIndex + ambitosState.pagination.pageSize
    );
  }, [
    ambitosState.pagination.currentPage,
    ambitosState.pagination.pageSize,
    filteredAmbitos,
  ]);

  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const ambito = ambitosState.data.find((a) => a.id === id);
      if (ambito) {
        setSelectedAmbito(ambito);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const ambito = ambitosState.data.find((a) => a.id === id);
      if (ambito) {
        setSelectedAmbito(ambito);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedAmbito) {
      const updatedData = ambitosState.data.filter(
        (a) => a.id !== selectedAmbito.id
      );
      const totalItems = updatedData.length;
      const totalPages = Math.ceil(
        totalItems / ambitosState.pagination.pageSize
      );
      setAmbitosState({
        data: updatedData,
        pagination: {
          ...ambitosState.pagination,
          totalItems,
          totalPages,
          currentPage:
            ambitosState.pagination.currentPage > totalPages
              ? totalPages
              : ambitosState.pagination.currentPage,
        },
      });
      setIsDeleteModalOpen(false);
      setSelectedAmbito(undefined);
      setDataVersion((prev) => prev + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setAmbitosState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        currentPage: page,
      },
    }));
    setCurrentPage(page);
  };

  const handleModalSubmit = async (data: Ambito) => {
    if (data.id) {
      // Actualizar ámbito existente
      const updatedData = ambitosState.data.map((a) =>
        a.id === data.id ? data : a
      );
      setAmbitosState((prevState) => ({
        ...prevState,
        data: updatedData,
      }));
    } else {
      // Agregar nuevo ámbito
      const newId =
        ambitosState.data.length > 0
          ? Math.max(...ambitosState.data.map((a) => a.id || 0)) + 1
          : 1;
      const newAmbito = { ...data, id: newId };
      const updatedData = [...ambitosState.data, newAmbito];
      const totalItems = updatedData.length;
      const totalPages = Math.ceil(
        totalItems / ambitosState.pagination.pageSize
      );
      setAmbitosState({
        data: updatedData,
        pagination: {
          ...ambitosState.pagination,
          totalItems,
          totalPages,
        },
      });
    }
    setIsModalOpen(false);
    setSelectedAmbito(undefined);
    setDataVersion((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setSelectedAmbito(undefined);
    setIsModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setAmbitosState((prevState) => ({
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
          Ámbitos
        </h2>
        <Button
          onClick={() => {
            setSelectedAmbito(undefined);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#145A32] text-white rounded hover:bg-[#0E3D22] transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Ámbito
        </Button>
      </div>

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="relative mb-4 p-4 border-b border-gray-200">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Buscar ámbitos..."
            className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
            aria-label="Buscar ámbitos"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${ambitosState.pagination.currentPage}-${dataVersion}-${searchTerm}`}
              variants={tableVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader>
                  <TableRow className="bg-[#145A32] border-b border-[#0E3D22] hover:bg-[#0E3D22]">
                    <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Id
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Nombre del Ámbito
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAmbitos.map((ambito, index) => (
                    <motion.tr
                      key={ambito.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                    >
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ambito.id}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {ambito.nombreAmbito}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          onClick={() => handleEdit(ambito.id)}
                          className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(ambito.id)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={ambitosState.pagination.currentPage}
            totalPages={ambitosState.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <AmbitoModal
          isOpen={isModalOpen}
          ambito={selectedAmbito}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedAmbito?.nombreAmbito || ""}
        />
      )}
    </div>
  );
};

export default AmbitoPage;
