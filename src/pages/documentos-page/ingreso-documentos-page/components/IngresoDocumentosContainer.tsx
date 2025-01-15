import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Pagination } from "@/components/ui/pagination";
import { DocumentoPaginatedResponse } from "@/model/documentoPaginatedResponse.ts";
import RegistroDocumentoModal from "@/components/modal/documento-modal/registro-documento-modal/RegistroDocumentoModal";
import DownloadModal from "@/components/modal/alerts/download-modal/DownloadModal";
import { IngresoDocumentosHeader } from "./IngresoDocumentosHeader";
import { IngresoDocumentosSearch } from "./IngresoDocumentosSearch";
import { IngresoDocumentosTable } from "./IngresoDocumentosTable";

// Estado inicial de ejemplo
const initialDocumentos: DocumentoPaginatedResponse = {
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

export const IngresoDocumentosContainer: React.FC = () => {
  const [documentosState] = useState<DocumentoPaginatedResponse>(
    initialDocumentos
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState<{
    id: number;
    nombreDocumento: string;
    fileSize: string;
    fileType: string;
  } | null>(null);

  const totalPages = documentosState.pagination.totalPages;

  // Filtra los documentos según el término de búsqueda
  const filteredDocumentos = useMemo(() => {
    return documentosState.data.filter((documento) =>
      documento.nombreDocumento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documentosState.data, searchTerm]);

  // Obtiene los documentos de la página actual
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

  // Abre el modal de registro de documento
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Maneja descarga (abre modal con detalles de descarga)
  const handleDownload = (id?: number) => {
    if (id !== undefined) {
      const document = documentosState.data.find((doc) => doc.id === id);
      if (document) {
        setSelectedDocument({
          id: document.id,
          nombreDocumento: document.nombreDocumento,
          fileSize: "2.5 MB", // Ejemplo estático
          fileType: "PDF",    // Ejemplo estático
        });
        setIsDownloadModalOpen(true);
      }
    }
  };

  // Confirma descarga (simulación)
  const handleConfirmDownload = async () => {
    if (selectedDocument) {
      try {
        console.log(`Descargando documento ${selectedDocument.id}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación
      } catch (error) {
        console.error("Error en la descarga:", error);
      }
    }
  };

  // Maneja envío de documento
  const handleSend = (id?: number) => {
    if (id !== undefined) {
      console.log(`Enviando documento ${id}`);
      // Aquí tu lógica real de envío
    }
  };

  // Cambia de página
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Cierra modal de descarga
  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  // Manejador del input de búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      {/* Header */}
      <IngresoDocumentosHeader onAddClick={handleOpenModal} />

      {/* Contenedor principal */}
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Search */}
        <IngresoDocumentosSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        {/* Tabla */}
        <AnimatePresence mode="wait">
          <IngresoDocumentosTable
            currentDocumentos={currentDocumentos}
            currentPage={currentPage}
            dataVersion={dataVersion}
            onDownload={handleDownload}
            onSend={handleSend}
          />
        </AnimatePresence>

        {/* Paginación */}
        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal de registro */}
      {isModalOpen && (
        <RegistroDocumentoModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      {/* Modal de descarga */}
      {selectedDocument && (
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={handleCloseDownloadModal}
          onConfirm={handleConfirmDownload}
          fileName={selectedDocument.nombreDocumento}
          fileSize={selectedDocument.fileSize}
          fileType={selectedDocument.fileType}
        />
      )}
    </div>
  );
};
