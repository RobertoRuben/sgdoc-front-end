import {AxiosError} from "axios";
import humps from "humps";
import {Area} from "@/model/area";
import {AreaPaginatedResponse} from "@/model/areaPaginatedResponse.ts";
import axiosInstance from "@/service/axiosConfig.ts";

const API_BASE_URL = `/areas/`;

export const getAreas = async (): Promise<Area[]> => {
    try{
        const response = await axiosInstance.get(API_BASE_URL);
        return humps.camelizeKeys(response.data) as Area[];
    }catch(error){
        if(error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener las areas");
    }
}


export const createArea = async (area: Area): Promise<Area> => {
    try{
        const payload = humps.decamelizeKeys(area);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as Area;
    }catch(error){
        if(error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al crear el area");
    }
}


export const updateArea = async (
    id: number,
    area: Omit<Area, "id">
): Promise<Area | null> => {
    try{
        const payload = humps.decamelizeKeys(area);
        const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
        return humps.camelizeKeys(response.data) as Area;
    }catch(error){
        if(error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al actualizar el area con id: " + id);
    }
}

export const deleteArea = async (id: number): Promise<boolean> => {
    try {
        await  axiosInstance.delete(`${API_BASE_URL}${id}/`);
        return true;
    }catch(error){
        if (error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al eliminar el area con id: " + id);
    }
}


export const getAreaById = async (id: number): Promise<Area | null> => {
    try{
        const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
        if (!response.data) return null;
        return humps.camelizeKeys(response.data) as Area;
    }catch (error){
        if (error instanceof AxiosError){
            if (error.response?.status === 404) return null;
            if (error.response?.data?.detail){
                throw new Error(error.response.data.detail);
            }
        }
        throw new Error(`Error al obtener el area con id: ${id}`);
    }
}


export const findByString = async (searchString: string): Promise<Area[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}search`, {
            params: humps.decamelizeKeys({searchString}),
        });
        return humps.camelizeKeys(response.data) as Area[];
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
    throw new Error("Error al buscar areas");
}


export const getAreasPaginated = async (
    page: number,
    pageSize: number
): Promise<AreaPaginatedResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}paginated`,{
            params:{
                page,
                page_size: pageSize,
            },
        });

        const rawData = response.data;

        return {
            data: humps.camelizeKeys(rawData.data) as Area[],
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