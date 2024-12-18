import { useState, useMemo } from "react";
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
          className="w-full sm:w-auto px-4 py-2 bg-[#03A64A] text-white rounded hover:bg-[#028a3b] transition-colors duration-200 flex items-center justify-center"
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DNI Remitente
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha de Ingreso
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ámbito
                    </th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Centro Poblado
                    </th>
                    <th className="hidden 2xl:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Caserío
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
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
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {documento.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {documento.nombreDocumento}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.dniRemitente}
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-800">
                        {new Date(documento.fechaIngreso).toLocaleDateString()}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreAmbito}
                      </td>
                      <td className="hidden xl:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreCategoria}
                      </td>
                      <td className="hidden xl:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreCentroPoblado}
                      </td>
                      <td className="hidden 2xl:table-cell px-4 py-3 text-sm text-gray-800">
                        {documento.nombreCaserio}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {/* Botón de Descargar */}
                          <Button
                            onClick={() => handleDownload(documento.id)}
                            className="bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Download className="w-5 h-5" />
                          </Button>
                          {/* Botón de Enviar */}
                          <Button
                            onClick={() => handleSend(documento.id)}
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            <Send className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
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
