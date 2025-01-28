import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { AnimatePresence, motion } from "framer-motion";
import { Pagination } from "@/components/ui/pagination";
import { Documento } from "@/model/documento";
import { DocumentoPaginatedResponse } from "@/model/documentoPaginatedResponse";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import DownloadModal from "@/components/modal/alerts/download-modal/DownloadModal";
import { ListaDocumentosRecibidosHeader } from "./ReceivedDocumentsHeader";
import { ListaDocumentosRecibidosSearch } from "./ReceivedDocumentsSearch";
import { ListaDocumentosRecibidosTable } from "./ReceivedDocumentsTable";
import { Ambito } from "@/model/ambito";
import { CentroPoblado } from "@/model/centroPoblado";
import { Caserio } from "@/model/caserio";
import { getAmbitos } from "@/service/ambitoService";
import { getAllCaserios } from "@/service/caserioService";
import { getCentrosPoblados } from "@/service/centroPobladoService";
import { getCaseriosByCentroPobladoId } from "@/service/caserioService";
import {
  searchDocumentos,
  downloadDocumento,
  deleteDocumento
} from "@/service/documentoService";
import { DerivacionModal } from "@/components/modal/derivacion-modal/DerivacionModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const ListaDocumentosRecibidosContainer: React.FC = () => {
  const [documentosState, setDocumentosState] =
    useState<DocumentoPaginatedResponse>({
      data: [],
      pagination: { currentPage: 1, pageSize: 4, totalItems: 0, totalPages: 0 },
    });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const [isDerivacionModalOpen, setIsDerivacionModalOpen] = useState(false);
  const [selectedDocumentoId, setSelectedDocumentoId] = useState<
    number | undefined
  >();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCaserio, setSelectedCaserio] = useState<string | undefined>();
  const [selectedCentroPoblado, setSelectedCentroPoblado] = useState<
    string | undefined
  >();
  const [selectedAmbito, setSelectedAmbito] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const [centrosPoblados, setCentrosPoblados] = useState<CentroPoblado[]>([]);
  const [caserios, setCaserios] = useState<Caserio[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);
  const [selectedDocumento, setSelectedDocumento] = useState<
    Documento | undefined
  >(undefined);
  const [selectedDocumentDownload, setSelectedDocumentDownload] = useState<{
    id: number;
    nombreDocumento: string;
    fileSize: string;
    fileType: string;
  } | null>(null);

  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [noResultsMessage, setNoResultsMessage] = useState<string>("");

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
  const [updateSuccessConfig, setUpdateSuccessConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const showError = (message: string) => {
    setErrorModalConfig({ isOpen: true, message });
  };

  const showSuccess = (message: string) => {
    setSuccessModalConfig({ isOpen: true, message });
  };

  const loadFilters = async () => {
    setIsLoading(true);
    try {
      const [ambitosData, centrosPobladosData] = await Promise.all([
        getAmbitos(),
        getCentrosPoblados(),
      ]);
      setAmbitos(ambitosData);
      setCentrosPoblados(centrosPobladosData);

      // Cargar todos los caseríos inicialmente
      loadAllCaserios();
    } catch (error) {
      console.error(error);
      showError("Error al cargar los catálogos");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllCaserios = async () => {
    try {
      const caseriosData = await getAllCaserios();
      setCaserios(caseriosData);
    } catch (error) {
      console.error(error);
      showError("Error al cargar todos los caseríos");
    }
  };

  const loadCaseriosByCentroPoblado = async (centroPobladoId: string) => {
    try {
      const caseriosData = await getCaseriosByCentroPobladoId(
        Number(centroPobladoId)
      );
      setCaserios(caseriosData ?? []);
    } catch (error) {
      console.error(error);
      showError("Error al cargar los caseríos por centro poblado");
    }
  };

  // Hook para cargar catálogos al iniciar
  useEffect(() => {
    loadFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCentroPoblado) {
      // Si hay un centro poblado seleccionado
      loadCaseriosByCentroPoblado(selectedCentroPoblado);
    } else {
      // Mostrar todos
      loadAllCaserios();
    }
  }, [selectedCentroPoblado]);

  const loadDocumentos = async ({
    page,
    searchValue,
    ambito,
    centroPoblado,
    caserio,
    date,
  }: {
    page: number;
    searchValue: string;
    ambito?: string;
    centroPoblado?: string;
    caserio?: string;
    date?: Date;
  }) => {
    try {
      setIsLoading(true);
      setShowNoResults(false);

      const numericValue = parseInt(searchValue, 10);
      const p_dni = !isNaN(numericValue) ? numericValue : undefined;
      const p_fecha_ingreso = date
        ? date.toISOString().split("T")[0]
        : undefined;

      // Convertir explícitamente los IDs a números
      const params = {
        p_page: page,
        p_page_size: 4,
        p_dni,
        p_id_caserio:
          caserio && caserio !== "all" ? parseInt(caserio, 10) : undefined,
        p_id_centro_poblado:
          centroPoblado && centroPoblado !== "all"
            ? parseInt(centroPoblado, 10)
            : undefined,
        p_id_ambito:
          ambito && ambito !== "all" ? parseInt(ambito, 10) : undefined,
        p_fecha_ingreso,
      };

      console.log("Params enviados al servicio:", params);

      const response = await searchDocumentos(params);

      const anyFilterApplied =
        searchValue.trim() !== "" ||
        !!ambito ||
        !!centroPoblado ||
        !!caserio ||
        !!date;

      if (response.data.length === 0 && anyFilterApplied) {
        setShowNoResults(true);
        setNoResultsMessage("No se encontraron resultados para la búsqueda.");
      } else {
        setShowNoResults(false);
      }

      setDocumentosState(response);
    } catch (error) {
      console.error(error);
      showError("Error al buscar documentos");
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };

  const debouncedSearch = useCallback(
    debounce(
      (
        page: number,
        searchValue: string,
        ambito?: string,
        centroPoblado?: string,
        caserio?: string,
        date?: Date
      ) => {
        loadDocumentos({
          page,
          searchValue,
          ambito,
          centroPoblado,
          caserio,
          date,
        });
      },
      500
    ),
    []
  );

  useEffect(() => {
    debouncedSearch(
      currentPage,
      searchTerm,
      selectedAmbito,
      selectedCentroPoblado,
      selectedCaserio,
      selectedDate
    );
  }, [
    currentPage,
    searchTerm,
    selectedAmbito,
    selectedCentroPoblado,
    selectedCaserio,
    selectedDate,
    debouncedSearch,
  ]);

  const handleSend = (id?: number) => {
    if (id !== undefined) {
      setSelectedDocumentoId(id);
      setIsDerivacionModalOpen(true);
    }
  };

  const handleDerivar = async (areaId: number) => {
    try {
      console.log(
        `Derivando documento ${selectedDocumentoId} al área ${areaId}`
      );
      // Aquí implementarías la lógica de derivación
      setIsDerivacionModalOpen(false);
      setSuccessModalConfig({
        isOpen: true,
        message: "Documento derivado exitosamente.",
      });
    } catch (error) {
      showError("Error al derivar el documento.");
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > documentosState.pagination.totalPages) return;
    setCurrentPage(page);
  };


  const handleDeleteClick = (id?: number) => {
    if (!id) return;
    const documento = documentosState.data.find((d) => d.id === id);
    if (documento) {
      setSelectedDocumento({
        id: documento.id,
        nombre: documento.nombreDocumento || "",
      } as Documento);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedDocumento?.id) {
        await deleteDocumento(selectedDocumento.id);
        setDocumentosState((prev) => ({
          ...prev,
          data: prev.data.filter((d) => d.id !== selectedDocumento.id),
        }));
        showSuccess("Documento eliminado correctamente.");
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      showError("Error al eliminar el documento.");
    }
  };

  const handleDownload = (id?: number) => {
    if (id !== undefined) {
      const documento = documentosState.data.find((d) => d.id === id);
      if (documento) {
        setSelectedDocumentDownload({
          id: documento.id,
          nombreDocumento: documento.nombreDocumento,
          fileSize: "2.5 MB",
          fileType: "PDF",
        });
        setIsDownloadModalOpen(true);
      }
    }
  };

  const handleConfirmDownload = async () => {
    try {
      if (selectedDocumentDownload?.id) {
        const fileData = await downloadDocumento(selectedDocumentDownload.id);
        const blob = new Blob([fileData], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedDocumentDownload.nombreDocumento}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        setIsDownloadModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      showError("Error al descargar el documento.");
    }
  };

  return (
    <div className="pt-2 px-2 bg-transparent">
      <ListaDocumentosRecibidosHeader title="Documentos Recibidos" />

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <ListaDocumentosRecibidosSearch
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
          ambitos={ambitos}
          centrosPoblados={centrosPoblados}
          caserios={caserios}
        />

        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <LoadingSpinner
              size="lg"
              message="Cargando documentos..."
              color="#145A32"
              backgroundColor="rgba(20, 90, 50, 0.2)"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-`}
                variants={tableVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <ListaDocumentosRecibidosTable
                  currentDocumentos={documentosState.data}
                  onDelete={handleDeleteClick}
                  onDownload={handleDownload}
                  onSend={handleSend}
                  showEmpty={hasFetched && documentosState.data.length === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {documentosState.pagination.totalPages > 0 && (
          <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
            <Pagination
              currentPage={documentosState.pagination.currentPage}
              totalPages={documentosState.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedDocumento?.nombre || ""}
        />
      )}

      {selectedDocumentDownload && (
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          onConfirm={handleConfirmDownload}
          fileName={selectedDocumentDownload.nombreDocumento}
          fileSize={selectedDocumentDownload.fileSize}
          fileType={selectedDocumentDownload.fileType}
        />
      )}

      <NoResultsModal
        isOpen={showNoResults}
        onClose={() => setShowNoResults(false)}
        message={noResultsMessage}
      />

      <ErrorModal
        isOpen={errorModalConfig.isOpen}
        onClose={() =>
          setErrorModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Error"
        errorMessage={errorModalConfig.message}
      />

      <SuccessModal
        isOpen={successModalConfig.isOpen}
        onClose={() =>
          setSuccessModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Operación Exitosa"
        message={successModalConfig.message}
      />

      <UpdateSuccessModal
        isOpen={updateSuccessConfig.isOpen}
        onClose={() =>
          setUpdateSuccessConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Actualización Exitosa"
        message={updateSuccessConfig.message}
      />

      <DerivacionModal
        isOpen={isDerivacionModalOpen}
        onClose={() => setIsDerivacionModalOpen(false)}
        onSubmit={handleDerivar}
      />
    </div>
  );
};
