import {AxiosError} from "axios";
import humps from "humps";
import {Rol} from "@/model/rol";
import {RolPaginatedResponse} from "@/model/rolPaginatedResponse.ts";
import axiosInstance from "@/service/axiosConfig";
import {Usuario} from "@/model/usuario";
import {UsuarioPaginatedResponse} from "@/model/usuarioPaginatedResponse";

const API_BASE_URL_ROLES = `/roles/`;
const API_BASE_URL_USUARIOS = `/usuarios/`;

export const getRoles = async (): Promise<Rol[]> => {
    try {
        const response = await axiosInstance.get(API_BASE_URL_ROLES);
        return humps.camelizeKeys(response.data) as Rol[];
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const rawMsg = error.response.data.error || 
                          error.response.data.detail || 
                          error.response.data.details;
            let message = rawMsg;
            const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
            if (match) {
                message = match[1];
            }
            throw new Error(message);
        }
        throw new Error("Error al obtener los roles");
    }
}

export const createRol = async (rol: Rol): Promise<Rol> => {
    try {
        const payload = humps.decamelizeKeys(rol);
        const response = await axiosInstance.post(API_BASE_URL_ROLES, payload);
        return humps.camelizeKeys(response.data) as Rol;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response?.data?.error || 
                                   error.response?.data?.detail || 
                                   "El rol ya existe";
                throw new Error(conflictMsg);
            }
            
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Error al crear el rol");
    }
}

export const updateRol = async (id: number, rol: Omit<Rol, "id">): Promise<Rol | null> => {
    try {
        const payload = humps.decamelizeKeys(rol);
        const response = await axiosInstance.put(`${API_BASE_URL_ROLES}${id}/`, payload);
        return humps.camelizeKeys(response.data) as Rol;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response?.data?.error || 
                                   error.response?.data?.detail || 
                                   "El rol ya existe";
                throw new Error(conflictMsg);
            }
            
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Error al actualizar el rol con id: " + id);
    }
}

export const deleteRol = async (id: number): Promise<boolean> => {
    try {
        await axiosInstance.delete(`${API_BASE_URL_ROLES}${id}/`);
        return true;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response?.data?.error || 
                                   error.response?.data?.detail || 
                                   "No se puede eliminar el rol";
                throw new Error(conflictMsg);
            }
            
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Error al eliminar el rol con id: " + id);
    }
}

export const getRolById = async (id: number): Promise<Rol | null> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL_ROLES}${id}/`);
        if (!response.data) return null;
        return humps.camelizeKeys(response.data) as Rol;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) return null;
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Error al obtener el rol con id: " + id);
    }
}

export const findByString = async (searchString: string): Promise<Rol[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL_ROLES}search`, {
            params: humps.decamelizeKeys({searchString}),
        });
        return humps.camelizeKeys(response.data) as Rol[];
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                const notFoundError = new Error(
                    error.response?.data?.error || 
                    error.response?.data?.detail || 
                    "No se encontraron resultados"
                );
                notFoundError.name = "NotFoundError";
                throw notFoundError;
            }
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Ocurrió un error al buscar el rol");
    }
};

