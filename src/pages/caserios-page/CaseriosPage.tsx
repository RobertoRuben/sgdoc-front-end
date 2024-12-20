import React, { useState, useMemo } from "react";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaserioPaginatedResponse } from "@/model/caserioPaginatedResponse";
import { CaserioDetails } from "@/model/caserioDetails";
import { Caserio } from "@/model/caserio";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { Pagination } from "@/components/ui/pagination";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { CaserioModal } from "@/components/modal/caserio-modal/CaserioModal";

const initialCaserios: CaserioPaginatedResponse = {
  data: [
    { id: 1, nombreCaserio: "Caserio 1", nombreCentroPoblado: "Centro 1" },
    { id: 2, nombreCaserio: "Caserio 2", nombreCentroPoblado: "Centro 2" },
    { id: 3, nombreCaserio: "Caserio 3", nombreCentroPoblado: "Centro 3" },
    { id: 4, nombreCaserio: "Caserio 4", nombreCentroPoblado: "Centro 4" },
    { id: 5, nombreCaserio: "Caserio 5", nombreCentroPoblado: "Centro 5" },
  ],
  pagination: {
    currentPage: 1,
    pageSize: 2,
    totalItems: 5,
    totalPages: 3,
  },
};

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

const CaseriosPage: React.FC = () => {
  const [caseriosState, setCaserios] =
    useState<CaserioPaginatedResponse>(initialCaserios);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCaserio, setSelectedCaserio] = useState<
    CaserioDetails | undefined
  >(undefined);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const totalPages = caseriosState.pagination.totalPages;

  const filteredCaserios = useMemo(() => {
    return caseriosState.data.filter((caserio) => {
      return (
        caserio.nombreCaserio
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        caserio.nombreCentroPoblado
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [caseriosState.data, searchTerm]);

  const currentCaserios = useMemo(() => {
    const startIndex = (currentPage - 1) * caseriosState.pagination.pageSize;
    return filteredCaserios.slice(
      startIndex,
      startIndex + caseriosState.pagination.pageSize
    );
  }, [
    currentPage,
    dataVersion,
    filteredCaserios,
    caseriosState.pagination.pageSize,
  ]);

  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const caserioDetails = caseriosState.data.find((c) => c.id === id);
      if (caserioDetails) {
        setSelectedCaserio(caserioDetails);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const caserio = caseriosState.data.find((c) => c.id === id);
      if (caserio) {
        setSelectedCaserio(caserio);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCaserio?.id) {
      setCaserios({
        ...caseriosState,
        data: caseriosState.data.filter((c) => c.id !== selectedCaserio.id),
        pagination: {
          ...caseriosState.pagination,
          totalItems: caseriosState.pagination.totalItems - 1,
          totalPages: Math.ceil(
            (caseriosState.pagination.totalItems - 1) /
              caseriosState.pagination.pageSize
          ),
        },
      });
      setIsDeleteModalOpen(false);
      setSelectedCaserio(undefined);
      setDataVersion((prev) => prev + 1);

      if (currentCaserios.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleModalSubmit = async (data: CaserioDetails) => {
    if (data.id) {
      setCaserios({
        ...caseriosState,
        data: caseriosState.data.map((c) => (c.id === data.id ? data : c)),
      });
    } else {
      const newId =
        caseriosState.data.length > 0
          ? Math.max(...caseriosState.data.map((x) => x.id)) + 1
          : 1;
      const newCaserio = { ...data, id: newId };
      setCaserios({
        ...caseriosState,
        data: [...caseriosState.data, newCaserio],
        pagination: {
          ...caseriosState.pagination,
          totalItems: caseriosState.pagination.totalItems + 1,
          totalPages: Math.ceil(
            (caseriosState.pagination.totalItems + 1) /
              caseriosState.pagination.pageSize
          ),
        },
      });
    }
    setIsModalOpen(false);
    setSelectedCaserio(undefined);
    setDataVersion((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setSelectedCaserio(undefined);
    setIsModalOpen(false);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          Caserios
        </h2>
        <Button
          onClick={() => {
            setSelectedCaserio(undefined);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#145A32] text-white rounded hover:bg-[#0E3D22] transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrar Caserio
        </Button>
      </div>

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="relative mb-4 p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              id="search"
              name="search"
              placeholder="Buscar caserios..."
              className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
              aria-label="Buscar caserios"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPage}-${dataVersion}`}
              variants={tableVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader>
                  <TableRow className="bg-[#145A32] hover:bg-[#0E3D22]">
                    <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      ID
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Nombre del Caserio
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Centro Poblado
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCaserios.map((caserio, index) => (
                    <motion.tr
                      key={caserio.id}
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
                        {caserio.id}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {caserio.nombreCaserio}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {caserio.nombreCentroPoblado}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          onClick={() => handleEdit(caserio.id)}
                          className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(caserio.id)}
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <CaserioModal
          isOpen={isModalOpen}
          caserio={selectedCaserio}
          centrosPoblados={[]} // Asegúrate de pasar los centros poblados
          onClose={handleCloseModal}
          onSubmit={async (data: Caserio) => {
            await handleModalSubmit({
              id: data.id ?? 0,
              nombreCaserio: data.nombreCaserio,
              nombreCentroPoblado: "Centro Poblado", // Add proper value from your data
            });
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedCaserio?.nombreCaserio || ""}
        />
      )}
    </div>
  );
};

export default CaseriosPage;
