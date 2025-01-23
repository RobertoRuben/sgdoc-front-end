import {useState, useEffect, useCallback} from "react";
import debounce from "lodash/debounce";
import {PaginatedUsuarioResponse} from "@/model/paginatedUsuarioResponse";
import {UsuarioDetails} from "@/model/usuarioDetails";
import {Usuario} from "@/model/usuario";
import {UsuarioHeader} from "@/pages/usuarios-page/components/UsuarioHeader";
import {UsuarioSearch} from "@/pages/usuarios-page/components/UsuarioSearch";
import {UsuarioTable} from "@/pages/usuarios-page/components/UsuarioTable";
import {RegistroUsuarioModal} from "@/components/modal/usuario-modal/usuario-form-modal/UsuarioModal";
import ActivateModal from "@/components/modal/alerts/activate-modal/ActivateModal";
import DeactivateModal from "@/components/modal/alerts/deactivate-modal/DeactivateModal";
import NoResultsModal from "@/components/modal/alerts/no-results-modal/NoResultsModal";
import ErrorModal from "@/components/modal/alerts/error-modal/ErrorModal";
import SuccessModal from "@/components/modal/alerts/success-modal/SuccessModal";
import UpdateSuccessModal from "@/components/modal/alerts/update-modal/UpdateSuccessModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import {Pagination} from "@/components/ui/pagination";

import {
    getUsuariosPaginated,
    createUsuario,
    updateUsuario,
    getUsuarioById,
    findByString,
    updateUsuarioStatus,
} from "@/service/usuarioService";

