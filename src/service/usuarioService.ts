import {AxiosError} from "axios";
import humps from "humps";
import {Usuario} from "@/model/usuario";
import {UsuarioDetails} from "@/model/usuarioDetails";
import {UsuarioPaginatedResponse} from "@/model/usuarioPaginatedResponse";
import axiosInstance from "@/service/axiosConfig";

const API_BASE_URL = `/usuarios/`;

export const createUsuario = async (usuario: Usuario): Promise<UsuarioDetails> => {
    try {
        const payload = humps.decamelizeKeys(usuario);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as UsuarioDetails;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al crear el usuario");
    }
}


export const updateUsuario = async (
    id: number,
    caserio: Omit<Usuario, "id">
): Promise<UsuarioDetails | null> => {
    try {
        const payload = humps.decamelizeKeys(caserio);
        const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
        return humps.camelizeKeys(response.data) as UsuarioDetails;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al actualizar el caserio con id: " + id);
    }
};


export const updateUsuarioStatus = async (
    id: number,
    isActive: boolean
): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.patch(
            `${API_BASE_URL}${id}/status`,
            null,
            {
                params: {
                    user_status: isActive.toString()
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error(`Error al ${isActive ? 'activar' : 'desactivar'} el usuario con id: ${id}`);
    }
};


export const getUsuarioById = async (id: number): Promise<UsuarioDetails> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}${id}`);
        return humps.camelizeKeys(response.data) as UsuarioDetails;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
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
            `${API_BASE_URL}${id}/password`,
            null,
            {
                params: {
                    contrasena: contrasena,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al actualizar la contraseña del usuario");
    }
};


export const findByString = async (
    searchString: string
): Promise<UsuarioDetails[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}search`, {
            params: humps.decamelizeKeys({ searchString }),
        });
        return humps.camelizeKeys(response.data) as UsuarioDetails[];
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                const notFoundError = new Error(
                    error.response?.data?.detail || "No se encontraron resultados"
                );
                notFoundError.name = "NotFoundError";
                throw notFoundError;
            }
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
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
        const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
            params: {
                page,
                page_size: pageSize,
                is_active: isActive.toString(),
            },
        });

        const rawData = response.data;
        return {
            data: humps.camelizeKeys(rawData.data) as UsuarioDetails[],
            pagination: {
                currentPage: rawData.pagination.current_page,
                pageSize: rawData.pagination.page_size,
                totalItems: rawData.pagination.total_items,
                totalPages: rawData.pagination.total_pages,
            },
        };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Ocurrió un error al obtener la lista de usuarios");
    }
};