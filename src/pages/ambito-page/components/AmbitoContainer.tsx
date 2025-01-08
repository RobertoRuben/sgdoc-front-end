import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { Ambito } from "@/model/ambito";
import { AmbitoPaginatedResponse } from "@/model/ambitoPaginatedResponse";
import { AmbitoHeader } from "./AmbitoHeader";
import { AmbitoSearch } from "./AmbitoSearch";
import { AmbitoTable } from "./AmbitoTable";
import { AmbitoModal } from "@/components/modal/ambito-modal/AmbitoModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import { Pagination } from "@/components/ui/pagination";
import {
  getPaginatedAmbitos,
  createAmbito,
  updateAmbito,
  findByString,
  deleteAmbito,
  getAmbitoById,
} from "@/service/ambitoService";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

export const AmbitoContainer: React.FC = () => {
  const [ambitosState, setAmbitosState] = useState<AmbitoPaginatedResponse>({
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
  const [selectedAmbito, setSelectedAmbito] = useState<Ambito | undefined>();
  const [dataVersion, setDataVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
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
      const response = await getPaginatedAmbitos(
        page,
        ambitosState.pagination.pageSize
      );
      setAmbitosState(response);
    } catch (error) {
      showError("Error al cargar los ámbitos");
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
          setAmbitosState((prev) => ({
            data: searchResults,
            pagination: {
              ...prev.pagination,
              currentPage: 1,
              totalItems: searchResults.length,
              totalPages: 1,
            },
          }));
          setIsSearchMode(true);
        } else {
          setIsSearchMode(false);
          loadPaginatedData(1);
        }
      } catch (error) {
        showError("Error al buscar los ámbitos");
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
    if (isSearchMode || page < 1 || page > ambitosState.pagination.totalPages)
      return;
    loadPaginatedData(page);
  };

  const handleEdit = async (id?: number) => {
    try {
      if (id !== undefined) {
        const data = await getAmbitoById(id);
        if (data) {
          setSelectedAmbito(data);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      showError("Error al cargar los datos del ámbito");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id !== undefined) {
      const ambito = ambitosState.data.find((a) => a.id === id);
      if (ambito) {
        setSelectedAmbito(ambito);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedAmbito?.id) {
        setIsLoading(true);
        await deleteAmbito(selectedAmbito.id);

        const newTotalItems = ambitosState.pagination.totalItems - 1;
        const newTotalPages = Math.ceil(
          newTotalItems / ambitosState.pagination.pageSize
        );


        const pageToLoad = ambitosState.pagination.currentPage > newTotalPages
            ? newTotalPages
            : ambitosState.pagination.currentPage;

        await loadPaginatedData(pageToLoad);
        setIsDeleteModalOpen(false);
        setSelectedAmbito(undefined);
        setDataVersion((prev) => prev + 1);
        showSuccess("Ámbito eliminado correctamente");
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Error al eliminar el ámbito");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: Ambito) => {
    try {
      setIsLoading(true);
      await loadPaginatedData(1);
      setIsModalOpen(false);
      setSelectedAmbito(undefined);
      setDataVersion((prev) => prev + 1);

      if (data.id) {
        await updateAmbito(data.id, {
          nombreAmbito: data.nombreAmbito,
        });
        setUpdateSuccessConfig({
          isOpen: true,
          message: "Ámbito actualizado correctamente",
        });
      } else {
        await createAmbito({
          nombreAmbito: data.nombreAmbito,
        });
        showSuccess("Ámbito creado correctamente");
        const totalItems = ambitosState.pagination.totalItems + 1;
        const newPage = Math.ceil(
          totalItems / ambitosState.pagination.pageSize
        );

        await loadPaginatedData(newPage);
      }

      setIsModalOpen(false);
      setSelectedAmbito(undefined);
      setDataVersion((prev) => prev + 1);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError(`Error al ${data.id ? "actualizar" : "crear"} el ámbito`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
      <AmbitoHeader onAddClick={() => setIsModalOpen(true)} />

      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <AmbitoSearch searchTerm={searchTerm} onSearch={handleSearch} />

        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <LoadingSpinner
              size="lg"
              message="Cargando ámbitos..."
              color="#145A32"
              backgroundColor="rgba(20, 90, 50, 0.2)"
            />
          </div>
        ) : (
          <AmbitoTable
            ambitos={ambitosState.data}
            dataVersion={dataVersion}
            currentPage={ambitosState.pagination.currentPage}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {!isSearchMode && (
          <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
            <Pagination
              currentPage={ambitosState.pagination.currentPage}
              totalPages={ambitosState.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <AmbitoModal
          isOpen={isModalOpen}
          ambito={selectedAmbito}
          onClose={() => {
            setSelectedAmbito(undefined);
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
          itemName={selectedAmbito?.nombreAmbito || ""}
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
    </div>
  );
};
