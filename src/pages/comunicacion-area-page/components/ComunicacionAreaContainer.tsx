import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { ComunicacionArea } from "@/model/comunicacionArea";
import { ComunicacionAreaPaginatedResponse } from "@/model/comunicacionAreaPaginatedResponse";

// Components
import { ComunicacionAreaHeader } from "./ComunicacionAreaHeader";
import { ComunicacionAreaSearch } from "./ComunicacionAreaSearch";
import { ComunicacionAreaTable } from "./ComunicacionAreaTable";
import { ComunicacionAreaModal } from "@/components/modal/comunicacion-areas-modal/ComunicacionAreaModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import { Pagination } from "@/components/ui/pagination";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

// Service (you'll need to implement these similarly to your categoriaDocumentoService)
import {
  getComunicacionesArea,
  // The following are placeholders if you plan to implement create/edit/delete
  createComunicacionArea,
  updateComunicacionArea,
  deleteComunicacionArea,
  getComunicacionAreaById,
  findComunicacionAreaByString,
} from "@/service/comunicacionAreaService";

export const ComunicacionAreaContainer: React.FC = () => {
  const [comunicacionesArea, setComunicacionesArea] =
    useState<ComunicacionAreaPaginatedResponse>({
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
      },
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComunicacionArea | undefined>();
  const [dataVersion, setDataVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // No results modal
  const [showNoResults, setShowNoResults] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState("");

  // Error modal
  const [errorModalConfig, setErrorModalConfig] = useState<{
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

  // Success modal
  const [successModalConfig, setSuccessModalConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const showSuccess = (message: string) => {
    setSuccessModalConfig({
      isOpen: true,
      message,
    });
  };

  // Update success modal
  const [updateSuccessConfig, setUpdateSuccessConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  // ------------------------------------
  // 1. Load paginated data
  // ------------------------------------
  const loadPaginatedData = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getComunicacionesArea(
        page,
        comunicacionesArea.pagination.pageSize
      );
      setComunicacionesArea(response);
    } catch (error) {
      showError("Error al cargar las áreas de comunicación");
      console.log(error);
      // evita que data sea undefined
      setComunicacionesArea((prev) => ({
        ...prev,
        data: [],
      }));
    } finally {
      setIsLoading(false);
    }
  };
  

  // ------------------------------------
  // 2. Debounced search
  // ------------------------------------
  const debouncedSearch = useCallback(
    debounce(async (searchValue: string) => {
      try {
        setIsLoading(true);
        if (searchValue.trim()) {
          const searchResults = await findComunicacionAreaByString(searchValue);
          if (searchResults.length === 0) {
            setNoResultsMessage("No se encontraron resultados para la búsqueda");
            setShowNoResults(true);
            setComunicacionesArea((prev) => ({
              ...prev,
              data: [],
            }));
          } else {
            setComunicacionesArea((prev) => ({
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
          setComunicacionesArea((prev) => ({
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

  // ------------------------------------
  // 3. Handle search field changes
  // ------------------------------------
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

  // ------------------------------------
  // 4. On mount, load first page
  // ------------------------------------
  useEffect(() => {
    loadPaginatedData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------
  // 5. Pagination
  // ------------------------------------
  const handlePageChange = (page: number) => {
    if (
      isSearchMode ||
      page < 1 ||
      page > comunicacionesArea.pagination.totalPages
    ) {
      return;
    }
    loadPaginatedData(page);
  };

  // ------------------------------------
  // 6. Edit item
  // ------------------------------------
  const handleEdit = async (id?: number) => {
    try {
      if (id !== undefined) {
        setIsLoading(false);
        const data = await getComunicacionAreaById(id);
        if (data) {
          setSelectedItem(data);
          setIsModalOpen(true);
        }
      }
      setIsLoading(true);
    } catch (error) {
      showError("Error al cargar los datos del área de comunicación");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------
  // 7. Delete item
  // ------------------------------------
  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const item = comunicacionesArea.data.find((c) => c.id === id);
      if (item) {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem?.id) {
        setIsLoading(true);
        await deleteComunicacionArea(selectedItem.id);

        // Decrement pagination item count
        const newTotalItems = comunicacionesArea.pagination.totalItems - 1;
        const newTotalPages = Math.ceil(
          newTotalItems / comunicacionesArea.pagination.pageSize
        );

        const pageToLoad =
          comunicacionesArea.pagination.currentPage > newTotalPages
            ? newTotalPages
            : comunicacionesArea.pagination.currentPage;

        await loadPaginatedData(pageToLoad);
        setIsDeleteModalOpen(false);
        setSelectedItem(undefined);
        setDataVersion((prev) => prev + 1);
        showSuccess("Área de comunicación eliminada correctamente");
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Error al eliminar el área de comunicación");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------
  // 8. Create or Update (Modal Submit)
  // ------------------------------------
  const handleModalSubmit = async (data: ComunicacionArea) => {
    try {
      setIsLoading(true);

      if (data.id) {
        // Update
        await updateComunicacionArea(data.id, {
          areaOrigenId: data.areaOrigenId,
          areaDestinoId: data.areaDestinoId,
          nombreAreaDestino: data.nombreAreaDestino,
          nombreAreaOrigen: data.nombreAreaOrigen,
        });
        await loadPaginatedData(comunicacionesArea.pagination.currentPage);
        setUpdateSuccessConfig({
          isOpen: true,
          message: "Área de comunicación actualizada correctamente",
        });
      } else {
        // Create
        await createComunicacionArea({
          areaOrigenId: data.areaOrigenId,
          areaDestinoId: data.areaDestinoId,
          nombreAreaDestino: data.nombreAreaDestino,
          nombreAreaOrigen: data.nombreAreaOrigen,
        });
        const totalItems = comunicacionesArea.pagination.totalItems + 1;
        const newPage = Math.ceil(
          totalItems / comunicacionesArea.pagination.pageSize
        );
        await loadPaginatedData(newPage);
        showSuccess("Área de comunicación creada correctamente");
      }

      setIsModalOpen(false);
      setSelectedItem(undefined);
      setDataVersion((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError(
          `Error al ${data.id ? "actualizar" : "crear"} el área de comunicación`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      {/* Header */}
      <ComunicacionAreaHeader onAddClick={() => setIsModalOpen(true)} />

      {/* Search & Table Container */}
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <ComunicacionAreaSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onClear={() => {
            setSearchTerm("");
            setIsSearchMode(false);
            loadPaginatedData(1);
          }}
        />

        {/* Loading Spinner or Table */}
        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <LoadingSpinner
              size="lg"
              message="Cargando áreas de comunicación..."
              color="#145A32"
              backgroundColor="rgba(20, 90, 50, 0.2)"
            />
          </div>
        ) : (
          <ComunicacionAreaTable
            items={comunicacionesArea.data ?? []}
            dataVersion={dataVersion}
            currentPage={comunicacionesArea.pagination.currentPage}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Pagination (hidden if in search mode) */}
        {!isSearchMode && (
          <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
            <Pagination
              currentPage={comunicacionesArea.pagination.currentPage}
              totalPages={comunicacionesArea.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <ComunicacionAreaModal
          isOpen={isModalOpen}
          comunicacionArea={selectedItem}
          onClose={() => {
            setSelectedItem(undefined);
            setIsModalOpen(false);
          }}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          // Show either something like the areaOrigenNombre or a fallback
          itemName={
            selectedItem?.nombreAreaDestino ?? "el área de comunicación seleccionada"
          }
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalConfig.isOpen}
        onClose={() =>
          setSuccessModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Operación Exitosa"
        message={successModalConfig.message}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModalConfig.isOpen}
        onClose={() =>
          setErrorModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Error"
        errorMessage={errorModalConfig.message}
      />

      {/* Update Success Modal */}
      <UpdateSuccessModal
        isOpen={updateSuccessConfig.isOpen}
        onClose={() =>
          setUpdateSuccessConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title="Actualización Exitosa"
        message={updateSuccessConfig.message}
      />

      {/* No Results Modal */}
      <NoResultsModal
        isOpen={showNoResults}
        onClose={() => setShowNoResults(false)}
        message={noResultsMessage}
      />
    </div>
  );
};
