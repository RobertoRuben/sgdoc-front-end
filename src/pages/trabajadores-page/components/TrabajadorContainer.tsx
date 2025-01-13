import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { TrabajadorPaginatedResponse } from "@/model/trabajadorPaginatedResponse";
import { TrabajadorDetails } from "@/model/trabajadorDetails";
import { Trabajador } from "@/model/trabajador";
import { TrabajadorHeader } from "./TrabajadorHeader";
import { TrabajadorSearch } from "./TrabajadorSearch";
import { TrabajadorTable } from "./TrabajadorTable";
import { TrabajadorModal } from "@/components/modal/trabajador-modal/TrabajadorModal";
import DeleteModal from "@/components/modal/alerts/delete-modal/DeleteModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { Pagination } from "@/components/ui/pagination";
import {
    getTrabajadoresPaginated,
    createTrabajador,
    updateTrabajador,
    deleteTrabajador,
    getTrabajadorById,
    findByString,
} from "@/service/trabajadorService";
export const TrabajadorContainer: React.FC = () => {
    const [trabajadoresState, setTrabajadoresState] =
        useState<TrabajadorPaginatedResponse>({
            data: [],
            pagination: {
                currentPage: 1,
                pageSize: 5,
                totalItems: 0,
                totalPages: 0,
            },
        });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedTrabajador, setSelectedTrabajador] = useState<
        TrabajadorDetails | undefined
    >();

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
            const response = await getTrabajadoresPaginated(
                page,
                trabajadoresState.pagination.pageSize
            );
            setTrabajadoresState(response);
        } catch  {
            showError("Error al cargar la lista de trabajadores");
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
                        setTrabajadoresState((prev) => ({
                            ...prev,
                            data: [],
                            pagination: {
                                ...prev.pagination,
                                totalItems: 0,
                                totalPages: 0,
                            },
                        }));
                    } else {
                        setTrabajadoresState((prev) => ({
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
                    setTrabajadoresState((prev) => ({
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
        if (page < 1 || page > trabajadoresState.pagination.totalPages) return;
        loadPaginatedData(page);
    };

    const handleEdit = async (id?: number) => {
        try {
            if (id !== undefined) {
                const data = await getTrabajadorById(id);
                if (data) {
                    setSelectedTrabajador(data);
                    setIsModalOpen(true);
                }
            }
        } catch {
            showError("Error al cargar los datos del caserío");
        }
    };

    const handleDeleteClick = (id?: number) => {
        if (id !== undefined) {
            const trabajador = trabajadoresState.data.find((t) => t.id === id);
            if (trabajador) {
                setSelectedTrabajador(trabajador);
                setIsDeleteModalOpen(true);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTrabajador?.id) return;
        try {
            setIsLoading(true);
            await deleteTrabajador(selectedTrabajador.id);

            const newTotalItems = trabajadoresState.pagination.totalItems - 1;
            const newTotalPages = Math.ceil(
                newTotalItems / trabajadoresState.pagination.pageSize
            );
            const pageToLoad =
                trabajadoresState.pagination.currentPage > newTotalPages
                    ? newTotalPages
                    : trabajadoresState.pagination.currentPage;

            await loadPaginatedData(pageToLoad > 0 ? pageToLoad : 1);
            setShowNoResults(false);
            setIsDeleteModalOpen(false);
            setSelectedTrabajador(undefined);
            setDataVersion((prev) => prev + 1);
            showSuccess("Trabajador eliminado correctamente");
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Error al eliminar el trabajador");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalSubmit = async (data: Trabajador) => {
        try {
            setIsLoading(true);

            if (data.id) {
                await updateTrabajador(data.id, {
                    dni: data.dni,
                    nombres: data.nombres,
                    apellidoPaterno: data.apellidoPaterno,
                    apellidoMaterno: data.apellidoMaterno,
                    genero: data.genero,
                    areaId: data.areaId,
                });
                await loadPaginatedData(trabajadoresState.pagination.currentPage);
                setUpdateSuccessConfig({
                    isOpen: true,
                    message: "Trabajador actualizado correctamente",
                });
            } else {
                await createTrabajador(data);
                const totalItems = trabajadoresState.pagination.totalItems + 1;
                const newPage = Math.ceil(
                    totalItems / trabajadoresState.pagination.pageSize
                );
                await loadPaginatedData(newPage);
                showSuccess("Trabajador creado correctamente");
            }
            setIsModalOpen(false);
            setSelectedTrabajador(undefined);
            setDataVersion((prev) => prev + 1);
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError(
                    `Error al ${data.id ? "actualizar" : "crear"} el trabajador`
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <TrabajadorHeader onAddClick={() => setIsModalOpen(true)} />

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <TrabajadorSearch
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
                            message="Cargando trabajadores..."
                            color="#145A32"
                        />
                    </div>
                ) : (
                    <TrabajadorTable
                        trabajadores={trabajadoresState.data}
                        dataVersion={dataVersion}
                        currentPage={trabajadoresState.pagination.currentPage}
                        searchTerm={searchTerm}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}

                {!isSearchMode && (
                    <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
                        <Pagination
                            currentPage={trabajadoresState.pagination.currentPage}
                            totalPages={trabajadoresState.pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <TrabajadorModal
                    isOpen={isModalOpen}
                    trabajador={selectedTrabajador}
                    onClose={() => {
                        setSelectedTrabajador(undefined);
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
                    itemName={`${selectedTrabajador?.nombres || ""} ${
                        selectedTrabajador?.apellidoPaterno || ""
                    } ${selectedTrabajador?.apellidoMaterno || ""}`}
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
