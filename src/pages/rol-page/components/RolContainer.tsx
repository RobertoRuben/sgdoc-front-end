import { useState, useMemo } from "react";
import { Rol } from "@/model/rol";
import { RolHeader } from "./RolHeader";
import { RolSearch } from "./RolSearch";
import { RolTable } from "./RolTable";
import { RolModal } from "@/components/modal/rol-modal/RolModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { Pagination } from "@/components/ui/pagination";

const roles: Rol[] = [
    { id: 1, nombreRol: "Administrador" },
    { id: 2, nombreRol: "Editor" },
    { id: 3, nombreRol: "Visualizador" },
    { id: 4, nombreRol: "Moderador" },
    { id: 5, nombreRol: "Invitado" },
];

export const RolContainer: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedRol, setSelectedRol] = useState<Rol | undefined>(undefined);
    const [dataVersion, setDataVersion] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const pageSize = 4;

    const filteredRoles = useMemo(() => {
        return roles.filter((rol) =>
            rol.nombreRol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredRoles.length / pageSize);

    const currentRoles = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredRoles.slice(startIndex, startIndex + pageSize);
    }, [currentPage, filteredRoles]);

    const handleEdit = (id?: number) => {
        if (id !== undefined) {
            const rol = roles.find((r) => r.id === id);
            if (rol) {
                setSelectedRol(rol);
                setIsModalOpen(true);
            }
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const rol = roles.find((r) => r.id === id);
            if (rol) {
                setSelectedRol(rol);
                setIsDeleteModalOpen(true);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedRol) {
            console.log(`Eliminar rol con ID: ${selectedRol.id}`);
            setIsDeleteModalOpen(false);
            setSelectedRol(undefined);
            setDataVersion((prev) => prev + 1);
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleModalSubmit = (data: Rol) => {
        if (data.id) {
            console.log("Actualizar rol:", data);
        } else {
            console.log("Nuevo rol registrado:", data);
        }
        setIsModalOpen(false);
        setSelectedRol(undefined);
        setDataVersion((prev) => prev + 1);
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <RolHeader onAddClick={() => setIsModalOpen(true)} />

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <RolSearch
                    searchTerm={searchTerm}
                    onSearch={(e) => setSearchTerm(e.target.value)}
                />

                <RolTable
                    roles={currentRoles}
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
                <RolModal
                    isOpen={isModalOpen}
                    rol={selectedRol}
                    onClose={() => {
                        setSelectedRol(undefined);
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
                    itemName={selectedRol?.nombreRol || ""}
                />
            )}
        </div>
    );
};