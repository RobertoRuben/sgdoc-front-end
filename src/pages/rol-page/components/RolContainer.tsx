import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { Rol } from "@/model/rol";
import { RolPaginatedResponse } from "@/model/rolPaginatedResponse";
import { RolHeader } from "./RolHeader";
import { RolSearch } from "./RolSearch";
import { RolTable } from "./RolTable";
import { RolModal } from "@/components/modal/rol-modal/RolModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { Pagination } from "@/components/ui/pagination";
import {
    getRolesPaginated,
    createRol,
    updateRol,
    deleteRol,
    getRolById,
    findByString,
} from "@/service/rolService";

export const RolContainer: React.FC = () => {
    const [rolState, setRolState] = useState<RolPaginatedResponse>({
        data: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
        },
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedRol, setSelectedRol] = useState<Rol | undefined>();
    const [dataVersion, setDataVersion] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
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
            const response = await getRolesPaginated(page, rolState.pagination.pageSize);
            setRolState(response);
        } catch {
            showError("Error al cargar la lista de roles");
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
                        setRolState((prev) => ({
                            ...prev,
                            data: [],
                            pagination: {
                                ...prev.pagination,
                                totalItems: 0,
                                totalPages: 0,
                            },
                        }));
                    } else {
                        setRolState((prev) => ({
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
                    setRolState((prev) => ({
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

    // Cambio de página
    const handlePageChange = (page: number) => {
        if (isSearchMode) return;
        if (page < 1 || page > rolState.pagination.totalPages) return;
        loadPaginatedData(page);
    };

    const handleEdit = async (id?: number) => {
        try {
            if (id !== undefined) {
                const data = await getRolById(id);
                if (data) {
                    setSelectedRol(data);
                    setIsModalOpen(true);
                }
            }
        } catch{
            showError("Error al cargar los datos del rol");
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const rol = rolState.data.find((r) => r.id === id);
            if (rol) {
                setSelectedRol(rol);
                setIsDeleteModalOpen(true);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRol?.id) return;
        try {
            setIsLoading(true);
            await deleteRol(selectedRol.id);

            const newTotalItems = rolState.pagination.totalItems - 1;
            const newTotalPages = Math.ceil(
                newTotalItems / rolState.pagination.pageSize
            );
            const pageToLoad =
                rolState.pagination.currentPage > newTotalPages
                    ? newTotalPages
                    : rolState.pagination.currentPage;

            await loadPaginatedData(pageToLoad > 0 ? pageToLoad : 1);
            setShowNoResults(false);
            setIsDeleteModalOpen(false);
            setSelectedRol(undefined);
            setDataVersion((prev) => prev + 1);
            showSuccess("Rol eliminado correctamente");
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Error al eliminar el rol");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalSubmit = async (data: Rol) => {
        try {
            setIsLoading(true);

            if (data.id) {
                await updateRol(data.id, {
                    nombreRol: data.nombreRol,
                });
                await loadPaginatedData(rolState.pagination.currentPage);
                setUpdateSuccessConfig({
                    isOpen: true,
                    message: "Rol actualizado correctamente",
                });
            } else {
                await createRol(data);
                const totalItems = rolState.pagination.totalItems + 1;
                const newPage = Math.ceil(totalItems / rolState.pagination.pageSize);
                await loadPaginatedData(newPage);
                showSuccess("Rol creado correctamente");
            }
            setIsModalOpen(false);
            setSelectedRol(undefined);
            setDataVersion((prev) => prev + 1);
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError(`Error al ${data.id ? "actualizar" : "crear"} el rol`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <RolHeader onAddClick={() => setIsModalOpen(true)} />

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <RolSearch
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
                            message="Cargando roles..."
                            color="#145A32"
                        />
                    </div>
                ) : (
                    <RolTable
                        roles={rolState.data}
                        dataVersion={dataVersion}
                        currentPage={rolState.pagination.currentPage}
                        searchTerm={searchTerm}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}

                {!isSearchMode && (
                    <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
                        <Pagination
                            currentPage={rolState.pagination.currentPage}
                            totalPages={rolState.pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <RolModal
                    isOpen={isModalOpen}
                    rol={selectedRol}
                    onClose={() => {
                        setSelectedRol(undefined);
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
                    itemName={selectedRol?.nombreRol || ""}
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
