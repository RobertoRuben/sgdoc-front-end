import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { AsuntoModal } from "@/components/modal/documento-modal/asunto-documento-modal/AsuntoModal";
import { DocumentoDetails } from "@/model/documentoDetails";

interface IngresoDocumentosTableProps {
  currentDocumentos: DocumentoDetails[];
  currentPage: number;
  dataVersion: number;
  onDownload: (id?: number) => void;
  onSend: (id?: number) => void;
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

export const IngresoDocumentosTable: React.FC<IngresoDocumentosTableProps> = ({
  currentDocumentos,
  currentPage,
  dataVersion,
  onDownload,
  onSend,
}) => {
  const [isAsuntoModalOpen, setIsAsuntoModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] =
    useState<DocumentoDetails>();
  if (currentDocumentos.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">
          No tienes documento registrados el dia de hoy
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={`${currentPage}-${dataVersion}`}
      variants={tableVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-auto"
    >
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow className="bg-[#145A32] hover:bg-[#0E3D22]">
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              N° de Registro
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Documento
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
              DNI Remitente
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">
              Fecha de Ingreso
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">
              Ámbito
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden xl:table-cell">
              Categoría
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden xl:table-cell">
              Centro Poblado
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden 2xl:table-cell">
              Caserío
            </TableHead>
            <TableHead className="hidden 2xl:table-cell px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Asunto
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
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(documento.id).padStart(5, "0")}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {documento.nombreDocumento}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                {documento.dniRemitente}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                {new Date(documento.fechaIngreso).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                {documento.nombreAmbito}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden xl:table-cell">
                {documento.nombreCategoria}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden xl:table-cell">
                {documento.nombreCentroPoblado}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden 2xl:table-cell">
                {documento.nombreCaserio}
              </TableCell>
              <TableCell className="hidden 2xl:table-cell px-4 py-4 text-sm text-gray-700 text-center">
                <Button
                  variant="link"
                  className="text-[#145A32] hover:text-[#0E3D22] p-0 h-auto font-normal"
                  onClick={() => {
                    setSelectedDocumento(documento);
                    setIsAsuntoModalOpen(true);
                  }}
                >
                  Ver
                </Button>
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onDownload(documento.id)}
                    className="bg-[#1496cc] text-white hover:bg-[#0d7ba8]"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => onSend(documento.id)}
                    className="bg-[#7db0aa] text-white hover:bg-[#5e8b86]"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      <AsuntoModal
            isOpen={isAsuntoModalOpen}
            documento={selectedDocumento!}
            onClose={() => setIsAsuntoModalOpen(false)}
          />
    </motion.div>
  );
};
