import {motion, AnimatePresence} from "framer-motion";
import {Pencil, UserCheck, UserX} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import {Usuario} from "@/model/usuario";

interface UsuarioTableProps {
    usuarios: Usuario[];
    dataVersion: number;
    currentPage: number;
    searchTerm: string;
    onEdit: (id?: number) => void;
    onDeactivate: (id?: number) => void;
    onActivate: (id?: number) => void;
    statusFilter: string;
}

const tableVariants = {
    initial: {opacity: 0, scale: 0.95},
    animate: {opacity: 1, scale: 1},
    exit: {opacity: 0, scale: 0.95},
};

const rowVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1},
    exit: {opacity: 0},
};

export const UsuarioTable: React.FC<UsuarioTableProps> = ({
                                                              usuarios,
                                                              dataVersion,
                                                              currentPage,
                                                              searchTerm,
                                                              onEdit,
                                                              onDeactivate,
                                                              onActivate,
                                                              statusFilter,
                                                          }) => {
    // Added empty state check
    if (usuarios.length === 0) {
        return (
            <div className="w-full p-8 text-center">
                <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${currentPage}-${dataVersion}-${searchTerm}`}
                    variants={tableVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{duration: 0.5}}
                    className="w-full"
                >
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader>
                            <TableRow className="bg-[#145A32] border-b border-[#0E3D22] hover:bg-[#0E3D22]">
                                <TableHead
                                    className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    ID
                                </TableHead>
                                <TableHead
                                    className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Usuario
                                </TableHead>
                                <TableHead
                                    className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Fecha de Creación
                                </TableHead>
                                <TableHead
                                    className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Activo
                                </TableHead>
                                <TableHead
                                    className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Rol
                                </TableHead>
                                <TableHead
                                    className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Trabajador Vinculado
                                </TableHead>
                                <TableHead
                                    className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
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
                                    transition={{duration: 0.3, delay: index * 0.05}}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                >
                                    <TableCell
                                        className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {usuario.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {usuario.nombreUsuario}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {usuario.fechaCreacion
                                            ? new Date(usuario.fechaCreacion).toLocaleString("en-US", {
                                                timeZone: "America/Lima",
                                            })
                                            : ''}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {usuario.isActive ? "Activo" : "Inactivo"}
                    </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {usuario.rolNombre}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {usuario.trabajadorNombre}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button
                                            onClick={() => onEdit(usuario.id)}
                                            className="bg-amber-500 text-white hover:bg-amber-600"
                                        >
                                            <Pencil className="w-5 h-5"/>
                                        </Button>
                                        {statusFilter === "true" && (
                                            <Button
                                                onClick={() => onDeactivate(usuario.id)}
                                                className="bg-[#c48f8d] text-white hover:bg-[#a67573]"
                                            >
                                                <UserX className="w-5 h-5"/>
                                            </Button>
                                        )}
                                        
                                        {statusFilter === "false" && (
                                            <Button
                                                onClick={() => onActivate(usuario.id)}
                                                className="bg-green-600 text-white hover:bg-green-700"
                                            >
                                                <UserCheck className="w-5 h-5"/>
                                            </Button>
                                        )}
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
