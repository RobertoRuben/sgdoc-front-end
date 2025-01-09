import { useState, useMemo } from "react";
import { CaserioPaginatedResponse } from "@/model/caserioPaginatedResponse";
import { CaserioDetails } from "@/model/caserioDetails";
import { Caserio } from "@/model/caserio";
import { CaserioHeader } from "./CaserioHeader";
import { CaserioSearch } from "./CaserioSearch";
import { CaserioTable } from "./CaserioTable";
import { CaserioModal } from "@/components/modal/caserio-modal/CaserioModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { Pagination } from "@/components/ui/pagination";

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

export const CaserioContainer: React.FC = () => {
  const [caseriosState, setCaserios] = useState<CaserioPaginatedResponse>(initialCaserios);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCaserio, setSelectedCaserio] = useState<CaserioDetails | undefined>(undefined);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCaserios = useMemo(() => {
    return caseriosState.data.filter((caserio) => {
      return (
        caserio.nombreCaserio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caserio.nombreCentroPoblado.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [caseriosState.data, searchTerm]);

  const currentCaserios = useMemo(() => {
    const startIndex = (currentPage - 1) * caseriosState.pagination.pageSize;
    return filteredCaserios.slice(startIndex, startIndex + caseriosState.pagination.pageSize);
  }, [currentPage, dataVersion, filteredCaserios, caseriosState.pagination.pageSize]);

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
            (caseriosState.pagination.totalItems - 1) / caseriosState.pagination.pageSize
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
    if (page < 1 || page > caseriosState.pagination.totalPages) return;
    setCurrentPage(page);
  };

  const handleModalSubmit = async (data: Caserio) => {
    const caserioDetails: CaserioDetails = {
      id: data.id ?? 0,
      nombreCaserio: data.nombreCaserio,
      nombreCentroPoblado: "Centro Poblado", // Add proper value from your data
    };

    if (data.id) {
      setCaserios({
        ...caseriosState,
        data: caseriosState.data.map((c) => (c.id === data.id ? caserioDetails : c)),
      });
    } else {
      const newId = caseriosState.data.length > 0
        ? Math.max(...caseriosState.data.map((x) => x.id)) + 1
        : 1;
      const newCaserio = { ...caserioDetails, id: newId };
      setCaserios({
        ...caseriosState,
        data: [...caseriosState.data, newCaserio],
        pagination: {
          ...caseriosState.pagination,
          totalItems: caseriosState.pagination.totalItems + 1,
          totalPages: Math.ceil(
            (caseriosState.pagination.totalItems + 1) / caseriosState.pagination.pageSize
          ),
        },
      });
    }
    setIsModalOpen(false);
    setSelectedCaserio(undefined);
    setDataVersion((prev) => prev + 1);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <CaserioHeader onAddClick={() => setIsModalOpen(true)} />
      
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <CaserioSearch 
          searchTerm={searchTerm} 
          onSearch={(e) => setSearchTerm(e.target.value)} 
        />
        
        <CaserioTable
          caserios={currentCaserios}
          dataVersion={dataVersion}
          currentPage={currentPage}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={caseriosState.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <CaserioModal
          isOpen={isModalOpen}
          caserio={selectedCaserio}
          centrosPoblados={[]} // Asegúrate de pasar los centros poblados
          onClose={() => {
            setSelectedCaserio(undefined);
            setIsModalOpen(false);
          }}
          onSubmit={handleModalSubmit}
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