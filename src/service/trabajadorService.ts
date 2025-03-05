import {AxiosError} from "axios";
import humps from "humps";
import {Trabajador} from "@/model/trabajador";
import {TrabajadorPaginatedResponse} from "@/model/trabajadorPaginatedResponse";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/trabajadores/`;

export const getTrabajadoresNames = async (): Promise<Trabajador[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}ids-and-names`);
        return humps.camelizeKeys(response.data) as Trabajador[];
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
        throw new Error("Error al obtener los nombres de los trabajadores");
    }
}


export const createTrabajador = async (trabajador: Trabajador): Promise<Trabajador> => {
    try{
        const payload = humps.decamelizeKeys(trabajador);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as Trabajador;
    } catch(error){
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response?.data?.error || 
                                   error.response?.data?.detail || 
                                   "El trabajador ya existe";
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
        throw new Error("Error al crear el trabajador");
    }
}


export const updateTrabajador = async (id: number, trabajador: Omit<Trabajador, "id">): Promise<Trabajador | null> => {
    try{
        const payload = humps.decamelizeKeys(trabajador);
        const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
        return humps.camelizeKeys(response.data) as Trabajador;
    } catch(error){
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response?.data?.error || 
                                   error.response?.data?.detail || 
                                   "El trabajador ya existe";
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
        throw new Error("Error al actualizar el trabajador con id: " + id);
    }
}


export const deleteTrabajador = async (id: number): Promise<boolean> => {
    try {
        await axiosInstance.delete(`${API_BASE_URL}${id}/`);
        return true;
    } catch(error){
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                const conflictMsg = error.response?.data?.error || 
                                   error.response?.data?.detail || 
                                   "No se puede eliminar el trabajador";
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
        throw new Error("Error al eliminar el trabajador con id: " + id);
    }
}


export const getTrabajadorById = async(id: number): Promise<Trabajador | null> => {
    try{
        const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
        if (!response.data) return null;
        return humps.camelizeKeys(response.data) as Trabajador;
    } catch(error){
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
        throw new Error("Error al obtener el trabajador con id: " + id);
    }
}


export const findByString = async (searchString: string): Promise<Trabajador[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}search`, {
            params: humps.decamelizeKeys({searchString}),
        });
        return humps.camelizeKeys(response.data) as Trabajador[];
    } catch(error){
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
        throw new Error("Ocurrió un error al buscar trabajadores");
    }
}


export const getTrabajadoresPaginated = async (
    page: number,
    pageSize: number
): Promise<TrabajadorPaginatedResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}paginated`,{
            params:{
                page,
                page_size: pageSize,
            },
        });

        const rawData = response.data;

        return {
            data: humps.camelizeKeys(rawData.data) as Trabajador[],
            pagination: {
                currentPage: rawData.pagination.current_page,
                pageSize: rawData.pagination.page_size,
                totalItems: rawData.pagination.total_items,
                totalPages: rawData.pagination.total_pages,
            },
        };
    } catch (error){
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
        throw new Error("Error al obtener trabajadores paginados");
    }
}