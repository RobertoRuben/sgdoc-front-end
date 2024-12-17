import React, { useState, useMemo, useCallback } from "react";
import { Pencil, Trash2, Search, Plus, UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination } from '@/components/ui/pagination';
import { PaginatedUsuarioResponse } from "@/model/paginatedUsuarioResponse";
import { UsuarioDetails } from "@/model/usuarioDetails";
import { RegistroUsuarioModal } from "@/components/modal/usuario-modal/UsuarioModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import DeactivateModal from "@/components/modal/alerts/deactivate-modal/DeactivateModal.tsx";
import { motion, AnimatePresence } from 'framer-motion';
import { Usuario } from "@/model/usuario";

const trabajadores = [
    { value: 1, label: "Juan Pérez" },
    { value: 2, label: "María García" },
    { value: 3, label: "Carlos López" },
    { value: 4, label: "Ana Martínez" },
    { value: 5, label: "Luis Rodríguez" },
];

const initialUsuarios: PaginatedUsuarioResponse = {
    data: [
        { id: 1, nombreUsuario: "admin", fechaCreacion: new Date(), is_active: true, rol_nombre: "Administrador", trabajador_nombre: "Juan Pérez" },
        { id: 2, nombreUsuario: "user1", fechaCreacion: new Date(), is_active: true, rol_nombre: "Usuario", trabajador_nombre: "María García" },
        { id: 3, nombreUsuario: "admin2", fechaCreacion: new Date(), is_active: false, rol_nombre: "Administrador", trabajador_nombre: "Carlos López" },
        { id: 4, nombreUsuario: "user2", fechaCreacion: new Date(), is_active: true, rol_nombre: "Usuario", trabajador_nombre: "Ana Martínez" },
        { id: 5, nombreUsuario: "admin3", fechaCreacion: new Date(), is_active: true, rol_nombre: "Administrador", trabajador_nombre: "Luis Rodríguez" },
        { id: 6, nombreUsuario: "user3", fechaCreacion: new Date(), is_active: false, rol_nombre: "Usuario", trabajador_nombre: "Juan Pérez" },
        { id: 7, nombreUsuario: "admin4", fechaCreacion: new Date(), is_active: true, rol_nombre: "Administrador", trabajador_nombre: "María García" },
        { id: 8, nombreUsuario: "user4", fechaCreacion: new Date(), is_active: true, rol_nombre: "Usuario", trabajador_nombre: "Carlos López" },
    ],
    pagination: {
        currentPage: 1,
        pageSize: 2,
        totalItems: 8,
        totalPages: 4,
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

const UsuariosPage: React.FC = () => {
    const [usuariosState, setUsuarios] = useState<PaginatedUsuarioResponse>(initialUsuarios);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState<boolean>(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>(undefined);
    const [dataVersion, setDataVersion] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const totalPages = usuariosState.pagination.totalPages;

    const usuarioDetailsToUsuario = useCallback((ud: UsuarioDetails): Usuario => {
        const rolId = ud.rol_nombre === "Administrador" ? 1 :
            ud.rol_nombre === "Usuario" ? 2 : 3;
        const trabajador = trabajadores.find(t => t.label === ud.trabajador_nombre);
        const trabajadorId = trabajador ? trabajador.value : 1;
        return {
            id: ud.id,
            nombreUsuario: ud.nombreUsuario,
            contrasena: "",
            rolId,
            trabajadorId
        };
    }, []);

    const usuarioToUsuarioDetails = useCallback((u: Usuario): UsuarioDetails => {
        const rol_nombre = u.rolId === 1 ? "Administrador" :
            u.rolId === 2 ? "Usuario" : "Invitado";
        const trabajador = trabajadores.find(t => t.value === u.trabajadorId);
        const trabajador_nombre = trabajador ? trabajador.label : "Desconocido";

        const newId = u.id ? u.id : (usuariosState.data.length > 0 ? Math.max(...usuariosState.data.map(x => x.id)) + 1 : 1);

        return {
            id: newId,
            nombreUsuario: u.nombreUsuario,
            fechaCreacion: new Date(),
            is_active: true,
            rol_nombre,
            trabajador_nombre
        };
    }, [usuariosState.data]);

    const filteredUsuarios = useMemo(() => {
        return usuariosState.data.filter(usuario => {
            const matchesSearch = usuario.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.rol_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.trabajador_nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && usuario.is_active) ||
                (statusFilter === "inactive" && !usuario.is_active);
            return matchesSearch && matchesStatus;
        });
    }, [usuariosState.data, searchTerm, statusFilter]);

    const currentUsuarios = useMemo(() => {
        const startIndex = (currentPage - 1) * usuariosState.pagination.pageSize;
        return filteredUsuarios.slice(startIndex, startIndex + usuariosState.pagination.pageSize);
    }, [currentPage, dataVersion, filteredUsuarios, usuariosState.pagination.pageSize]);

    const handleEdit = (id?: number) => {
        if (id !== undefined) {
            const usuarioDetails = usuariosState.data.find(u => u.id === id);
            if (usuarioDetails) {
                const u = usuarioDetailsToUsuario(usuarioDetails);
                setSelectedUsuario(u);
                setIsModalOpen(true);
            }
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const usuario = usuariosState.data.find(u => u.id === id);
            if (usuario) {
                setSelectedUsuario(usuarioDetailsToUsuario(usuario));
                setIsDeleteModalOpen(true);
            }
        }
    };

    const handleDeactivateClick = (id?: number) => {
        if (id !== undefined) {
            const usuario = usuariosState.data.find(u => u.id === id);
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
                data: usuariosState.data.filter(u => u.id !== selectedUsuario.id),
                pagination: {
                    ...usuariosState.pagination,
                    totalItems: usuariosState.pagination.totalItems - 1,
                    totalPages: Math.ceil((usuariosState.pagination.totalItems - 1) / usuariosState.pagination.pageSize),
                },
            });
            setIsDeleteModalOpen(false);
            setSelectedUsuario(undefined);
            setDataVersion(prev => prev + 1);

            if (currentUsuarios.length <= 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleModalSubmit = (data: Usuario) => {
        const ud = usuarioToUsuarioDetails(data);

        if (data.id) {
            setUsuarios({
                ...usuariosState,
                data: usuariosState.data.map(u => (u.id === data.id ? ud : u)),
            });
        } else {
            setUsuarios({
                ...usuariosState,
                data: [...usuariosState.data, ud],
                pagination: {
                    ...usuariosState.pagination,
                    totalItems: usuariosState.pagination.totalItems + 1,
                    totalPages: Math.ceil((usuariosState.pagination.totalItems + 1) / usuariosState.pagination.pageSize),
                },
            });
        }
        setIsModalOpen(false);
        setSelectedUsuario(undefined);
        setDataVersion(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setSelectedUsuario(undefined);
        setIsModalOpen(false);
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Usuarios</h2>
                <Button
                    onClick={() => {
                        setSelectedUsuario(undefined);
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#03A64A] text-white rounded hover:bg-[#028a3b] transition-colors duration-200 flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Registrar Usuario
                </Button>
            </div>

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="relative mb-4 p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar usuarios..."
                            className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
                            aria-label="Buscar usuarios"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                    </Select>
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
                                    <TableRow className="bg-gray-50 border-b border-gray-200">
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre de Usuario</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Fecha de Creación</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Activo</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Rol</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Trabajador</TableHead>
                                        <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentUsuarios.map((usuario, index) => (
                                        <motion.tr
                                            key={usuario.id}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                        >
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.id}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{usuario.nombreUsuario}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{usuario.fechaCreacion.toLocaleDateString()}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {usuario.is_active ? "Activo" : "Inactivo"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{usuario.rol_nombre}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{usuario.trabajador_nombre}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    onClick={() => handleEdit(usuario.id)}
                                                    className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(usuario.id)}
                                                    className="bg-red-500 text-white hover:bg-red-600 mr-2"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeactivateClick(usuario.id)}
                                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    <UserX className="w-5 h-5" />
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
                <RegistroUsuarioModal
                    isOpen={isModalOpen}
                    usuario={selectedUsuario}
                    onClose={handleCloseModal}
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

export default UsuariosPage;