export const UsuarioContainer: React.FC = () => {
    // Estado principal para la paginación y los datos del usuario
    const [usuariosState, setUsuariosState] = useState<PaginatedUsuarioResponse>({
        data: [],
        pagination: {
            currentPage: 1,
            pageSize: 5,
            totalItems: 0,
            totalPages: 0,
        },
    });

    const [isActive, setIsActive] = useState<boolean>(true);
    const [isActivateModalOpen, setIsActivateModalOpen] =
        useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] =
        useState<boolean>(false);
    const [selectedUsuario, setSelectedUsuario] = useState<
        UsuarioDetails | undefined
    >(undefined);

    const [dataVersion, setDataVersion] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
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
        setErrorModalConfig({isOpen: true, message});
    };

    const showSuccess = (message: string) => {
        setSuccessModalConfig({isOpen: true, message});
    };

    const handleStatusFilterChange = (value: string) => {
        const isActiveValue = value === "true";
        setIsActive(isActiveValue);
    };

    const loadPaginatedData = async (page: number) => {
        try {
            setIsLoading(true);
            const response = await getUsuariosPaginated(
                page,
                usuariosState.pagination.pageSize,
                isActive
            );

            const formattedData = response.data.map((usuario) => ({
                ...usuario,
                fechaCreacion: new Date(usuario.fechaCreacion).toLocaleDateString(),
                fechaActualizacion: usuario.fechaActualizacion
                    ? new Date(usuario.fechaActualizacion).toLocaleDateString()
                    : undefined,
            }));

            setUsuariosState({
                ...response,
                data: formattedData,
            });
        } catch {
            showError("Error al cargar la lista de usuarios");
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

                    const formattedResults = searchResults.map((usuario) => ({
                        ...usuario,
                        fechaCreacion: new Date(usuario.fechaCreacion).toLocaleDateString(),
                        fechaActualizacion: usuario.fechaActualizacion
                            ? new Date(usuario.fechaActualizacion).toLocaleDateString()
                            : undefined,
                    }));

                    if (formattedResults.length === 0) {
                        setNoResultsMessage(
                            "No se encontraron resultados para la búsqueda"
                        );
                        setShowNoResults(true);
                        setUsuariosState((prev) => ({
                            ...prev,
                            data: [],
                            pagination: {
                                ...prev.pagination,
                                totalItems: 0,
                                totalPages: 0,
                            },
                        }));
                    } else {
                        setUsuariosState((prev) => ({
                            ...prev,
                            data: formattedResults,
                            pagination: {
                                currentPage: 1,
                                pageSize: prev.pagination.pageSize,
                                totalItems: formattedResults.length,
                                totalPages: 1,
                            },
                        }));
                    }
                } else {
                    setShowNoResults(false);
                    await loadPaginatedData(1);
                }
            } catch (error) {
                if (error instanceof Error && error.name === "NotFoundError") {
                    setNoResultsMessage(error.message);
                    setShowNoResults(true);
                    setUsuariosState((prev) => ({
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
        [isActive]
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        loadPaginatedData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > usuariosState.pagination.totalPages) return;
        loadPaginatedData(page);
    };

    const handleEdit = async (id?: number) => {
        try {
            if (id !== undefined) {
                const data = await getUsuarioById(id);
                if (data) {
                    setSelectedUsuario(data);
                    setIsModalOpen(true);
                }
            }
        } catch {
            showError("Error al cargar los datos del usuario");
        }
    };

    const handleDeactivateClick = (id?: number) => {
        if (id !== undefined) {
            const usuario = usuariosState.data.find((u) => u.id === id);
            if (usuario) {
                setSelectedUsuario(usuario);
                setIsDeactivateModalOpen(true);
            }
        }
    };

    const handleDeactivateConfirm = async () => {
        if (!selectedUsuario?.id) return;
        try {
            setIsLoading(true);
            await updateUsuarioStatus(selectedUsuario.id, false);

            await loadPaginatedData(usuariosState.pagination.currentPage);
            setShowNoResults(false);
            setIsDeactivateModalOpen(false);
            setSelectedUsuario(undefined);
            setDataVersion((prev) => prev + 1);
            showSuccess("Usuario desactivado correctamente");
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Error al desactivar el usuario");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivateClick = (id?: number) => {
        if (id !== undefined) {
            const usuario = usuariosState.data.find((u) => u.id === id);
            if (usuario) {
                setSelectedUsuario(usuario);
                setIsActivateModalOpen(true);
            }
        }
    };

    const handleActivateConfirm = async () => {
        if (!selectedUsuario?.id) return;
        try {
            setIsLoading(true);
            await updateUsuarioStatus(selectedUsuario.id, true);

            await loadPaginatedData(usuariosState.pagination.currentPage);
            setShowNoResults(false);
            setIsActivateModalOpen(false);
            setSelectedUsuario(undefined);
            setDataVersion((prev) => prev + 1);
            showSuccess("Usuario activado correctamente");
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Error al activar el usuario");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalSubmit = async (data: Usuario) => {
        try {
            setIsLoading(true);

            if (data.id) {
                await updateUsuario(data.id, data);
                await loadPaginatedData(usuariosState.pagination.currentPage);
                setUpdateSuccessConfig({
                    isOpen: true,
                    message: "Usuario actualizado correctamente",
                });
            } else {
                await createUsuario(data);
                const totalItems = usuariosState.pagination.totalItems + 1;
                const newPage = Math.ceil(
                    totalItems / usuariosState.pagination.pageSize
                );
                await loadPaginatedData(newPage);
                showSuccess("Usuario creado correctamente");
            }

            setIsModalOpen(false);
            setSelectedUsuario(undefined);
            setDataVersion((prev) => prev + 1);
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError(`Error al ${data.id ? "actualizar" : "crear"} el usuario`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-0.5 pr-0.5 pb-1 pl-0.5 sm:pt-2 sm:pr-2 sm:pb-4 sm:pl-2 bg-transparent">
            <UsuarioHeader onAddClick={() => setIsModalOpen(true)}/>

            <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                <UsuarioSearch
                    searchTerm={searchTerm}
                    statusFilter={isActive.toString()}
                    onStatusFilterChange={handleStatusFilterChange}
                    onSearch={handleSearch}
                    onClear={() => {
                        setSearchTerm("");
                        debouncedSearch.cancel();
                        loadPaginatedData(1);
                    }}
                />

                {isLoading ? (
                    <div className="w-full h-[300px] flex items-center justify-center">
                        <LoadingSpinner
                            size="lg"
                            message="Cargando usuarios..."
                            color="#145A32"
                        />
                    </div>
                ) : (
                    <UsuarioTable
                        usuarios={usuariosState.data}
                        dataVersion={dataVersion}
                        currentPage={usuariosState.pagination.currentPage}
                        searchTerm={searchTerm}
                        onEdit={handleEdit}
                        onDeactivate={handleDeactivateClick}
                        onActivate={handleActivateClick}
                        statusFilter={isActive.toString()}
                    />
                )}

                {usuariosState.pagination.totalPages > 0 && (
                    <div className="py-4 px-4 sm:px-6 border-t border-gray-200">
                        <Pagination
                            currentPage={usuariosState.pagination.currentPage}
                            totalPages={usuariosState.pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <RegistroUsuarioModal
                    isOpen={isModalOpen}
                    usuario={selectedUsuario}
                    onClose={() => {
                        setSelectedUsuario(undefined);
                        setIsModalOpen(false);
                    }}
                    onSubmit={handleModalSubmit}
                />
            )}

            {isDeactivateModalOpen && (
                <DeactivateModal
                    isOpen={isDeactivateModalOpen}
                    onClose={() => setIsDeactivateModalOpen(false)}
                    onConfirm={handleDeactivateConfirm}
                    userName={selectedUsuario?.nombreUsuario || ""}
                />
            )}

            <SuccessModal
                isOpen={successModalConfig.isOpen}
                onClose={() =>
                    setSuccessModalConfig((prev) => ({...prev, isOpen: false}))
                }
                title="Operación Exitosa"
                message={successModalConfig.message}
            />

            <ErrorModal
                isOpen={errorModalConfig.isOpen}
                onClose={() =>
                    setErrorModalConfig((prev) => ({...prev, isOpen: false}))
                }
                title="Error"
                errorMessage={errorModalConfig.message}
            />

            <UpdateSuccessModal
                isOpen={updateSuccessConfig.isOpen}
                onClose={() =>
                    setUpdateSuccessConfig((prev) => ({...prev, isOpen: false}))
                }
                title="Actualización Exitosa"
                message={updateSuccessConfig.message}
            />

            <ActivateModal
                isOpen={isActivateModalOpen}
                onClose={() => setIsActivateModalOpen(false)}
                onConfirm={handleActivateConfirm}
                userName={selectedUsuario?.nombreUsuario || ""}
            />

            <NoResultsModal
                isOpen={showNoResults}
                onClose={() => setShowNoResults(false)}
                message={noResultsMessage}
            />
        </div>
    );
};
