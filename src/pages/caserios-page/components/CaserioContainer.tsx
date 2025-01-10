import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { CaserioPaginatedResponse } from "@/model/caserioPaginatedResponse";
import { CaserioDetails } from "@/model/caserioDetails";
import { Caserio } from "@/model/caserio";
import { CaserioHeader } from "./CaserioHeader";
import { CaserioSearch } from "./CaserioSearch";
import { CaserioTable } from "./CaserioTable";
import { CaserioModal } from "@/components/modal/caserio-modal/CaserioModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { Pagination } from "@/components/ui/pagination";
import {
  getCaseriosPaginated,
  createCaserio,
  updateCaserio,
  deleteCaserio,
  getCaserioById,
  findByString,
} from "@/service/caserioService";

export const CaserioContainer: React.FC = () => {
  const [caseriosState, setCaseriosState] = useState<CaserioPaginatedResponse>({
    data: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCaserio, setSelectedCaserio] = useState<
    CaserioDetails | undefined
  >();
  const [dataVersion, setDataVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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
      const response = await getCaseriosPaginated(
        page,
        caseriosState.pagination.pageSize
      );
      setCaseriosState(response);
    } catch (error) {
      showError("Error al cargar la lista de caseríos");
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
            setCaseriosState((prev) => ({
              ...prev,
              data: [],
              pagination: {
                ...prev.pagination,
                totalItems: 0,
                totalPages: 0,
              },
            }));
          } else {
            setCaseriosState((prev) => ({
              ...prev,
              data: searchResults,
              pagination: {
                currentPage: 1,
                pageSize: prev.pagination.pageSize,
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
          setCaseriosState((prev) => ({
            ...prev,
            data: [],
            pagination: {
              ...prev.pagination,
              totalItems: 0,
              totalPages: 0,
            },
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
    if (isSearchMode) return;
    if (page < 1 || page > caseriosState.pagination.totalPages) return;
    loadPaginatedData(page);
  };

  const handleEdit = async (id?: number) => {
    try {
      if (id !== undefined) {
        const data = await getCaserioById(id);
        if (data) {
          setSelectedCaserio(data);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      showError("Error al cargar los datos del caserío");
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const caserio = caseriosState.data.find((c) => c.id === id);
      if (caserio) {
        setSelectedCaserio(caserio);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCaserio?.id) return;
    try {
      setIsLoading(true);
      await deleteCaserio(selectedCaserio.id);

      const newTotalItems = caseriosState.pagination.totalItems - 1;
      const newTotalPages = Math.ceil(
        newTotalItems / caseriosState.pagination.pageSize
      );
      const pageToLoad =
        caseriosState.pagination.currentPage > newTotalPages
          ? newTotalPages
          : caseriosState.pagination.currentPage;

      await loadPaginatedData(pageToLoad > 0 ? pageToLoad : 1);
      setShowNoResults(false);
      setIsDeleteModalOpen(false);
      setSelectedCaserio(undefined);
      setDataVersion((prev) => prev + 1);
      showSuccess("Caserío eliminado correctamente");
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Error al eliminar el caserío");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: Caserio) => {
    try {
      setIsLoading(true);

      if (data.id) {
        await updateCaserio(data.id, {
          nombreCaserio: data.nombreCaserio,
          centroPobladoId:
            typeof data.centroPobladoId === "string"
              ? parseInt(data.centroPobladoId)
              : data.centroPobladoId ?? undefined,
        });
        await loadPaginatedData(caseriosState.pagination.currentPage);
        setUpdateSuccessConfig({
          isOpen: true,
          message: "Caserío actualizado correctamente",
        });
      } else {
        await createCaserio(data);
        const totalItems = caseriosState.pagination.totalItems + 1;
        const newPage = Math.ceil(
          totalItems / caseriosState.pagination.pageSize
        );
        await loadPaginatedData(newPage);
        showSuccess("Caserío creado correctamente");
      }
      setIsModalOpen(false);
      setSelectedCaserio(undefined);
      setDataVersion((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError(`Error al ${data.id ? "actualizar" : "crear"} el caserío`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <CaserioHeader onAddClick={() => setIsModalOpen(true)} />

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <CaserioSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onClear={() => {
            setSearchTerm("");
            setIsSearchMode(false);
            loadPaginatedData(1);
          }}
        />

        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <LoadingSpinner
              size="lg"
              message="Cargando caseríos..."
              color="#145A32"
            />
          </div>
        ) : (
          <CaserioTable
            caserios={caseriosState.data}
            dataVersion={dataVersion}
            currentPage={caseriosState.pagination.currentPage}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {!isSearchMode && (
          <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
            <Pagination
              currentPage={caseriosState.pagination.currentPage}
              totalPages={caseriosState.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <CaserioModal
          isOpen={isModalOpen}
          caserio={selectedCaserio}
          onClose={() => {
            setSelectedCaserio(undefined);
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
          itemName={selectedCaserio?.nombreCaserio || ""}
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
