import {AxiosError} from "axios";
import humps from "humps";
import {Rol} from "@/model/rol";
import {RolPaginatedResponse} from "@/model/rolPaginatedResponse.ts";
import axiosInstance from "@/service/axiosConfig";

const API_BASE_URL = `/roles/`;

export const getRoles = async (): Promise<Rol[]> => {
    try {
        const response = await axiosInstance.get(API_BASE_URL);
        return humps.camelizeKeys(response.data) as Rol[];
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener los roles");
    }
}

export const createRol = async (rol: Rol): Promise<Rol> => {
    try {
        const payload = humps.decamelizeKeys(rol);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as Rol;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al crear el rol");
    }
}


export const updateRol = async (id: number, rol: Omit<Rol, "id">): Promise<Rol | null> => {
    try {
        const payload = humps.decamelizeKeys(rol);
        const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
        return humps.camelizeKeys(response.data) as Rol;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al actualizar el rol con id: " + id);
    }
}


export const deleteRol = async (id: number): Promise<boolean> => {
    try {
        await axiosInstance.delete(`${API_BASE_URL}${id}/`);
        return true;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al eliminar el rol con id: " + id);
    }
}


export const getRolById = async (id: number): Promise<Rol | null> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
        if (!response.data) return null;
        return humps.camelizeKeys(response.data) as Rol;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) return null;
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
        }
        throw new Error("Error al obtener el rol con id: " + id);
    }
}


export const findByString = async (searchString: string): Promise<Rol[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}search`, {
            params: humps.decamelizeKeys({searchString}),
        });
        return humps.camelizeKeys(response.data) as Rol[];
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
        throw new Error("Ocurrio un error al buscar al el rol :(");
    }
};


export const getRolesPaginated = async (
    page: number,
    pageSize: number
): Promise<RolPaginatedResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
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
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error(
            "Error al obtener las categorias de documentos registradas"
        );
    }
};
