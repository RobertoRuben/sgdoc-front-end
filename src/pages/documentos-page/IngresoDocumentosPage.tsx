import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Download, Send } from "lucide-react"; // Agregado Send
import { Pagination } from "@/components/ui/pagination";
import RegistroDocumentoModal from "@/components/modal/documento-modal/registro-documento-modal/RegistroDocumentoModal";
import { PaginatedDocumentoResponse } from "@/model/paginatedDocumentoResponse";
import { AnimatePresence, motion } from "framer-motion";

const initialDocumentos: PaginatedDocumentoResponse = {
  data: [
    {
      id: 1,
      dniRemitente: 12345678,
      fechaIngreso: new Date(),
      nombreAmbito: "Ámbito 1",
      nombreCaserio: "Caserío 1",
      nombreCategoria: "Categoría 1",
      nombreDocumento: "Documento 1",
      nombreCentroPoblado: "Centro Poblado 1",
    },
    {
      id: 2,
      dniRemitente: 87654321,
      fechaIngreso: new Date(),
      nombreAmbito: "Ámbito 2",
      nombreCaserio: "Caserío 2",
      nombreCategoria: "Categoría 2",
      nombreDocumento: "Documento 2",
      nombreCentroPoblado: "Centro Poblado 2",
    },
  ],
  pagination: {
    currentPage: 1,
    pageSize: 4,
    totalItems: 2,
    totalPages: 1,
  },
};

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

const IngresoDocumentosPage: React.FC = () => {
  const [documentosState] =
    useState<PaginatedDocumentoResponse>(initialDocumentos);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const totalPages = documentosState.pagination.totalPages;

  const filteredDocumentos = useMemo(() => {
    return documentosState.data.filter((documento) =>
      documento.nombreDocumento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documentosState.data, searchTerm]);

  const currentDocumentos = useMemo(() => {
    const startIndex = (currentPage - 1) * documentosState.pagination.pageSize;
    return filteredDocumentos.slice(
      startIndex,
      startIndex + documentosState.pagination.pageSize
    );
  }, [
    currentPage,
    dataVersion,
    filteredDocumentos,
    documentosState.pagination.pageSize,
  ]);

  // Manejador para enviar documento
  const handleSend = (id?: number) => {
    if (id !== undefined) {
      console.log(`Enviando documento ${id}`);
      // Implementar lógica de envío aquí
    }
  };

  const handleDownload = (id?: number) => {
    if (id !== undefined) {
      console.log(`Descargando documento ${id}`);
      // Implementar lógica de descarga
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          Ingreso de Documentos
        </h2>
        <Button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#145A32] text-white rounded hover:bg-[#0E3D22] transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ingresar Documento
        </Button>
      </div>

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="relative mb-4 p-4 border-b border-gray-200">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            id="search"
            placeholder="Buscar documentos..."
            className="pl-10 w-full border-gray-300 focus:border-[#03A64A] focus:ring focus:ring-[#03A64A] focus:ring-opacity-50 rounded-md shadow-sm"
            aria-label="Buscar documentos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  <TableRow className="bg-[#145A32] hover:bg-[#0E3D22]">
                    <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      ID
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
                        {documento.id}
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
                      <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleDownload(documento.id)}
                            className="bg-[#1496cc] text-white hover:bg-[#0d7ba8]"
                          >
                            <Download className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() => handleSend(documento.id)}
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
        <RegistroDocumentoModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default IngresoDocumentosPage;
