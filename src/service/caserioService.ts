import { AxiosError } from "axios";
import humps from "humps";
import { Caserio } from "@/model/caserio";
import { CaserioPaginatedResponse } from "@/model/caserioPaginatedResponse";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/caserios/`;

export const getCaseriosByCentroPobladoId = async (
  id?: number
): Promise<Caserio[] | null> => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}?centro_poblado_id=${id}`
    );
    return humps.camelizeKeys(response.data) as Caserio[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error(
      "Error al obtener los caserios del centro poblado con id: " + id
    );
  }
};

export const getAllCaserios = async (): Promise<Caserio[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}names`);
    return humps.camelizeKeys(response.data) as Caserio[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener los caserios");
  }
}


export const createCaserio = async (
  caserio: Caserio
): Promise<Caserio> => {
  try {
    const payload = humps.decamelizeKeys(caserio);
    const response = await axiosInstance.post(API_BASE_URL, payload);
    return humps.camelizeKeys(response.data) as Caserio;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al crear el caserio");
  }
};


export const updateCaserio = async (
  id: number,
  caserio: Omit<Caserio, "id">
): Promise<Caserio | null> => {
  try {
    const payload = humps.decamelizeKeys(caserio);
    const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
    return humps.camelizeKeys(response.data) as Caserio;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al actualizar el caserio con id: " + id);
  }
};


export const deleteCaserio = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}${id}/`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al eliminar el caserio con id: " + id);
  }
};

export const getCaserioById = async (
  id: number
): Promise<Caserio | null> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
    if (!response.data) return null;
    return humps.camelizeKeys(response.data) as Caserio;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el caserio con id: " + id);
  }
};

export const findByString = async (
  searchString: string
): Promise<Caserio[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}search`, {
      params: humps.decamelizeKeys({ searchString }),
    });
    return humps.camelizeKeys(response.data) as Caserio[];
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
    throw new Error("Ocurrio un error al buscar el caserio :(");
  }
};

export const getCaseriosPaginated = async (
  page: number,
  pageSize: number
): Promise<CaserioPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
      params: {
        page,
        page_size: pageSize,
      },
    });

    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as Caserio[],
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
    throw new Error("Ocurrio un error al obtener los caserios paginados");
  }
};