export const getRolesPaginated = async (
    page: number,
    pageSize: number
): Promise<RolPaginatedResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL_ROLES}paginated`, {
            params: {
                page,
                page_size: pageSize,
            },
        });
        const rawData = response.data;
        return {
            data: humps.camelizeKeys(rawData.data) as Rol[],
            pagination: {
                currentPage: rawData.pagination.current_page,
                pageSize: rawData.pagination.page_size,
                totalItems: rawData.pagination.total_items,
                totalPages: rawData.pagination.total_pages,
            },
        };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const rawMsg = error.response.data.error || 
                          error.response.data.detail || 
                          error.response.data.details;
            let message = rawMsg;
            const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
            if (match) {
                message = match[1];
            }
            throw new Error(message);
        }
        throw new Error("Error al obtener los roles paginados");
    }
};

export const createUsuario = async (usuario: Usuario): Promise<Usuario> => {
    try {
        const payload = humps.decamelizeKeys(usuario);
        const response = await axiosInstance.post(API_BASE_URL_USUARIOS, payload);
        return humps.camelizeKeys(response.data) as Usuario;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response.data?.error || 
                                   error.response.data?.detail || 
                                   "El usuario ya existe";
                throw new Error(conflictMsg);
            }
            
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Error al crear el usuario");
    }
}


export const updateUsuario = async (
    id: number,
    usuario: Omit<Usuario, "id">
): Promise<Usuario | null> => {
    try {
        const payload = humps.decamelizeKeys(usuario);
        const response = await axiosInstance.put(`${API_BASE_URL_USUARIOS}${id}/`, payload);
        return humps.camelizeKeys(response.data) as Usuario;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response.data?.error || 
                                   error.response.data?.detail || 
                                   "El usuario ya existe";
                throw new Error(conflictMsg);
            }
            
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Error al actualizar el usuario con id: " + id);
    }
};


export const updateUsuarioStatus = async (
    id: number,
    isActive: boolean
): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.patch(
            `${API_BASE_URL_USUARIOS}${id}/status`,
            null,
            {
                params: {
                    user_status: isActive.toString()
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const rawMsg = error.response.data.error || 
                          error.response.data.detail || 
                          error.response.data.details;
            let message = rawMsg;
            const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
            if (match) {
                message = match[1];
            }
            throw new Error(message);
        }
        throw new Error(`Error al ${isActive ? 'activar' : 'desactivar'} el usuario con id: ${id}`);
    }
};


export const getUsuarioById = async (id: number): Promise<Usuario | null> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL_USUARIOS}${id}`);
        return humps.camelizeKeys(response.data) as Usuario;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) return null;
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error(`Error al obtener el usuario con id: ${id}`);
    }
};


export const updateUsuarioPassword = async (
    id: number,
    contrasena: string
): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.patch(
            `${API_BASE_URL_USUARIOS}${id}/update-password`,
            null,
            {
                params: {
                    contrasena: contrasena,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const rawMsg = error.response.data.error || 
                          error.response.data.detail || 
                          error.response.data.details;
            let message = rawMsg;
            const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
            if (match) {
                message = match[1];
            }
            throw new Error(message);
        }
        throw new Error("Error al actualizar la contraseña del usuario");
    }
};

export const findUsuarioByString = async (
    searchString: string
): Promise<Usuario[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL_USUARIOS}search`, {
            params: humps.decamelizeKeys({ searchString }),
        });
        return humps.camelizeKeys(response.data) as Usuario[];
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                const notFoundError = new Error(
                    error.response.data?.error || 
                    error.response.data?.detail || 
                    "No se encontraron resultados"
                );
                notFoundError.name = "NotFoundError";
                throw notFoundError;
            }
            if (error.response?.data) {
                const rawMsg = error.response.data.error || 
                              error.response.data.detail || 
                              error.response.data.details;
                let message = rawMsg;
                const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
                if (match) {
                    message = match[1];
                }
                throw new Error(message);
            }
        }
        throw new Error("Ocurrio un error al buscar al usuario :(");
    }
};

export const getUsuariosPaginated = async (
    page: number,
    pageSize: number,
    isActive: boolean
): Promise<UsuarioPaginatedResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL_USUARIOS}paginated`, {
            params: {
                page,
                page_size: pageSize,
                is_active: isActive.toString(),
            },
        });

        const rawData = response.data;
        return {
            data: humps.camelizeKeys(rawData.data) as Usuario[],
            pagination: {
                currentPage: rawData.pagination.current_page,
                pageSize: rawData.pagination.page_size,
                totalItems: rawData.pagination.total_items,
                totalPages: rawData.pagination.total_pages,
            },
        };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const rawMsg = error.response.data.error || 
                          error.response.data.detail || 
                          error.response.data.details;
            let message = rawMsg;
            const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
            if (match) {
                message = match[1];
            }
            throw new Error(message);
        }
        throw new Error("Ocurrió un error al obtener la lista de usuarios");
    }
};
