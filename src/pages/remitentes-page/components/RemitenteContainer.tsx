import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { Remitente } from "@/model/remitente";
import { RemitentePaginatedResponse } from "@/model/remitentePaginatedResponse";
import { RemitenteHeader } from "./RemitenteHeader";
import { RemitenteSearch } from "./RemitenteSearch";
import { RemitenteTable } from "./RemitenteTable";
import { RemitenteModal } from "@/components/modal/remitente-modal/RemitenteModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import { Pagination } from "@/components/ui/pagination";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

import {
  getRemitentesPaginated,
  createRemitente,
  updateRemitente,
  findByString,
  deleteRemitente,
  getRemitenteById,
} from "@/service/remitenteService";

export const RemitenteContainer: React.FC = () => {
  const [remitentesState, setRemitentesState] =
    useState<RemitentePaginatedResponse>({
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 4,
        totalItems: 0,
        totalPages: 0,
      },
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRemitente, setSelectedRemitente] = useState<
    Remitente | undefined
  >(undefined);
  const [dataVersion, setDataVersion] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState("");

  const [errorModalConfig, setErrorModalConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const [successModalConfig, setSuccessModalConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const [updateSuccessConfig, setUpdateSuccessConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const showError = (message: string) => {
    setErrorModalConfig({ isOpen: true, message });
  };

  const showSuccess = (message: string) => {
    setSuccessModalConfig({ isOpen: true, message });
  };

  const loadPaginatedData = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getRemitentesPaginated(
        page,
        remitentesState.pagination.pageSize
      );
      setRemitentesState(response);
    } catch (error) {
      showError("Error al cargar los remitentes");
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
            setRemitentesState((prev) => ({
              ...prev,
              data: [],
            }));
          } else {
            setRemitentesState((prev) => ({
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
        setNoResultsMessage("No se encontraron resultados");
        setShowNoResults(true);
        setRemitentesState((prev) => ({
          ...prev,
          data: [],
        }));
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    loadPaginatedData(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (
      isSearchMode ||
      page < 1 ||
      page > remitentesState.pagination.totalPages
    )
      return;
    loadPaginatedData(page);
  };

  const handleEdit = async (id?: number) => {
    try {
      if (id !== undefined) {
        const data = await getRemitenteById(id);
        if (data) {
          setSelectedRemitente(data);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      showError("Error al cargar los datos del remitente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const remitente = remitentesState.data.find((r) => r.id === id);
      if (remitente) {
        setSelectedRemitente(remitente);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedRemitente?.id) {
        setIsLoading(true);
        await deleteRemitente(selectedRemitente.id);

        const newTotalItems = remitentesState.pagination.totalItems - 1;
        const newTotalPages = Math.ceil(
          newTotalItems / remitentesState.pagination.pageSize
        );

        const pageToLoad =
          remitentesState.pagination.currentPage > newTotalPages
            ? newTotalPages
            : remitentesState.pagination.currentPage;

        await loadPaginatedData(pageToLoad);
        setIsDeleteModalOpen(false);
        setSelectedRemitente(undefined);
        setDataVersion((prev) => prev + 1);
        showSuccess("Remitente eliminado correctamente");
      }
    } catch (error) {
      showError("Error al eliminar el remitente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: Remitente) => {
    try {
      setIsLoading(true);
      if (data.id) {
        await updateRemitente(data.id, {
          dni: data.dni,
          nombres: data.nombres,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno,
          genero: data.genero,
        });
        await loadPaginatedData(remitentesState.pagination.currentPage);
        setUpdateSuccessConfig({
          isOpen: true,
          message: "Remitente actualizado correctamente",
        });
      } else {
        await createRemitente({
          dni: data.dni,
          nombres: data.nombres,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno,
          genero: data.genero,
        });
        const totalItems = remitentesState.pagination.totalItems + 1;
        const newPage = Math.ceil(
          totalItems / remitentesState.pagination.pageSize
        );
        await loadPaginatedData(newPage);
        showSuccess("Remitente creado correctamente");
      }
      setIsModalOpen(false);
      setSelectedRemitente(undefined);
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
      <RemitenteHeader onAddClick={() => setIsModalOpen(true)} />

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <RemitenteSearch
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
              message="Cargando remitentes..."
              color="#145A32"
              backgroundColor="rgba(20, 90, 50, 0.2)"
            />
          </div>
        ) : (
          <RemitenteTable
            remitentes={remitentesState.data}
            dataVersion={dataVersion}
            currentPage={remitentesState.pagination.currentPage}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {!isSearchMode && (
          <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
            <Pagination
              currentPage={remitentesState.pagination.currentPage}
              totalPages={remitentesState.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <RemitenteModal
          isOpen={isModalOpen}
          remitente={selectedRemitente}
          onClose={() => {
            setSelectedRemitente(undefined);
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
          itemName={
            selectedRemitente
              ? `${selectedRemitente.nombres} ${selectedRemitente.apellidoPaterno} ${selectedRemitente.apellidoMaterno}`
              : ""
          }
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
