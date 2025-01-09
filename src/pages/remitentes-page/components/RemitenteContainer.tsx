import { useState, useMemo } from "react";
import { Remitente } from "@/model/remitente";
import { RemitenteHeader } from "./RemitenteHeader";
import { RemitenteSearch } from "./RemitenteSearch";
import { RemitenteTable } from "./RemitenteTable";
import { RemitenteModal } from "@/components/modal/remitente-modal/Remitente";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { Pagination } from "@/components/ui/pagination";

const remitentes: Remitente[] = [
  {
    id: 1,
    dni: 12345678,
    nombres: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "García",
    genero: "Masculino",
  },
  {
    id: 2,
    dni: 87654321,
    nombres: "María",
    apellidoPaterno: "López",
    apellidoMaterno: "Martínez",
    genero: "Femenino",
  },
  {
    id: 3,
    dni: 23456789,
    nombres: "Carlos",
    apellidoPaterno: "Rodríguez",
    apellidoMaterno: "Sánchez",
    genero: "Masculino",
  },
  {
    id: 4,
    dni: 98765432,
    nombres: "Ana",
    apellidoPaterno: "Fernández",
    apellidoMaterno: "Gómez",
    genero: "Femenino",
  },
  {
    id: 5,
    dni: 34567890,
    nombres: "Pedro",
    apellidoPaterno: "Díaz",
    apellidoMaterno: "Ruiz",
    genero: "Masculino",
  },
];

export const RemitenteContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedRemitente, setSelectedRemitente] = useState<Remitente | undefined>(
    undefined
  );
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pageSize = 4;

  const filteredRemitentes = useMemo(() => {
    return remitentes.filter((remitente) =>
      Object.values(remitente)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredRemitentes.length / pageSize);

  const currentRemitentes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRemitentes.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredRemitentes]);

  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const remitente = remitentes.find((r) => r.id === id);
      if (remitente) {
        setSelectedRemitente(remitente);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const remitente = remitentes.find((r) => r.id === id);
      if (remitente) {
        setSelectedRemitente(remitente);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedRemitente) {
      console.log(`Eliminar remitente con ID: ${selectedRemitente.id}`);
      setIsDeleteModalOpen(false);
      setSelectedRemitente(undefined);
      setDataVersion((prev) => prev + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleModalSubmit = (data: Remitente) => {
    if (data.id) {
      console.log("Actualizar remitente:", data);
    } else {
      console.log("Nuevo remitente registrado:", data);
    }
    setIsModalOpen(false);
    setSelectedRemitente(undefined);
    setDataVersion((prev) => prev + 1);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <RemitenteHeader onAddClick={() => setIsModalOpen(true)} />
      
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <RemitenteSearch 
          searchTerm={searchTerm} 
          onSearch={(e) => setSearchTerm(e.target.value)} 
        />
        
        <RemitenteTable
          remitentes={currentRemitentes}
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
        <RemitenteModal
          isOpen={isModalOpen}
          remitente={selectedRemitente}
          onClose={() => {
            setSelectedRemitente(undefined);
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
          itemName={`${selectedRemitente?.nombres || ""} ${
            selectedRemitente?.apellidoPaterno || ""
          } ${selectedRemitente?.apellidoMaterno || ""}`}
        />
      )}
    </div>
  );
};