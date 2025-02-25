/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { AnimatePresence, motion } from "framer-motion";
import { Pagination } from "@/components/ui/pagination";
import { DocumentoRechazadoPaginatedResponse } from "@/model/documentoRechazadoPaginatedResponse";
import DownloadModal from "@/components/modal/alerts/download-modal/DownloadModal";
import { ListaDocumentosRechazadosHeader } from "./DocumentosRechazadosHeader";
import { ListaDocumentosRechazadosSearch } from "./DocumentosRechazadosSearch";
import { ListaDocumentosRechazadosTable } from "./DocumentosRechazadosTable";
import { Ambito } from "@/model/ambito";
import { CentroPoblado } from "@/model/centroPoblado";
import { Caserio } from "@/model/caserio";
import { getAmbitos } from "@/service/ambitoService";
import {
  getAllCaserios,
  getCaseriosByCentroPobladoId,
} from "@/service/caserioService";
import { getCentrosPoblados } from "@/service/centroPobladoService";

import {
  getRejectedDocumentsByAreaId,
  downloadDocumento,
} from "@/service/documentoService";

import { DerivacionModal } from "@/components/modal/derivacion-modal/DerivacionModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { createDerivacion } from "@/service/derivacionService";
import { Derivacion } from "@/model/derivacion";
import {
  getDetalleDerivaciones,
  createDetalleDerivacion,
} from "@/service/detalleDerivacionService";
import { DetalleDerivacionModal } from "@/components/modal/detalle-derivacion-modal/DetalleDerivacionModal";
import {DetalleDerivacion} from "@/model/detalleDerivacion";
import { RechazoDocumentoModal } from "@/components/modal/rechazo-documento-modal/RechazoDocumentoModal";
import { ConfirmacionRecepcionModal } from "@/components/modal/confirmacion-recepcion-modal/ConfirmacionRecepcionModal";

const tableVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const ListaDocumentosRechazadosContainer: React.FC = () => {
  const [documentosState, setDocumentosState] =
    useState<DocumentoRechazadoPaginatedResponse>({
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

  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [detallesDerivacion, setDetallesDerivacion] = useState<
    DetalleDerivacion[]
  >([]);

  const [isRechazoModalOpen, setIsRechazoModalOpen] = useState(false);
  const [selectedDocumentoRechazoId, setSelectedDocumentoRechazoId] = useState<
    number | null
  >(null);

  const [isRecepcionModalOpen, setIsRecepcionModalOpen] = useState(false);
  const [selectedDocumentoRecepcionId, setSelectedDocumentoRecepcionId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCaserio, setSelectedCaserio] = useState<string | undefined>();
  const [selectedCentroPoblado, setSelectedCentroPoblado] = useState<
    string | undefined
  >();
  const [selectedAmbito, setSelectedAmbito] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedConfirmacion, setSelectedConfirmacion] = useState<
    string | undefined
  >();

  const [ambitos, setAmbitos] = useState<Ambito[]>([]);
  const [centrosPoblados, setCentrosPoblados] = useState<CentroPoblado[]>([]);
  const [caserios, setCaserios] = useState<Caserio[]>([]);

  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);
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

  useEffect(() => {
    loadFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCentroPoblado) {
      loadCaseriosByCentroPoblado(selectedCentroPoblado);
    } else {
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
    confirmacion,
  }: {
    page: number;
    searchValue: string;
    ambito?: string;
    centroPoblado?: string;
    caserio?: string;
    date?: Date;
    confirmacion?: string;
  }) => {
    try {
      setIsLoading(true);
      setShowNoResults(false);
      const p_fecha_ingreso = date
        ? date.toISOString().split("T")[0]
        : undefined;

      const areaId = sessionStorage.getItem("areaId");
      if (!areaId) {
        throw new Error("No se encontró el ID del área (destino)");
      }

      const params = {
        p_area_destino_id: parseInt(areaId, 10),
        p_search_document: searchValue.trim() === "" ? null : searchValue,
        p_id_caserio:
          caserio && caserio !== "all" ? parseInt(caserio, 10) : undefined,
        p_id_centro_poblado:
          centroPoblado && centroPoblado !== "all"
            ? parseInt(centroPoblado, 10)
            : undefined,
        p_id_ambito:
          ambito && ambito !== "all" ? parseInt(ambito, 10) : undefined,
        p_nombre_categoria: undefined,
        p_fecha_ingreso,
        p_page: page,
        p_page_size: 5,
      };

      const response = await getRejectedDocumentsByAreaId(params);
      const anyFilterApplied =
        searchValue.trim() !== "" ||
        !!ambito ||
        !!centroPoblado ||
        !!caserio ||
        !!date ||
        !!confirmacion;

      if (response.data.length === 0 && anyFilterApplied) {
        setShowNoResults(true);
        setNoResultsMessage("No se encontraron resultados para la búsqueda.");
      } else {
        setShowNoResults(false);
      }

      setDocumentosState(response);
    } catch (error) {
      console.error(error);
      showError("Error al buscar documentos (recibidos)");
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
        date?: Date,
        confirmacion?: string
      ) => {
        loadDocumentos({
          page,
          searchValue,
          ambito,
          centroPoblado,
          caserio,
          date,
          confirmacion,
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
      selectedDate,
      selectedConfirmacion
    );
  }, [
    currentPage,
    searchTerm,
    selectedAmbito,
    selectedCentroPoblado,
    selectedCaserio,
    selectedDate,
    selectedConfirmacion,
    debouncedSearch,
  ]);

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
      setIsDerivacionModalOpen(false);
      setSuccessModalConfig({
        isOpen: true,
        message: "Documento derivado exitosamente.",
      });

      await loadDocumentos({
        page: currentPage,
        searchValue: searchTerm,
        ambito: selectedAmbito,
        centroPoblado: selectedCentroPoblado,
        caserio: selectedCaserio,
        date: selectedDate,
        confirmacion: selectedConfirmacion,
      });
    } catch (error: any) {
      showError(error.message || "Error al derivar el documento.");
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > documentosState.pagination.totalPages) return;
    setCurrentPage(page);
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

  const handleVerDetalle = async (derivacionId?: number) => {
    if (!derivacionId) return;
    try {
      const detalles = await getDetalleDerivaciones(derivacionId);
      console.log("Detalles de derivación:", detalles);
      setDetallesDerivacion(detalles);
      setIsDetalleModalOpen(true);
    } catch (error: any) {
      showError(error?.message || "Error al cargar los detalles de derivación");
    }
  };

  const handleRejectClick = (id?: number) => {
    if (!id) return;
    setSelectedDocumentoRechazoId(id);
    setIsRechazoModalOpen(true);
  };

  const handleRejectSubmit = async (comentario: string) => {
    if (!selectedDocumentoRechazoId) return;

    try {
      const userIdString = sessionStorage.getItem("userId");
      if (!userIdString) {
        showError("No se encontró userId en sessionStorage.");
        return;
      }

      const userId = parseInt(userIdString, 10);

      await createDetalleDerivacion({
        derivacionId: selectedDocumentoRechazoId,
        comentario: comentario,
        usuarioId: userId,
        estado: "Rechazada",
      });

      setIsRechazoModalOpen(false);
      showSuccess("Documento rechazado exitosamente.");

      await loadDocumentos({
        page: currentPage,
        searchValue: searchTerm,
        ambito: selectedAmbito,
        centroPoblado: selectedCentroPoblado,
        caserio: selectedCaserio,
        date: selectedDate,
        confirmacion: selectedConfirmacion,
      });
    } catch (error) {
      console.error(error);
      showError("Error al rechazar el documento.");
    }
  };

  const handleConfirmClick = (id?: number) => {
    if (!id) return;
    setSelectedDocumentoRecepcionId(id);
    setIsRecepcionModalOpen(true);
  };

  const handleConfirmRecepcion = async () => {
    if (!selectedDocumentoRecepcionId) return;

    try {
      const userIdString = sessionStorage.getItem("userId");
      if (!userIdString) {
        showError("No se encontró userId en sessionStorage.");
        return;
      }

      const userId = parseInt(userIdString, 10);

      await createDetalleDerivacion({
        derivacionId: selectedDocumentoRecepcionId,
        comentario:
          "La recepcion del documento fue confirmada por el area correspondiente",
        usuarioId: userId,
        estado: "Recepcionada",
      });

      setIsRecepcionModalOpen(false);
      showSuccess("Documento recepcionado exitosamente.");

      await loadDocumentos({
        page: currentPage,
        searchValue: searchTerm,
        ambito: selectedAmbito,
        centroPoblado: selectedCentroPoblado,
        caserio: selectedCaserio,
        date: selectedDate,
        confirmacion: selectedConfirmacion,
      });
    } catch (error) {
      console.error(error);
      showError("Error al confirmar la recepción del documento.");
    }
  };

  return (
    <div className="pt-2 px-2 bg-transparent">
      <ListaDocumentosRechazadosHeader title="Documentos Rechazados" />
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <ListaDocumentosRechazadosSearch
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
          selectedConfirmacion={selectedConfirmacion}
          setSelectedConfirmacion={setSelectedConfirmacion}
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
                key={`${currentPage}-${selectedConfirmacion}`}
                variants={tableVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <ListaDocumentosRechazadosTable
                  currentDocumentos={documentosState.data}
                  onDownload={handleDownload}
                  onSend={handleSend}
                  onVerDetalle={handleVerDetalle}
                  onReject={handleRejectClick}
                  onConfirmarRecepcion={handleConfirmClick}
                  showEmpty={hasFetched && documentosState.data.length === 0}
                  selectedConfirmacion={selectedConfirmacion}
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

      <DetalleDerivacionModal
        isOpen={isDetalleModalOpen}
        detalles={detallesDerivacion}
        onClose={() => setIsDetalleModalOpen(false)}
      />

      <RechazoDocumentoModal
        isOpen={isRechazoModalOpen}
        onClose={() => setIsRechazoModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />

      <ConfirmacionRecepcionModal
        isOpen={isRecepcionModalOpen}
        onClose={() => setIsRecepcionModalOpen(false)}
        onConfirm={handleConfirmRecepcion}
      />
    </div>
  );
};
