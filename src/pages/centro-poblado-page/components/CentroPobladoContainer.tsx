import { useState, useMemo } from "react";
import { CentroPoblado } from "@/model/centroPoblado";
import { CentroPobladoPaginatedResponse } from "@/model/centroPobladoPaginatedResponse";
import { CentroPobladoHeader } from "./CentroPobladoHeader";
import { CentroPobladoSearch } from "./CentroPobladoSearch";
import { CentroPobladoTable } from "./CentroPobladoTable";
import { CentroPobladoModal } from "@/components/modal/centro-poblado-modal/CentroPobladoModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { Pagination } from "@/components/ui/pagination";

const centrosPobladosData: CentroPoblado[] = [
  { id: 1, nombreCentroPoblado: "Centro Poblado 1" },
  { id: 2, nombreCentroPoblado: "Centro Poblado 2" },
  { id: 3, nombreCentroPoblado: "Centro Poblado 3" },
  { id: 4, nombreCentroPoblado: "Centro Poblado 4" },
  { id: 5, nombreCentroPoblado: "Centro Poblado 5" },
];

export const CentroPobladoContainer: React.FC = () => {
  const [centrosPobladosState, setCentrosPobladosState] = useState<CentroPobladoPaginatedResponse>({
    data: centrosPobladosData,
    pagination: {
      currentPage: 1,
      pageSize: 4,
      totalItems: centrosPobladosData.length,
      totalPages: Math.ceil(centrosPobladosData.length / 4),
    },
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCentroPoblado, setSelectedCentroPoblado] = useState<CentroPoblado | undefined>(undefined);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCentrosPoblados = useMemo(() => {
    return centrosPobladosState.data.filter((centroPoblado) =>
      centroPoblado.nombreCentroPoblado.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [centrosPobladosState.data, searchTerm]);

  const currentCentrosPoblados = useMemo(() => {
    const startIndex = (centrosPobladosState.pagination.currentPage - 1) * centrosPobladosState.pagination.pageSize;
    return filteredCentrosPoblados.slice(startIndex, startIndex + centrosPobladosState.pagination.pageSize);
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
      const updatedData = centrosPobladosState.data.filter((c) => c.id !== selectedCentroPoblado.id);
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
    if (page < 1 || page > centrosPobladosState.pagination.totalPages) return;
    setCentrosPobladosState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        currentPage: page,
      },
    }));
  };

  const handleModalSubmit = async (data: CentroPoblado) => {
    if (data.id) {
      const updatedData = centrosPobladosState.data.map((c) => (c.id === data.id ? data : c));
      setCentrosPobladosState((prevState) => ({
        ...prevState,
        data: updatedData,
      }));
    } else {
      const newId = centrosPobladosState.data.length > 0
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCentrosPobladosState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        currentPage: 1,
      },
    }));
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <CentroPobladoHeader onAddClick={() => setIsModalOpen(true)} />
      
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <CentroPobladoSearch searchTerm={searchTerm} onSearch={handleSearch} />
        
        <CentroPobladoTable
          centrosPoblados={currentCentrosPoblados}
          dataVersion={dataVersion}
          currentPage={centrosPobladosState.pagination.currentPage}
          searchTerm={searchTerm}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

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
          onClose={() => {
            setSelectedCentroPoblado(undefined);
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
          itemName={selectedCentroPoblado?.nombreCentroPoblado || ""}
        />
      )}
    </div>
  );
};