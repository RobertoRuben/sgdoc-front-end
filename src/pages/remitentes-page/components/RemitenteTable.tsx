import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Remitente } from "@/model/remitente";

interface RemitenteTableProps {
  remitentes: Remitente[];
  dataVersion: number;
  currentPage: number;
  searchTerm: string;
  onEdit: (id?: number) => void;
  onDelete: (id?: number) => void;
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

export const RemitenteTable: React.FC<RemitenteTableProps> = ({
  remitentes,
  dataVersion,
  currentPage,
  searchTerm,
  onEdit,
  onDelete,
}) => {
  if (remitentes.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No se encontraron remitentes</p>
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
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow className="bg-[#145A32] border-b border-[#0E3D22] hover:bg-[#0E3D22]">
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Id
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  DNI
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Nombres
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                  Apellido Paterno
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                  Apellido Materno
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                  Género
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remitentes.map((remitente, index) => (
                <motion.tr
                  key={remitente.id}
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
                    {remitente.id}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {remitente.dni}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {remitente.nombres}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                    {remitente.apellidoPaterno}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                    {remitente.apellidoMaterno}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                    {remitente.genero}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => onEdit(remitente.id)}
                      className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => onDelete(remitente.id)}
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
  );
};
