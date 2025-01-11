import { useState, useMemo } from "react";
import { Area } from "@/model/area";
import { AreaHeader } from "./AreaHeader";
import { AreaSearch } from "./AreaSearch";
import { AreaTable } from "./AreaTable";
import { AreaModal } from "@/components/modal/area-modal/AreaModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { Pagination } from "@/components/ui/pagination";

const areas: Area[] = [
  { id: 1, nombreArea: "Recursos Humanos" },
  { id: 2, nombreArea: "Finanzas" },
  { id: 3, nombreArea: "Desarrollo de Software" },
  { id: 4, nombreArea: "Marketing" },
  { id: 5, nombreArea: "Atención al Cliente" },
];

export const AreaContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<Area | undefined>(undefined);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pageSize = 4;

  const filteredAreas = useMemo(() => {
    return areas.filter((area) =>
      area.nombreArea.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredAreas.length / pageSize);

  const currentAreas = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAreas.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredAreas]);

  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const area = areas.find((a) => a.id === id);
      if (area) {
        setSelectedArea(area);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const area = areas.find((a) => a.id === id);
      if (area) {
        setSelectedArea(area);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedArea) {
      console.log(`Eliminar área con ID: ${selectedArea.id}`);
      setIsDeleteModalOpen(false);
      setSelectedArea(undefined);
      setDataVersion((prev) => prev + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleModalSubmit = (data: Area) => {
    if (data.id) {
      console.log("Actualizar área:", data);
    } else {
      console.log("Nueva área registrada:", data);
    }
    setIsModalOpen(false);
    setSelectedArea(undefined);
    setDataVersion((prev) => prev + 1);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <AreaHeader onAddClick={() => setIsModalOpen(true)} />
      
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <AreaSearch 
          searchTerm={searchTerm} 
          onSearch={(e) => setSearchTerm(e.target.value)} 
        />
        
        <AreaTable
          areas={currentAreas}
          dataVersion={dataVersion}
          currentPage={currentPage}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <AreaModal
          isOpen={isModalOpen}
          area={selectedArea}
          onClose={() => {
            setSelectedArea(undefined);
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
          itemName={selectedArea?.nombreArea || ""}
        />
      )}
    </div>
  );
};