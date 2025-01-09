import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { CentroPoblado } from "@/model/centroPoblado";
import { CentroPobladoPaginatedResponse } from "@/model/centroPobladoPaginatedResponse";
import { CentroPobladoHeader } from "./CentroPobladoHeader";
import { CentroPobladoSearch } from "./CentroPobladoSearch";
import { CentroPobladoTable } from "./CentroPobladoTable";
import { CentroPobladoModal } from "@/components/modal/centro-poblado-modal/CentroPobladoModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import { Pagination } from "@/components/ui/pagination";
import {
  getCentrosPobladosPaginated,
  createCentroPoblado,
  updateCentroPoblado,
  findByString,
  deleteCentroPoblado,
  getCentroPobladoById,
} from "@/service/centroPobladoService";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

export const CentroPobladoContainer: React.FC = () => {
  const [centrosPobladosState, setCentrosPobladosState] =
    useState<CentroPobladoPaginatedResponse>({
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
      },
    });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCentroPoblado, setSelectedCentroPoblado] = useState<
    CentroPoblado | undefined
  >();
  const [dataVersion, setDataVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState("");
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
    setErrorModalConfig({
      isOpen: true,
      message,
    });
  };

  const showSuccess = (message: string) => {
    setSuccessModalConfig({
      isOpen: true,
      message,
    });
  };

  const loadPaginatedData = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getCentrosPobladosPaginated(
        page,
        centrosPobladosState.pagination.pageSize
      );
      setCentrosPobladosState(response);
    } catch (error) {
      showError("Error al cargar los centros poblados");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (searchValue: string) => {
      try {
        setIsLoading(true);
        if (searchValue.trim()) {
          const searchResults = await findByString(searchValue);
          if (searchResults.length === 0) {
            setNoResultsMessage(
              "No se encontraron resultados para la búsqueda"
            );
            setShowNoResults(true);
            setCentrosPobladosState((prev) => ({
              ...prev,
              data: [],
            }));
          } else {
            setCentrosPobladosState((prev) => ({
              data: searchResults,
              pagination: {
                ...prev.pagination,
                currentPage: 1,
                totalItems: searchResults.length,
                totalPages: 1,
              },
            }));
          }
          setIsSearchMode(true);
        } else {
          setIsSearchMode(false);
          loadPaginatedData(1);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "NotFoundError") {
          setNoResultsMessage(error.message);
          setShowNoResults(true);
          setCentrosPobladosState((prev) => ({
            ...prev,
            data: [],
          }));
        } else if (error instanceof Error) {
          showError(error.message);
        } else {
          showError("Ocurrió un error en el servidor");
        }
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setIsSearchMode(false);
      loadPaginatedData(1);
    } else {
      debouncedSearch(value);
    }
  };

  useEffect(() => {
    loadPaginatedData(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (
      isSearchMode ||
      page < 1 ||
      page > centrosPobladosState.pagination.totalPages
    )
      return;
    loadPaginatedData(page);
  };

  const handleEdit = async (id?: number) => {
    try {
      if (id !== undefined) {
        const data = await getCentroPobladoById(id);
        if (data) {
          setSelectedCentroPoblado(data);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      showError("Error al cargar los datos del centro poblado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const centroPoblado = centrosPobladosState.data.find((c) => c.id === id);
      if (centroPoblado) {
        setSelectedCentroPoblado(centroPoblado);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedCentroPoblado?.id) {
        setIsLoading(true);
        await deleteCentroPoblado(selectedCentroPoblado.id);

        const newTotalItems = centrosPobladosState.pagination.totalItems - 1;
        const newTotalPages = Math.ceil(
          newTotalItems / centrosPobladosState.pagination.pageSize
        );

        const pageToLoad =
          centrosPobladosState.pagination.currentPage > newTotalPages
            ? newTotalPages
            : centrosPobladosState.pagination.currentPage;

        await loadPaginatedData(pageToLoad);
        setIsDeleteModalOpen(false);
        setSelectedCentroPoblado(undefined);
        setDataVersion((prev) => prev + 1);
        showSuccess("Centro poblado eliminado correctamente");
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Error al eliminar el centro poblado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: CentroPoblado) => {
    try {
      setIsLoading(true);

      if (data.id) {
        await updateCentroPoblado(data.id, {
          nombreCentroPoblado: data.nombreCentroPoblado,
        });
        await loadPaginatedData(centrosPobladosState.pagination.currentPage);
        setUpdateSuccessConfig({
          isOpen: true,
          message: "Centro poblado actualizado correctamente",
        });
      } else {
        await createCentroPoblado({
          nombreCentroPoblado: data.nombreCentroPoblado,
        });
        const totalItems = centrosPobladosState.pagination.totalItems + 1;
        const newPage = Math.ceil(
          totalItems / centrosPobladosState.pagination.pageSize
        );
        await loadPaginatedData(newPage);
        showSuccess("Centro poblado creado correctamente");
      }
      setIsModalOpen(false);
      setSelectedCentroPoblado(undefined);
      setDataVersion((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError(
          `Error al ${data.id ? "actualizar" : "crear"} el centro poblado`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <CentroPobladoHeader onAddClick={() => setIsModalOpen(true)} />

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <CentroPobladoSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onClear={() => {
            setSearchTerm("");
            setIsSearchMode(false);
            loadPaginatedData(1);
          }}
        />

        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <LoadingSpinner
              size="lg"
              message="Cargando centros poblados..."
              color="#145A32"
              backgroundColor="rgba(20, 90, 50, 0.2)"
            />
          </div>
        ) : (
          <CentroPobladoTable
            centrosPoblados={centrosPobladosState.data}
            dataVersion={dataVersion}
            currentPage={centrosPobladosState.pagination.currentPage}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {!isSearchMode && (
          <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
            <Pagination
              currentPage={centrosPobladosState.pagination.currentPage}
              totalPages={centrosPobladosState.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <CentroPobladoModal
          isOpen={isModalOpen}
          centroPoblado={selectedCentroPoblado}
          onClose={() => {
            setSelectedCentroPoblado(undefined);
            setIsModalOpen(false);
          }}
          onSubmit={handleModalSubmit}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedCentroPoblado?.nombreCentroPoblado || ""}
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

      <ErrorModal
        isOpen={errorModalConfig.isOpen}
        onClose={() =>
          setErrorModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Error"
        errorMessage={errorModalConfig.message}
      />

      <UpdateSuccessModal
        isOpen={updateSuccessConfig.isOpen}
        onClose={() =>
          setUpdateSuccessConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Actualización Exitosa"
        message={updateSuccessConfig.message}
      />
      <NoResultsModal
        isOpen={showNoResults}
        onClose={() => setShowNoResults(false)}
        message={noResultsMessage}
      />
    </div>
  );
};
