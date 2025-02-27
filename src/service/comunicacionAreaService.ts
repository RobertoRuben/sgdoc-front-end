import {AxiosError} from "axios";
import humps from "humps";
import {ComunicacionArea} from "@/model/comunicacionArea";
import {ComunicacionAreaPaginatedResponse} from "@/model/comunicacionAreaPaginatedResponse";
import axiosInstance from "@/service/axiosConfig";

const API_BASE_URL = `/comunicaciones-area/`;

export const getAreasDestinoByAreaOrigenId = async (
    areaOrigenId: number
): Promise<ComunicacionArea[]> => {
    try {
        const response = await axiosInstance.get(
            `${API_BASE_URL}${areaOrigenId}/destinos`
        );
        console.log(response.data);
        return humps.camelizeKeys(response.data) as ComunicacionArea[];
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener las áreas destino");
    }
};


export const getComunicacionesArea = async (
    page: number,
    pageSize: number
): Promise<ComunicacionAreaPaginatedResponse> => {
    try {
        const response = await axiosInstance.get(API_BASE_URL, {
            params: {
                page,
                page_size: pageSize,
            },
        });
        const rawData = response.data;
        const mappedData = humps.camelizeKeys(rawData.data);
        return {
            data: mappedData as ComunicacionArea[],
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
        throw new Error("Error al obtener las áreas de comunicación");
    }
};

export const findComunicacionAreaByString = async (
    term: string
): Promise<ComunicacionArea[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}search`, {
            params: { search_string: term },
        });
        console.log(response.data);
        const mappedData = humps.camelizeKeys(response.data);
        return mappedData as ComunicacionArea[];
    } catch (error) {
        console.log(error);
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al buscar las áreas de comunicación");
    }
};


export const getComunicacionAreaById = async (
    id: number
): Promise<ComunicacionArea> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}${id}`);
        return humps.camelizeKeys(response.data) as ComunicacionArea;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener el área de comunicación");
    }
};

export const createComunicacionArea = async (
    data: Omit<ComunicacionArea, "id">
): Promise<ComunicacionArea> => {
    try {
        const payload = humps.decamelizeKeys(data);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as ComunicacionArea;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const rawMsg = error.response.data.details || error.response.data.error;
            let message = rawMsg;
            const match = rawMsg.match(/'error':\s*'([^']+)'/);
            if (match) {
                message = match[1];
            }
            throw new Error(message);
        }
        throw new Error("Error al crear el área de comunicación");
    }
};


export const updateComunicacionArea = async (
    id: number,
    data: Omit<ComunicacionArea, "id">
): Promise<ComunicacionArea> => {
    try {
        const payload = humps.decamelizeKeys(data);
        const response = await axiosInstance.put(`${API_BASE_URL}${id}`, payload);
        return humps.camelizeKeys(response.data) as ComunicacionArea;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al actualizar el área de comunicación");
    }
};

export const deleteComunicacionArea = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`${API_BASE_URL}${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al eliminar el área de comunicación");
    }
};