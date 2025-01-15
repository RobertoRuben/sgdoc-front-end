import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pagination } from "@/components/ui/pagination";
import { DocumentoDetails } from "@/model/documentoDetails";
import { PaginatedDocumentoResponse } from "@/model/paginatedDocumentoResponse";
import { Documento } from "@/model/documento";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import { ActualizacionDocumentoModal } from "@/components/modal/documento-modal/actualizacion-documento-modal/ActualizacionDocumentoModal";
import DownloadModal from "@/components/modal/alerts/download-modal/DownloadModal";

import { ListaDocumentosHeader } from "./ListaDocumentosHeader";
import { ListaDocumentosSearch } from "./ListaDocumentosSearch";
import { ListaDocumentosTable } from "./ListaDocumentosTable";

// ==========================================
// Estado inicial de ejemplo
// ==========================================
const initialDocumentos: PaginatedDocumentoResponse = {
  data: [
    {
      id: 1,
      dniRemitente: 12345678,
      fechaIngreso: new Date("2023-08-01"),
      nombreAmbito: "Ámbito 1",
      nombreCaserio: "Caserío 1",
      nombreCategoria: "Categoría 1",
      nombreDocumento: "Documento 1",
      nombreCentroPoblado: "Centro Poblado 1",
    },
    {
      id: 2,
      dniRemitente: 87654321,
      fechaIngreso: new Date("2023-08-02"),
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

// Variantes de animación para la tabla
const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const ListaDocumentosContainer: React.FC = () => {
  // ================================
  // ESTADOS PRINCIPALES
  // ================================
  const [documentosState, setDocumentos] =
    useState<PaginatedDocumentoResponse>(initialDocumentos);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDocumento, setSelectedDocumento] = useState<
    DocumentoDetails | undefined
  >(undefined);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ================================
  // FILTROS
  // ================================
  const [selectedCaserio, setSelectedCaserio] = useState<string | undefined>();
  const [selectedCentroPoblado, setSelectedCentroPoblado] =
    useState<string | undefined>();
  const [selectedAmbito, setSelectedAmbito] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // ================================
  // MODAL DE DESCARGA
  // ================================
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: number;
    nombreDocumento: string;
    fileSize: string;
    fileType: string;
  } | null>(null);

  // ================================
  // PAGINACIÓN
  // ================================
  const totalPages = documentosState.pagination.totalPages;

  // ================================
  // FILTRADO
  // ================================
  const filteredDocumentos = useMemo(() => {
    return documentosState.data.filter((documento) => {
      const matchesSearch = documento.nombreDocumento
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const caserioFilter =
        !selectedCaserio || selectedCaserio === "all"
          ? true
          : documento.nombreCaserio === selectedCaserio;

      const centroPobladoFilter =
        !selectedCentroPoblado || selectedCentroPoblado === "all"
          ? true
          : documento.nombreCentroPoblado === selectedCentroPoblado;

      const ambitoFilter =
        !selectedAmbito || selectedAmbito === "all"
          ? true
          : documento.nombreAmbito === selectedAmbito;

      const dateFilter = !selectedDate
        ? true
        : new Date(documento.fechaIngreso).toDateString() ===
          selectedDate.toDateString();

      return (
        matchesSearch &&
        caserioFilter &&
        centroPobladoFilter &&
        ambitoFilter &&
        dateFilter
      );
    });
  }, [
    documentosState.data,
    searchTerm,
    selectedCaserio,
    selectedCentroPoblado,
    selectedAmbito,
    selectedDate,
  ]);

  // ================================
  // DOCUMENTOS DE LA PÁGINA ACTUAL
  // ================================
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

  // ================================
  // HANDLERS PARA EDICIÓN / ELIMINACIÓN
  // ================================
  const handleEdit = (id?: number) => {
    if (id !== undefined) {
      const documento = documentosState.data.find((d) => d.id === id);
      if (documento) {
        setSelectedDocumento(documento);
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const documento = documentosState.data.find((d) => d.id === id);
      if (documento) {
        setSelectedDocumento(documento);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedDocumento) {
      setDocumentos((prevState) => ({
        ...prevState,
        data: prevState.data.filter((d) => d.id !== selectedDocumento.id),
        pagination: {
          ...prevState.pagination,
          totalItems: prevState.pagination.totalItems - 1,
          totalPages: Math.ceil(
            (prevState.pagination.totalItems - 1) /
              prevState.pagination.pageSize
          ),
        },
      }));
      setIsDeleteModalOpen(false);
      setSelectedDocumento(undefined);
      setDataVersion((prev) => prev + 1);

      // Ajustar la página si nos quedamos sin elementos
      if (currentDocumentos.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // ================================
  // HANDLERS PARA DESCARGA
  // ================================
  const handleDownload = (id?: number) => {
    if (id !== undefined) {
      const document = documentosState.data.find((doc) => doc.id === id);
      if (document) {
        setSelectedDocument({
          id: document.id,
          nombreDocumento: document.nombreDocumento,
          fileSize: "2.5 MB", // Reemplazar con datos reales
          fileType: "PDF",    // Reemplazar con datos reales
        });
        setIsDownloadModalOpen(true);
      }
    }
  };

  const handleConfirmDownload = async () => {
    if (selectedDocument) {
      try {
        // Lógica real de descarga
        console.log(`Descargando documento ${selectedDocument.id}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación
        setIsDownloadModalOpen(false);
      } catch (error) {
        console.error("Error en la descarga:", error);
      }
    }
  };

  // ================================
  // HANDLER PARA ACTUALIZACIÓN
  // ================================
  const handleUpdateDocumento = async (data: Documento) => {
    setDocumentos((prevState) => ({
      ...prevState,
      data: prevState.data.map((doc) =>
        doc.id === data.id ? { ...doc, ...data } : doc
      ),
    }));
    setIsModalOpen(false);
    setSelectedDocumento(undefined);
    setDataVersion((prev) => prev + 1);
  };

  // ================================
  // PAGINACIÓN
  // ================================
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ================================
  // RENDER
  // ================================
  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      {/* Header */}
      <ListaDocumentosHeader title="Documentos Ingresados" />

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Filtros y búsqueda */}
        <ListaDocumentosSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCaserio={selectedCaserio}
          setSelectedCaserio={setSelectedCaserio}
          selectedCentroPoblado={selectedCentroPoblado}
          setSelectedCentroPoblado={setSelectedCentroPoblado}
          selectedAmbito={selectedAmbito}
          setSelectedAmbito={setSelectedAmbito}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {/* Tabla */}
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
              <ListaDocumentosTable
                currentDocumentos={currentDocumentos}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onDownload={handleDownload}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Paginación */}
        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal de edición */}
      {isModalOpen && selectedDocumento && (
        <ActualizacionDocumentoModal
          isOpen={isModalOpen}
          documento={{
            id: selectedDocumento.id,
            documentoBytes: new File([], "empty.pdf"),
            nombre: selectedDocumento.nombreDocumento,
            folios: 0,
            asunto: "",
            ambitoId: 0,
            categoriaId: 0,
            centroPobladoId: 0,
            caserioId: 0,
          }}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdateDocumento}
        />
      )}

      {/* Modal de eliminación */}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedDocumento?.nombreDocumento || ""}
        />
      )}

      {/* Modal de descarga */}
      {selectedDocument && (
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          onConfirm={handleConfirmDownload}
          fileName={selectedDocument.nombreDocumento}
          fileSize={selectedDocument.fileSize}
          fileType={selectedDocument.fileType}
        />
      )}
    </div>
  );
};
