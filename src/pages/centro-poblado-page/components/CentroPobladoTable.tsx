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
import { CentroPoblado } from "@/model/centroPoblado";

interface CentroPobladoTableProps {
  centrosPoblados: CentroPoblado[];
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

export const CentroPobladoTable: React.FC<CentroPobladoTableProps> = ({
  centrosPoblados,
  dataVersion,
  currentPage,
  searchTerm,
  onEdit,
  onDelete,
}) => {
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
                  Nombre del Centro Poblado
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centrosPoblados.map((centroPoblado, index) => (
                <motion.tr
                  key={centroPoblado.id}
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
                    {centroPoblado.id}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {centroPoblado.nombreCentroPoblado}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => onEdit(centroPoblado.id)}
                      className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => onDelete(centroPoblado.id)}
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