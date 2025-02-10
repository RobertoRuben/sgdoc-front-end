import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { Area } from "@/model/area";
import { AreaPaginatedResponse } from "@/model/areaPaginatedResponse";
import { AreaHeader } from "./AreaHeader";
import { AreaSearch } from "./AreaSearch";
import { AreaTable } from "./AreaTable";
import { AreaModal } from "@/components/modal/area-modal/AreaModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { Pagination } from "@/components/ui/pagination";
import {
  getAreasPaginated,
  createArea,
  updateArea,
  deleteArea,
  getAreaById,
  findByString,
} from "@/service/areaService";

export const AreaContainer: React.FC = () => {
  const [areasState, setAreasState] = useState<AreaPaginatedResponse>({
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
  const [selectedArea, setSelectedArea] = useState<Area | undefined>();
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
      const response = await getAreasPaginated(page, areasState.pagination.pageSize);
      setAreasState(response);
    } catch (error) {
      showError("Error al cargar la lista de áreas");
      console.error(error);
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
              setNoResultsMessage("No se encontraron resultados para la búsqueda");
              setShowNoResults(true);
              setAreasState((prev) => ({
                ...prev,
                data: [],
                pagination: {
                  ...prev.pagination,
                  totalItems: 0,
                  totalPages: 0,
                },
              }));
            } else {
              setAreasState((prev) => ({
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
        } catch{
          setShowNoResults(true);
          setNoResultsMessage("No se encontraron áreas");
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
    if (page < 1 || page > areasState.pagination.totalPages) return;
    loadPaginatedData(page);
  };

  const handleEdit = async (id?: number) => {
    try {
      if (id !== undefined) {
        const data = await getAreaById(id);
        if (data) {
          setSelectedArea(data);
          setIsModalOpen(true);
        }
      }
    } catch {
      showError("Error al cargar los datos del área");
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const area = areasState.data.find((a) => a.id === id);
      if (area) {
        setSelectedArea(area as Area);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedArea?.id) return;
    try {
      setIsLoading(true);
      await deleteArea(selectedArea.id);

      const newTotalItems = areasState.pagination.totalItems - 1;
      const newTotalPages = Math.ceil(
          newTotalItems / areasState.pagination.pageSize
      );
      const pageToLoad =
          areasState.pagination.currentPage > newTotalPages
              ? newTotalPages
              : areasState.pagination.currentPage;

      await loadPaginatedData(pageToLoad > 0 ? pageToLoad : 1);
      setShowNoResults(false);
      setIsDeleteModalOpen(false);
      setSelectedArea(undefined);
      setDataVersion((prev) => prev + 1);
      showSuccess("Área eliminada correctamente");
    } catch {
      showError("Error al eliminar el área");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: Area) => {
    try {
      setIsLoading(true);

      if (data.id) {
        await updateArea(data.id, {
          nombreArea: data.nombreArea,
        });
        await loadPaginatedData(areasState.pagination.currentPage);
        setUpdateSuccessConfig({
          isOpen: true,
          message: "Área actualizada correctamente",
        });
      } else {
        await createArea(data);
        const totalItems = areasState.pagination.totalItems + 1;
        const newPage = Math.ceil(totalItems / areasState.pagination.pageSize);
        await loadPaginatedData(newPage);
        showSuccess("Área creada correctamente");
      }
      setIsModalOpen(false);
      setSelectedArea(undefined);
      setDataVersion((prev) => prev + 1);
    } catch {
      showError(`Error al ${data.id ? "actualizar" : "crear"} el área`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
        <AreaHeader onAddClick={() => setIsModalOpen(true)} />

        <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
          <AreaSearch
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
                    message="Cargando áreas..."
                    color="#145A32"
                />
              </div>
          ) : (
              <AreaTable
                  areas={areasState.data}
                  dataVersion={dataVersion}
                  currentPage={areasState.pagination.currentPage}
                  searchTerm={searchTerm}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
              />
          )}

          {!isSearchMode && (
              <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
                <Pagination
                    currentPage={areasState.pagination.currentPage}
                    totalPages={areasState.pagination.totalPages}
                    onPageChange={handlePageChange}
                />
              </div>
          )}
        </div>

        {isModalOpen && (
            <AreaModal
                isOpen={isModalOpen}
                area={selectedArea}
                onClose={() => {
                  setSelectedArea(undefined);
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
                itemName={selectedArea?.nombreArea || ""}
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
