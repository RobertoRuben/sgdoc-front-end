import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import { UsuarioDetails } from "@/model/usuarioDetails";

interface UsuarioTableProps {
    usuarios: UsuarioDetails[];
    dataVersion: number;
    currentPage: number;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onDeactivate: (id?: number) => void;
}

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

export const UsuarioTable: React.FC<UsuarioTableProps> = ({
                                                              usuarios,
                                                              dataVersion,
                                                              currentPage,
                                                              onEdit,
                                                              onDelete,
                                                              onDeactivate,
                                                          }) => {
    return (
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
                            <TableRow className="bg-[#145A32] border-b border-[#0E3D22] hover:bg-[#0E3D22]">
                                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    ID
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Usuario
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                                    Fecha de Creación
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Activo
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                                    Rol
                                </TableHead>
                                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                                    Trabajador
                                </TableHead>
                                <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usuarios.map((usuario, index) => (
                                <motion.tr
                                    key={usuario.id}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                >
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {usuario.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {usuario.nombreUsuario}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                                        {usuario.fechaCreacion.toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            usuario.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                      {usuario.is_active ? "Activo" : "Inactivo"}
                    </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                                        {usuario.rol_nombre}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                                        {usuario.trabajador_nombre}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            onClick={() => onEdit(usuario.id)}
                                            className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(usuario.id)}
                                            className="bg-red-500 text-white hover:bg-red-600 mr-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            onClick={() => onDeactivate(usuario.id)}
                                            className="bg-[#c48f8d] text-white hover:bg-[#a67573]"
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
    );
};