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
import { Trabajador } from "@/model/trabajador";
import { Area } from "@/model/area";
import { TrabajadoresModal } from "@/components/modal/trabajador-modal/TrabajadorRegistration";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { motion, AnimatePresence } from 'framer-motion';

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
    { id: 1, dni: 12345678, nombres: "Juan", apellidoPaterno: "Pérez", apellidoMaterno: "García", genero: "Masculino", areaId: 1 },
    { id: 2, dni: 87654321, nombres: "María", apellidoPaterno: "López", apellidoMaterno: "Martínez", genero: "Femenino", areaId: 2 },
    { id: 3, dni: 23456789, nombres: "Carlos", apellidoPaterno: "Rodríguez", apellidoMaterno: "Sánchez", genero: "Masculino", areaId: 3 },
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

const TrabajadoresPage: React.FC = () => {
    const [trabajadores, setTrabajadores] = useState<Trabajador[]>(initialTrabajadores);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | undefined>(undefined);
    const [dataVersion, setDataVersion] = useState<number>(0);
    const pageSize = 4;

    const totalPages = Math.ceil(trabajadores.length / pageSize);

    const currentTrabajadores = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return trabajadores.slice(startIndex, startIndex + pageSize);
    }, [currentPage, dataVersion, trabajadores]);

    const handleEdit = (id?: number) => {
        if (id !== undefined) {
            const trabajador = trabajadores.find(t => t.id === id);
            if (trabajador) {
                setSelectedTrabajador(trabajador);
                setIsModalOpen(true);
            }
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const trabajador = trabajadores.find(t => t.id === id);
            if (trabajador) {
                setSelectedTrabajador(trabajador);
                setIsDeleteModalOpen(true);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedTrabajador) {
            setTrabajadores(trabajadores.filter(t => t.id !== selectedTrabajador.id));
            setIsDeleteModalOpen(false);
            setSelectedTrabajador(undefined);
            setDataVersion(prev => prev + 1);
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleModalSubmit = (data: Trabajador) => {
        if (data.id) {
            setTrabajadores(
                trabajadores.map(t => (t.id === data.id ? data : t))
            );
        } else {
            const newId = Math.max(...trabajadores.map(t => t.id || 0)) + 1;
            setTrabajadores([...trabajadores, { ...data, id: newId }]);
        }
        setIsModalOpen(false);
        setSelectedTrabajador(undefined);
        setDataVersion(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setSelectedTrabajador(undefined);
        setIsModalOpen(false);
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Trabajadores</h2>
                <Button
                    onClick={() => {
                        setSelectedTrabajador(undefined);
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#03A64A] text-white rounded hover:bg-[#028a3b] transition-colors duration-200 flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Registrar Trabajador
                </Button>
            </div>

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="relative mb-4 p-4 border-b border-gray-200">
                    <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar trabajadores..."
                        className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
                        aria-label="Buscar trabajadores"
                    />
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
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Apellido Paterno</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Apellido Materno</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Género</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Área</TableHead>
                                        <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentTrabajadores.map((trabajador, index) => (
                                        <motion.tr
                                            key={trabajador.id}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                        >
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trabajador.id}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{trabajador.dni}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{trabajador.nombres}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{trabajador.apellidoPaterno}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{trabajador.apellidoMaterno}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{trabajador.genero}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                                                {areas.find(area => area.id === trabajador.areaId)?.nombreArea || "Área No Asignada"}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    onClick={() => handleEdit(trabajador.id)}
                                                    className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(trabajador.id)}
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
                <TrabajadoresModal
                    isOpen={isModalOpen}
                    trabajador={selectedTrabajador}
                    onClose={handleCloseModal}
                    onSubmit={handleModalSubmit}
                    areas={areas}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={`${selectedTrabajador?.nombres || ""} ${selectedTrabajador?.apellidoPaterno || ""} ${selectedTrabajador?.apellidoMaterno || ""}`}
                />
            )}
        </div>
    );

};

export default TrabajadoresPage;
