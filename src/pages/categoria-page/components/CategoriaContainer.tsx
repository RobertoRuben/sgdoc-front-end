import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { Categoria } from "@/model/categoria";
import { CategoriaPaginatedResponse } from "@/model/categoriaPaginatedResponse";
import { CategoriaHeader } from "./CategoriaHeader";
import { CategoriaSearch } from "./CategoriaSearch";
import { CategoriaTable } from "./CategoriaTable";
import { CategoriaModal } from "@/components/modal/categoria-modal/CategoriaModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import { Pagination } from "@/components/ui/pagination";
import {
  getCategoriasPaginated,
  createCategoria,
  updateCategoria,
  findByString,
  deleteCategoria,
  getCategoriaById,
} from "@/service/categoriaService";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

export const CategoriaContainer: React.FC = () => {
  const [categoriasState, setCategoriasState] =
    useState<CategoriaPaginatedResponse>({
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
  const [selectedCategoria, setSelectedCategoria] = useState<
    Categoria | undefined
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
  const showError = (message: string) => {
    setErrorModalConfig({
      isOpen: true,
      message,
    });
  };
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

  const showSuccess = (message: string) => {
    setSuccessModalConfig({
      isOpen: true,
      message,
    });
  };

  const loadPaginatedData = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getCategoriasPaginated(
        page,
        categoriasState.pagination.pageSize
      );
      setCategoriasState(response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showError("Error al cargar las categorías");
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
            setCategoriasState((prev) => ({
              ...prev,
              data: [],
            }));
          } else {
            setCategoriasState((prev) => ({
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
          setCategoriasState((prev) => ({
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
      page > categoriasState.pagination.totalPages
    )
      return;
    loadPaginatedData(page);
  };

  const handleEdit = async (id?: number) => {
    try {
      if (id !== undefined) {
        const data = await getCategoriaById(id);
        if (data) {
          setSelectedCategoria(data);
          setIsModalOpen(true);
        }
      }

    } catch (error) {
      showError("Error al cargar los datos de la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const categoria = categoriasState.data.find((c) => c.id === id);
      if (categoria) {
        setSelectedCategoria(categoria);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedCategoria?.id) {
        setIsLoading(true);
        await deleteCategoria(selectedCategoria.id);

        const newTotalItems = categoriasState.pagination.totalItems - 1;
        const newTotalPages = Math.ceil(
          newTotalItems / categoriasState.pagination.pageSize
        );

        const pageToLoad =
          categoriasState.pagination.currentPage > newTotalPages
            ? newTotalPages
            : categoriasState.pagination.currentPage;

        await loadPaginatedData(pageToLoad);
        setIsDeleteModalOpen(false);
        setSelectedCategoria(undefined);
        setDataVersion((prev) => prev + 1);
        showSuccess("Categoría eliminada correctamente");
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Error al eliminar la categoría");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: Categoria) => {
    try {
      setIsLoading(true);

      if (data.id) {
        await updateCategoria(data.id, {
          nombreCategoria: data.nombreCategoria,
        });
        await loadPaginatedData(categoriasState.pagination.currentPage);
        setUpdateSuccessConfig({
          isOpen: true,
          message: "Categoría actualizada correctamente",
        });
      } else {
        await createCategoria({
          nombreCategoria: data.nombreCategoria,
        });
        const totalItems = categoriasState.pagination.totalItems + 1;
        const newPage = Math.ceil(
          totalItems / categoriasState.pagination.pageSize
        );
        await loadPaginatedData(newPage);
        showSuccess("Categoría creada correctamente");
      }
      setIsModalOpen(false);
      setSelectedCategoria(undefined);
      setDataVersion((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError(`Error al ${data.id ? "actualizar" : "crear"} la categoría`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <CategoriaHeader onAddClick={() => setIsModalOpen(true)} />

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <CategoriaSearch
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
              message="Cargando categorías..."
              color="#145A32"
              backgroundColor="rgba(20, 90, 50, 0.2)"
            />
          </div>
        ) : (
          <CategoriaTable
            categorias={categoriasState.data}
            dataVersion={dataVersion}
            currentPage={categoriasState.pagination.currentPage}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {!isSearchMode && (
          <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
            <Pagination
              currentPage={categoriasState.pagination.currentPage}
              totalPages={categoriasState.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <CategoriaModal
          isOpen={isModalOpen}
          categoria={selectedCategoria}
          onClose={() => {
            setSelectedCategoria(undefined);
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
          itemName={selectedCategoria?.nombreCategoria || ""}
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
