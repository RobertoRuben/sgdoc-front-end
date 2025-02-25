import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pagination } from "@/components/ui/pagination";
import { DocumentoPaginatedResponse } from "@/model/documentoPaginatedResponse";
import DownloadModal from "@/components/modal/alerts/download-modal/DownloadModal";
import RegistroDocumentoModal from "@/components/modal/documento-modal/registro-documento-modal/RegistroDocumentoModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import { IngresoDocumentosHeader } from "./IngresoDocumentosHeader";
import { IngresoDocumentosSearch } from "./IngresoDocumentosSearch";
import { IngresoDocumentosTable } from "./IngresoDocumentosTable";
import { DerivacionModal } from "@/components/modal/derivacion-modal/DerivacionModal";
import { Derivacion } from "@/model/derivacion";
import { Notificacion } from "@/model/notification";
import {
  getDocumentosByCurrentDate,
  downloadDocumento,
} from "@/service/documentoService";
import { createDerivacion } from "@/service/derivacionService";
import { createNotificacion } from "@/service/notificactionService";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";

const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const IngresoDocumentosContainer: React.FC = () => {
  const [documentosState, setDocumentosState] =
    useState<DocumentoPaginatedResponse>({
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
      },
    });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isDerivacionModalOpen, setIsDerivacionModalOpen] = useState(false);
  const [selectedDocumentoId, setSelectedDocumentoId] = useState<
    number | undefined
  >();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: number;
    nombreDocumento: string;
    fileSize: string;
    fileType: string;
  } | null>(null);

  const [errorModalConfig, setErrorModalConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const [successModalConfig, setSuccessModalConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const [dataVersion] = useState<number>(0);
  const prevPageRef = useRef<number>(currentPage);
  const pageDirection = currentPage >= prevPageRef.current ? 1 : -1;

  useEffect(() => {
    prevPageRef.current = currentPage;
  }, [currentPage]);

  const showError = (message: string) => {
    setErrorModalConfig({ isOpen: true, message });
  };

  const loadDocumentos = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getDocumentosByCurrentDate(
        page,
        documentosState.pagination.pageSize
      );
      setDocumentosState(response);
      setCurrentPage(response.pagination.currentPage);
    } catch (error) {
      showError("Error al cargar los documentos.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentos(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const filteredDocumentos = documentosState.data.filter((doc) =>
    doc.nombreDocumento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > documentosState.pagination.totalPages) return;
    setCurrentPage(page);
    loadDocumentos(page);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleDownload = (id?: number) => {
    if (id !== undefined) {
      const document = documentosState.data.find((doc) => doc.id === id);
      if (document) {
        setSelectedDocument({
          id: document.id,
          nombreDocumento: document.nombreDocumento,
          fileSize: "2.5 MB",
          fileType: "PDF",
        });
        setIsDownloadModalOpen(true);
      }
    }
  };

  const handleConfirmDownload = async () => {
    try {
      if (selectedDocument?.id) {
        const fileData = await downloadDocumento(selectedDocument.id);
        const blob = new Blob([fileData], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedDocument.nombreDocumento}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        setIsDownloadModalOpen(false);
      }
    } catch (error) {
      showError("Error al descargar el documento.");
      console.error(error);
    }
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  const handleSend = (id?: number) => {
    if (id !== undefined) {
      setSelectedDocumentoId(id);
      setIsDerivacionModalOpen(true);
    }
  };

  const handleDerivar = async (areaDestinoId: number) => {
    if (!selectedDocumentoId) return;
    try {
      const areaOrigenIdString = sessionStorage.getItem("areaId");
      const userIdString = sessionStorage.getItem("userId");
      if (!areaOrigenIdString || !userIdString) {
        showError(
          "No se encontró areaId o userId en sessionStorage. No se puede derivar."
        );
        return;
      }

      const areaOrigenId = parseInt(areaOrigenIdString, 10);
      const userId = parseInt(userIdString, 10);

      const nuevaDerivacion: Derivacion = {
        documentoId: selectedDocumentoId,
        areaOrigenId,
        areaDestinoId,
        usuarioId: userId,
      };

      await createDerivacion(nuevaDerivacion);

      const nuevaNotificacion: Notificacion = {
        comentario: 'Se te ha enviado un nuevo documento. Revisa en bandeja de entrada la seccion de documentos recibidos.',
        areaDestinoId: areaDestinoId
      };
      await createNotificacion(nuevaNotificacion);
      setIsDerivacionModalOpen(false);
      setSuccessModalConfig({
        isOpen: true,
        message: "Documento derivado exitosamente.",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showError(error.message || "Error al derivar el documento.");
      console.error(error);
    }
  };

  const handleDocumentoSaved = (isNewDocument: boolean = true) => {
    if (isNewDocument) {
      const totalItems = documentosState.pagination.totalItems + 1;
      const pageSize = documentosState.pagination.pageSize;
      const newPage = Math.ceil(totalItems / pageSize);
      setCurrentPage(newPage);
      loadDocumentos(newPage);
    } else {
      loadDocumentos(documentosState.pagination.currentPage);
    }

    setSuccessModalConfig({
      isOpen: true,
      message: "Documento guardado exitosamente.",
    });
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <IngresoDocumentosHeader onAddClick={handleOpenModal} />
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <IngresoDocumentosSearch
          searchTerm={searchTerm}
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
        />

        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <LoadingSpinner size="lg" message="Cargando documentos..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                custom={pageDirection}
                variants={tableVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <IngresoDocumentosTable
                  currentDocumentos={filteredDocumentos}
                  currentPage={currentPage}
                  dataVersion={dataVersion}
                  onDownload={handleDownload}
                  onSend={handleSend}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
          <Pagination
            currentPage={documentosState.pagination.currentPage}
            totalPages={documentosState.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <RegistroDocumentoModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onDocumentoSaved={handleDocumentoSaved}
        />
      )}

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

      {errorModalConfig.isOpen && (
        <ErrorModal
          isOpen={errorModalConfig.isOpen}
          onClose={() =>
            setErrorModalConfig((prev) => ({ ...prev, isOpen: false }))
          }
          title="Error"
          errorMessage={errorModalConfig.message}
        />
      )}

      <SuccessModal
        isOpen={successModalConfig.isOpen}
        onClose={() =>
          setSuccessModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Operación Exitosa"
        message={successModalConfig.message}
      />

      <DerivacionModal
        isOpen={isDerivacionModalOpen}
        onClose={() => setIsDerivacionModalOpen(false)}
        onSubmit={handleDerivar}
      />
    </div>
  );
};
