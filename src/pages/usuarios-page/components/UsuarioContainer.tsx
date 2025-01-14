import { useState, useMemo, useCallback } from "react";
import { PaginatedUsuarioResponse } from "@/model/paginatedUsuarioResponse";
import { UsuarioDetails } from "@/model/usuarioDetails";
import { Usuario } from "@/model/usuario";
import { UsuarioHeader } from "./UsuarioHeader";
import { UsuarioSearch } from "./UsuarioSearch";
import { UsuarioTable } from "./UsuarioTable";
import { RegistroUsuarioModal } from "@/components/modal/usuario-modal/UsuarioModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import DeactivateModal from "@/components/modal/alerts/deactivate-modal/DeactivateModal";
import { Pagination } from "@/components/ui/pagination";

const trabajadores = [
    { value: 1, label: "Juan Pérez" },
    { value: 2, label: "María García" },
    { value: 3, label: "Carlos López" },
    { value: 4, label: "Ana Martínez" },
    { value: 5, label: "Luis Rodríguez" },
];

const initialUsuarios: PaginatedUsuarioResponse = {
    data: [
        {
            id: 1,
            nombreUsuario: "admin",
            fechaCreacion: new Date(),
            is_active: true,
            rol_nombre: "Administrador",
            trabajador_nombre: "Juan Pérez",
        },
    ],
    pagination: {
        currentPage: 1,
        pageSize: 2,
        totalItems: 8,
        totalPages: 4,
    },
};

export const UsuarioContainer: React.FC = () => {
    const [usuariosState, setUsuarios] = useState<PaginatedUsuarioResponse>(initialUsuarios);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState<boolean>(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>(undefined);
    const [dataVersion, setDataVersion] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const usuarioDetailsToUsuario = useCallback((ud: UsuarioDetails): Usuario => {
        const rolId = ud.rol_nombre === "Administrador" ? 1 : ud.rol_nombre === "Usuario" ? 2 : 3;
        const trabajador = trabajadores.find((t) => t.label === ud.trabajador_nombre);
        const trabajadorId = trabajador ? trabajador.value : 1;
        return {
            id: ud.id,
            nombreUsuario: ud.nombreUsuario,
            contrasena: "",
            rolId,
            trabajadorId,
        };
    }, []);

    const usuarioToUsuarioDetails = useCallback((u: Usuario): UsuarioDetails => {
        const rol_nombre = u.rolId === 1 ? "Administrador" : u.rolId === 2 ? "Usuario" : "Invitado";
        const trabajador = trabajadores.find((t) => t.value === u.trabajadorId);
        const trabajador_nombre = trabajador ? trabajador.label : "Desconocido";

        const newId = u.id
            ? u.id
            : usuariosState.data.length > 0
                ? Math.max(...usuariosState.data.map((x) => x.id)) + 1
                : 1;

        return {
            id: newId,
            nombreUsuario: u.nombreUsuario,
            fechaCreacion: new Date(),
            is_active: true,
            rol_nombre,
            trabajador_nombre,
        };
    }, [usuariosState.data]);

    const filteredUsuarios = useMemo(() => {
        return usuariosState.data.filter((usuario) => {
            const matchesSearch =
                usuario.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.rol_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.trabajador_nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && usuario.is_active) ||
                (statusFilter === "inactive" && !usuario.is_active);
            return matchesSearch && matchesStatus;
        });
    }, [usuariosState.data, searchTerm, statusFilter]);

    const currentUsuarios = useMemo(() => {
        const startIndex = (currentPage - 1) * usuariosState.pagination.pageSize;
        return filteredUsuarios.slice(startIndex, startIndex + usuariosState.pagination.pageSize);
    }, [currentPage, filteredUsuarios, usuariosState.pagination.pageSize]);

    const handleEdit = (id?: number) => {
        if (id !== undefined) {
            const usuarioDetails = usuariosState.data.find((u) => u.id === id);
            if (usuarioDetails) {
                const u = usuarioDetailsToUsuario(usuarioDetails);
                setSelectedUsuario(u);
                setIsModalOpen(true);
            }
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const usuario = usuariosState.data.find((u) => u.id === id);
            if (usuario) {
                setSelectedUsuario(usuarioDetailsToUsuario(usuario));
                setIsDeleteModalOpen(true);
            }
        }
    };

    const handleDeactivateClick = (id?: number) => {
        if (id !== undefined) {
            const usuario = usuariosState.data.find((u) => u.id === id);
            if (usuario) {
                setSelectedUsuario(usuarioDetailsToUsuario(usuario));
                setIsDeactivateModalOpen(true);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedUsuario?.id) {
            setUsuarios({
                ...usuariosState,
                data: usuariosState.data.filter((u) => u.id !== selectedUsuario.id),
                pagination: {
                    ...usuariosState.pagination,
                    totalItems: usuariosState.pagination.totalItems - 1,
                    totalPages: Math.ceil(
                        (usuariosState.pagination.totalItems - 1) / usuariosState.pagination.pageSize
                    ),
                },
            });
            setIsDeleteModalOpen(false);
            setSelectedUsuario(undefined);
            setDataVersion((prev) => prev + 1);

            if (currentUsuarios.length <= 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const handleModalSubmit = (data: Usuario) => {
        const ud = usuarioToUsuarioDetails(data);

        if (data.id) {
            setUsuarios({
                ...usuariosState,
                data: usuariosState.data.map((u) => (u.id === data.id ? ud : u)),
            });
        } else {
            setUsuarios({
                ...usuariosState,
                data: [...usuariosState.data, ud],
                pagination: {
                    ...usuariosState.pagination,
                    totalItems: usuariosState.pagination.totalItems + 1,
                    totalPages: Math.ceil(
                        (usuariosState.pagination.totalItems + 1) / usuariosState.pagination.pageSize
                    ),
                },
            });
        }
        setIsModalOpen(false);
        setSelectedUsuario(undefined);
        setDataVersion((prev) => prev + 1);
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <UsuarioHeader onAddClick={() => setIsModalOpen(true)} />

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <UsuarioSearch
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    onSearch={(e) => setSearchTerm(e.target.value)}
                    onStatusFilterChange={setStatusFilter}
                />

                <UsuarioTable
                    usuarios={currentUsuarios}
                    dataVersion={dataVersion}
                    currentPage={currentPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onDeactivate={handleDeactivateClick}
                />

                <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={usuariosState.pagination.totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>

            {isModalOpen && (
                <RegistroUsuarioModal
                    isOpen={isModalOpen}
                    usuario={selectedUsuario}
                    onClose={() => {
                        setSelectedUsuario(undefined);
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
                    itemName={selectedUsuario?.nombreUsuario || ""}
                />
            )}

            {isDeactivateModalOpen && (
                <DeactivateModal
                    isOpen={isDeactivateModalOpen}
                    onClose={() => setIsDeactivateModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    userName={selectedUsuario?.nombreUsuario || ""}
                />
            )}
        </div>
    );
};