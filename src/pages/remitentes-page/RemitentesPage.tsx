import React, { useState, useMemo } from "react";
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
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
import { Pagination } from '@/components/ui/pagination';
import { Remitente } from "@/model/remitente";
import { RemitentesModal } from "@/components/modal/remitente-modal/RemitenteRegistration";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { motion, AnimatePresence } from 'framer-motion';

const remitentes: Remitente[] = [
    { id: 1, dni: 12345678, nombres: "Juan", apellidoPaterno: "Pérez", apellidoMaterno: "García", genero: "Masculino" },
    { id: 2, dni: 87654321, nombres: "María", apellidoPaterno: "López", apellidoMaterno: "Martínez", genero: "Femenino" },
    { id: 3, dni: 23456789, nombres: "Carlos", apellidoPaterno: "Rodríguez", apellidoMaterno: "Sánchez", genero: "Masculino" },
    { id: 4, dni: 98765432, nombres: "Ana", apellidoPaterno: "Fernández", apellidoMaterno: "Gómez", genero: "Femenino" },
    { id: 5, dni: 34567890, nombres: "Pedro", apellidoPaterno: "Díaz", apellidoMaterno: "Ruiz", genero: "Masculino" },
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

const RemitentesPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedRemitente, setSelectedRemitente] = useState<Remitente | undefined>(undefined);
    const pageSize = 4;

    const totalPages = Math.ceil(remitentes.length / pageSize);

    const currentRemitentes = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return remitentes.slice(startIndex, startIndex + pageSize);
    }, [currentPage]);

    const handleEdit = (id?: number) => {
        if (id !== undefined) {
            const remitente = remitentes.find(r => r.id === id);
            if (remitente) {
                setSelectedRemitente(remitente);
                setIsModalOpen(true);
            }
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const remitente = remitentes.find(r => r.id === id);
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
    };

    const handleCloseModal = () => {
        setSelectedRemitente(undefined); // Limpia el estado antes de cerrar el modal
        setIsModalOpen(false);
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Remitentes</h2>
                <Button
                    onClick={() => {
                        setSelectedRemitente(undefined);
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#03A64A] text-white rounded hover:bg-[#028a3b] transition-colors duration-200 flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Remitente
                </Button>
            </div>

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="relative mb-4 p-4 border-b border-gray-200">
                    <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar remitentes..."
                        className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
                        aria-label="Buscar remitentes"
                    />
                </div>
                <div className="overflow-x-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            variants={tableVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 border-b border-gray-200">
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Id</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombres</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Apellido Paterno</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Apellido Materno</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Género</TableHead>
                                        <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentRemitentes.map((remitente, index) => (
                                        <motion.tr
                                            key={remitente.id}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                        >
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{remitente.id}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{remitente.dni}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{remitente.nombres}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{remitente.apellidoPaterno}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{remitente.apellidoMaterno}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{remitente.genero}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    onClick={() => handleEdit(remitente.id)}
                                                    className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(remitente.id)}
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
                <RemitentesModal
                    isOpen={isModalOpen}
                    remitente={selectedRemitente}
                    onClose={handleCloseModal}
                    onSubmit={handleModalSubmit}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={`${selectedRemitente?.nombres || ""} ${selectedRemitente?.apellidoPaterno || ""} ${selectedRemitente?.apellidoMaterno || ""}`}
                />
            )}
        </div>
    );
};

export default RemitentesPage;
