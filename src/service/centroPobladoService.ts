import { AxiosError } from "axios";
import humps from "humps";
import { CentroPoblado } from "@/model/centroPoblado";
import { CentroPobladoPaginatedResponse } from "@/model/centroPobladoPaginatedResponse";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = "/centros-poblados/";

export const getCentrosPoblados = async (): Promise<CentroPoblado[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return humps.camelizeKeys(response.data) as CentroPoblado[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener los centros poblados");
  }
};

export const createCentroPoblado = async (
  centroPoblado: CentroPoblado
): Promise<CentroPoblado> => {
  try {
    const payload = humps.decamelizeKeys(centroPoblado);
    const response = await axiosInstance.post(API_BASE_URL, payload);
    return humps.camelizeKeys(response.data) as CentroPoblado;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al crear el centro poblado");
  }
};

export const updateCentroPoblado = async(
  id: number,
  centroPoblado: Omit<CentroPoblado, "id">
): Promise<CentroPoblado | null> => {
  try {
    const payload = humps.decamelizeKeys(centroPoblado);
    const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
    return humps.camelizeKeys(response.data) as CentroPoblado;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al actualizar el centro poblado con id: " + id);
  }
};


export const deleteCentroPoblado = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}${id}/`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al eliminar el centro poblado con id: " + id);
  }
};

export const getCentroPobladoById = async (
  id: number
): Promise<CentroPoblado | null> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
    if (!response.data) return null;
    return humps.camelizeKeys(response.data) as CentroPoblado;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el centro poblado con id: " + id);
  }
};

export const findByString = async (
  searchString: string
): Promise<CentroPoblado[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}search`, {
      params: humps.decamelizeKeys({ searchString }),
    });
    return humps.camelizeKeys(response.data) as CentroPoblado[];
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
    throw new Error("Ocurrio un error al buscar la categoria del documento :(");
  }
};


export const getCentrosPobladosPaginated = async (
  page: number,
  pageSize: number
): Promise<CentroPobladoPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as CentroPoblado[],
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
