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
import { Area } from "@/model/area";
import { AreaModal } from "@/components/modal/area-modal/AreaModal.tsx";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { motion, AnimatePresence } from 'framer-motion';

const areas: Area[] = [
    { id: 1, nombreArea: "Recursos Humanos" },
    { id: 2, nombreArea: "Finanzas" },
    { id: 3, nombreArea: "Desarrollo de Software" },
    { id: 4, nombreArea: "Marketing" },
    { id: 5, nombreArea: "Atención al Cliente" },
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

const AreasPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedArea, setSelectedArea] = useState<Area | undefined>(undefined);
    const [dataVersion, setDataVersion] = useState<number>(0); // Nuevo estado para la versión de datos
    const pageSize = 4;

    const totalPages = Math.ceil(areas.length / pageSize);

    const currentAreas = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return areas.slice(startIndex, startIndex + pageSize);
    }, [currentPage, dataVersion]); // Agregamos dataVersion como dependencia

    const handleEdit = (id?: number) => {
        if (id !== undefined) {
            const area = areas.find(a => a.id === id);
            if (area) {
                setSelectedArea(area);
                setIsModalOpen(true);
            }
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const area = areas.find(a => a.id === id);
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
            // Aquí podrías actualizar la lista de áreas eliminando la seleccionada
            // Después de actualizar los datos, incrementa dataVersion para activar la animación
            setDataVersion(prev => prev + 1);
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleModalSubmit = (data: Area) => {
        if (data.id) {
            console.log("Actualizar área:", data);
            // Aquí podrías actualizar la lista de áreas con los nuevos datos
        } else {
            console.log("Nueva área registrada:", data);
            // Aquí podrías agregar la nueva área a la lista
        }
        setIsModalOpen(false);
        setSelectedArea(undefined);
        // Después de actualizar los datos, incrementa dataVersion para activar la animación
        setDataVersion(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setSelectedArea(undefined);
        setIsModalOpen(false);
    };

    const refreshData = () => {
        console.log(refreshData())
        setDataVersion(prev => prev + 1);
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Áreas</h2>
                <Button
                    onClick={() => {
                        setSelectedArea(undefined);
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#03A64A] text-white rounded hover:bg-[#028a3b] transition-colors duration-200 flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Área
                </Button>
            </div>

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="relative mb-4 p-4 border-b border-gray-200">
                    <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar áreas..."
                        className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
                        aria-label="Buscar áreas"
                        // Podrías agregar lógica de búsqueda aquí
                    />
                </div>
                <div className="overflow-x-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${currentPage}-${dataVersion}`} // Clave combinada para detectar cambios de página y datos
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
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Id</TableHead>
                                        <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre del Área</TableHead>
                                        <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentAreas.map((area, index) => (
                                        <motion.tr
                                            key={area.id}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                        >
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{area.id}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{area.nombreArea}</TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    onClick={() => handleEdit(area.id)}
                                                    className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(area.id)}
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
                <AreaModal
                    isOpen={isModalOpen}
                    area={selectedArea}
                    onClose={handleCloseModal}
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

export default AreasPage;
