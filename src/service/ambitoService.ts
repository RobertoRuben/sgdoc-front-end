import { AxiosError } from "axios";
import humps from "humps";
import { Ambito } from "@/model/ambito";
import { AmbitoPaginatedResponse } from "@/model/ambitoPaginatedResponse";
import axiosInstance from './axiosConfig';

const API_BASE_URL = `/ambitos/`;

export const getAmbitos = async (): Promise<Ambito[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return humps.camelizeKeys(response.data) as Ambito[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener los ambitos");
  }
};

export const createAmbito = async (ambito: Ambito): Promise<Ambito> => {
    try {
        const payload = humps.decamelizeKeys(ambito);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as Ambito;
    } catch(error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al crear el ambito");
    }
};

export const updateAmbito = async (id: number, ambito: Omit<Ambito, "id">): Promise<Ambito | null> => {
    try {
        const payload = humps.decamelizeKeys(ambito);
        const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
        return humps.camelizeKeys(response.data) as Ambito;
    } catch(error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al actualizar el ambito con id: " + id);
    }
};

export const deleteAmbito = async (id: number): Promise<boolean> => {
    try {
        await axiosInstance.delete(`${API_BASE_URL}${id}/`);
        return true;
    } catch(error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al eliminar el ambito con id: " + id);
    }
};

export const getAmbitoById = async (id: number): Promise<Ambito | null> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
        if (!response.data) return null;
        return humps.camelizeKeys(response.data) as Ambito;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) return null;
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
        }
        throw new Error(`Error al obtener el ambito con id: ${id}`);
    }
};

export const findByString = async (searchString: string): Promise<Ambito[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}search`, {
            params: humps.decamelizeKeys({ searchString }),
        });
        return humps.camelizeKeys(response.data) as Ambito[];
    } catch(error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al buscar los ambitos");
    }
};

export const getPaginatedAmbitos = async (
    page: number = 1,
    perPage: number = 10
): Promise<AmbitoPaginatedResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
            params: {
                page,
                per_page: perPage
            }
        });
        
        const rawData = response.data;
        
        return {
            data: humps.camelizeKeys(rawData.data) as Ambito[],
            pagination: {
                currentPage: rawData.pagination.current_page,
                pageSize: rawData.pagination.page_size,
                totalItems: rawData.pagination.total_items,
                totalPages: rawData.pagination.total_pages
            }
        };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener los ambitos paginados");
    }
};