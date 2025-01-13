import {AxiosError} from "axios";
import humps from "humps";
import {Trabajador} from "@/model/trabajador";
import {TrabajadorDetails} from "@/model/trabajadorDetails";
import {TrabajadorPaginatedResponse} from "@/model/trabajadorPaginatedResponse";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/trabajadores/`;

export const getTrabajadores = async (): Promise<TrabajadorDetails[]> => {
    try{
        const response = await axiosInstance.get(API_BASE_URL);
        return humps.camelizeKeys(response.data) as TrabajadorDetails[];
    }catch(error){
        if(error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener los trabajadores");
    }
}


export const createTrabajador = async (trabaja: Trabajador): Promise<TrabajadorDetails> => {
    try{
        const payload = humps.decamelizeKeys(trabaja);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as TrabajadorDetails;
    }catch(error){
        if(error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al crear el trabajador");
    }
}


export const updateTrabajador = async (id: number, trabajador: Omit<Trabajador, "id">): Promise<TrabajadorDetails | null> => {
    try{
        const payload = humps.decamelizeKeys(trabajador);
        const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
        return humps.camelizeKeys(response.data) as TrabajadorDetails;
    }catch(error){
        if(error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al actualizar el trabajador con id: " + id);
    }
}


export const deleteTrabajador = async (id: number): Promise<boolean> => {
    try {
        await  axiosInstance.delete(`${API_BASE_URL}${id}/`);
        return true;
    }catch(error){
        if (error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al eliminar el trabajador con id: " + id);
    }
}


export const getTrabajadorById = async(id: number): Promise<TrabajadorDetails | null> => {
    try{
        const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
        if (!response.data) return null;
        return humps.camelizeKeys(response.data) as TrabajadorDetails;

    }catch(error){
        if(error instanceof AxiosError){
            if(error.response?.status === 404){
                return null;
            }
            if(error.response?.data?.detail){
                throw new Error(error.response.data.detail);
            }
        }
        throw new Error("Error al obtener el trabajador con id: " + id);
    }
}


export const findByString = async (searchString: string): Promise<TrabajadorDetails[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}search`, {
            params: humps.decamelizeKeys({searchString}),
        });
        return humps.camelizeKeys(response.data) as TrabajadorDetails[];
    }catch(error){
        if (error instanceof AxiosError){
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
    }
    throw new Error("Error al buscar trabajadores");
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
            data: humps.camelizeKeys(rawData.data) as TrabajadorDetails[],
            pagination: {
                currentPage: rawData.pagination.current_page,
                pageSize: rawData.pagination.page_size,
                totalItems: rawData.pagination.total_items,
                totalPages: rawData.pagination.total_pages,
            },
        };
    }catch (error){
        if (error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener areas paginadas");
    }
}