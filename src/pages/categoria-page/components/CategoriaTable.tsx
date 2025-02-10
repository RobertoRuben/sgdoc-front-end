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
import { CategoriaDocumento } from "@/model/categoriaDocumento.ts";

interface CategoriaTableProps {
  categorias: CategoriaDocumento[];
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

export const CategoriaTable: React.FC<CategoriaTableProps> = ({
  categorias,
  dataVersion,
  currentPage,
  searchTerm,
  onEdit,
  onDelete,
}) => {
  if (categorias.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No se encontraron cateogorias de documentos</p>
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
                  Nombre de la Categoría
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((categoria, index) => (
                <motion.tr
                  key={categoria.id}
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
                    {categoria.id}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {categoria.nombreCategoria}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => onEdit(categoria.id)}
                      className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => onDelete(categoria.id)}
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