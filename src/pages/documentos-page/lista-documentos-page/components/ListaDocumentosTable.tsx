import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentoDetails } from "@/model/documentoDetails";

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

interface ListaDocumentosTableProps {
  currentDocumentos: DocumentoDetails[];
  onEdit: (id?: number) => void;
  onDelete: (id?: number) => void;
  onDownload: (id?: number) => void;
  showEmpty: boolean;
}

export const ListaDocumentosTable: React.FC<ListaDocumentosTableProps> = ({
  currentDocumentos,
  onEdit,
  onDelete,
  onDownload,
  showEmpty,
}) => {

  if (currentDocumentos.length === 0 && showEmpty) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No se encontraron documentos</p>
      </div>
    );
  }

  if (currentDocumentos.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDocumentos.length}
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
                  N° de Registro
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Documento
                </TableHead>
                <TableHead className="hidden sm:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  DNI Remitente
                </TableHead>
                <TableHead className="hidden md:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Fecha de Ingreso
                </TableHead>
                <TableHead className="hidden lg:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Ámbito
                </TableHead>
                <TableHead className="hidden xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Categoría
                </TableHead>
                <TableHead className="hidden xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Centro Poblado
                </TableHead>
                <TableHead className="hidden 2xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Caserío
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDocumentos.map((documento, index) => (
                <motion.tr
                  key={documento.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                >
                  <TableCell className="px-4 py-4 text-sm font-medium text-gray-900">
                    {String(documento.id).padStart(5, '0')}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-700">
                    {documento.nombreDocumento}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.dniRemitente}
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-4 py-4 text-sm text-gray-700">
                    {new Date(documento.fechaIngreso).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreAmbito}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreCategoria}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreCentroPoblado}
                  </TableCell>
                  <TableCell className="hidden 2xl:table-cell px-4 py-4 text-sm text-gray-700">
                    {documento.nombreCaserio}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => onEdit(documento.id)}
                        className="bg-amber-500 text-white hover:bg-amber-600"
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => onDelete(documento.id)}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => onDownload(documento.id)}
                        className="bg-[#1496cc] text-white hover:bg-[#0d7ba8]"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </div>
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
