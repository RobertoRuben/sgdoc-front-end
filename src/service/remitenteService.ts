import { AxiosError } from "axios";
import humps from "humps";
import { Remitente } from "@/model/remitente";
import { RemitentePaginatedResponse } from "@/model/remitentePaginatedResponse";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/remitentes/`;

export const getRemitentes = async (): Promise<Remitente[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return humps.camelizeKeys(response.data) as Remitente[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener los remitentes");
  }
};

export const createRemitente = async (
  remitente: Remitente
): Promise<Remitente> => {
  try {
    const payload = humps.decamelizeKeys(remitente);
    const response = await axiosInstance.post(API_BASE_URL, payload);
    return humps.camelizeKeys(response.data) as Remitente;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al crear el remitente");
  }
};

export const updateRemitente = async (
  id: number,
  remitente: Omit<Remitente, "id">
): Promise<Remitente | null> => {
  try {
    const payload = humps.decamelizeKeys(remitente);
    const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
    return humps.camelizeKeys(response.data) as Remitente;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al actualizar el remitente con id: " + id);
  }
};

export const deleteRemitente = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}${id}/`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al eliminar el remitente con id: " + id);
  }
};

export const getRemitenteById = async (
  id: number
): Promise<Remitente | null> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
    if (!response.data) return null;
    return humps.camelizeKeys(response.data) as Remitente;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el remitente con id: " + id);
  }
};

export const findByString = async (
  searchString: string
): Promise<Remitente[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}search`, {
      params: humps.decamelizeKeys({ searchString }),
    });
    return humps.camelizeKeys(response.data) as Remitente[];
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
    throw new Error("Ocurrio un error al buscar al remitente :(");
  }
};

export const getRemitentesPaginated = async (
  page: number,
  pageSize: number
): Promise<RemitentePaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as Remitente[],
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
