import { useState, useMemo } from "react";
import { Trabajador } from "@/model/trabajador";
import { Area } from "@/model/area";
import { TrabajadorHeader } from "./TrabajadorHeader";
import { TrabajadorSearch } from "./TrabajadorSearch";
import { TrabajadorTable } from "./TrabajadorTable";
import { TrabajadoresModal } from "@/components/modal/trabajador-modal/TrabajadorModal.tsx";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { Pagination } from "@/components/ui/pagination";

const areas: Area[] = [
    { id: 1, nombreArea: "Recursos Humanos" },
    { id: 2, nombreArea: "Contabilidad" },
    { id: 3, nombreArea: "Ventas" },
    { id: 4, nombreArea: "Tecnología" },
    { id: 5, nombreArea: "Logística" },
    { id: 6, nombreArea: "Marketing" },
    { id: 7, nombreArea: "Administración" },
    { id: 8, nombreArea: "Compras" },
    { id: 9, nombreArea: "Producción" },
    { id: 10, nombreArea: "Calidad" },
];

const initialTrabajadores: Trabajador[] = [
    {
        id: 1,
        dni: 12345678,
        nombres: "Juan",
        apellidoPaterno: "Pérez",
        apellidoMaterno: "García",
        genero: "Masculino",
        areaId: 1,
    },
    {
        id: 2,
        dni: 87654321,
        nombres: "María",
        apellidoPaterno: "López",
        apellidoMaterno: "Martínez",
        genero: "Femenino",
        areaId: 2,
    },
    {
        id: 3,
        dni: 23456789,
        nombres: "Carlos",
        apellidoPaterno: "Rodríguez",
        apellidoMaterno: "Sánchez",
        genero: "Masculino",
        areaId: 3,
    },
];

export const TrabajadorContainer: React.FC = () => {
    const [trabajadores, setTrabajadores] = useState<Trabajador[]>(initialTrabajadores);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | undefined>(undefined);
    const [dataVersion, setDataVersion] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const pageSize = 4;

    const filteredTrabajadores = useMemo(() => {
        return trabajadores.filter((trabajador) =>
            Object.values(trabajador)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [trabajadores, searchTerm]);

    const totalPages = Math.ceil(filteredTrabajadores.length / pageSize);

    const currentTrabajadores = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredTrabajadores.slice(startIndex, startIndex + pageSize);
    }, [currentPage, filteredTrabajadores]);

    const handleEdit = (id?: number) => {
        if (id !== undefined) {
            const trabajador = trabajadores.find((t) => t.id === id);
            if (trabajador) {
                setSelectedTrabajador(trabajador);
                setIsModalOpen(true);
            }
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const trabajador = trabajadores.find((t) => t.id === id);
            if (trabajador) {
                setSelectedTrabajador(trabajador);
                setIsDeleteModalOpen(true);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedTrabajador) {
            setTrabajadores(trabajadores.filter((t) => t.id !== selectedTrabajador.id));
            setIsDeleteModalOpen(false);
            setSelectedTrabajador(undefined);
            setDataVersion((prev) => prev + 1);
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleModalSubmit = (data: Trabajador) => {
        if (data.id) {
            setTrabajadores(trabajadores.map((t) => (t.id === data.id ? data : t)));
        } else {
            const newId = Math.max(...trabajadores.map((t) => t.id || 0)) + 1;
            setTrabajadores([...trabajadores, { ...data, id: newId }]);
        }
        setIsModalOpen(false);
        setSelectedTrabajador(undefined);
        setDataVersion((prev) => prev + 1);
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <TrabajadorHeader onAddClick={() => setIsModalOpen(true)} />

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <TrabajadorSearch
                    searchTerm={searchTerm}
                    onSearch={(e) => setSearchTerm(e.target.value)}
                />

                <TrabajadorTable
                    trabajadores={currentTrabajadores}
                    areas={areas}
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
                <TrabajadoresModal
                    isOpen={isModalOpen}
                    trabajador={selectedTrabajador}
                    onClose={() => {
                        setSelectedTrabajador(undefined);
                        setIsModalOpen(false);
                    }}
                    onSubmit={handleModalSubmit}
                    areas={areas}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={`${selectedTrabajador?.nombres || ""} ${
                        selectedTrabajador?.apellidoPaterno || ""
                    } ${selectedTrabajador?.apellidoMaterno || ""}`}
                />
            )}
        </div>
    );
};