import { AxiosError } from "axios";
import humps from "humps";
import { CategoriaDocumento } from "@/model/categoriaDocumento.ts";
import { CategoriaDocumentoPaginatedResponse } from "@/model/categoriaDocumentoPaginatedResponse.ts";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/categorias-documento/`;

export const getCategorias = async (): Promise<CategoriaDocumento[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return humps.camelizeKeys(response.data) as CategoriaDocumento[];
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
    throw new Error("Error al obtener las categorias de documentos");
  }
};


export const createCategoria = async (
  categoria: CategoriaDocumento
): Promise<CategoriaDocumento> => {
  try {
    const payload = humps.decamelizeKeys(categoria);
    const response = await axiosInstance.post(API_BASE_URL, payload);
    return humps.camelizeKeys(response.data) as CategoriaDocumento;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        const conflictMsg = error.response?.data?.error || 
                           error.response?.data?.detail || 
                           "El recurso ya existe";
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
    throw new Error("Error al crear la categoria de documento");
  }
};


export const updateCategoria = async (
  id: number,
  categoria: Omit<CategoriaDocumento, "id">
): Promise<CategoriaDocumento | null> => {
  try {
    const payload = humps.decamelizeKeys(categoria);
    const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
    return humps.camelizeKeys(response.data) as CategoriaDocumento;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        const conflictMsg = error.response?.data?.error || 
                           error.response?.data?.detail || 
                           "El recurso ya existe";
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
    throw new Error(
      "Error al actualizar la categoria de documento con id: " + id
    );
  }
};


export const deleteCategoria = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}${id}/`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        const conflictMsg = error.response?.data?.error || 
                           error.response?.data?.detail || 
                           "No se puede eliminar el recurso";
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
    throw new Error(
      "Error al eliminar la categoria de documento con id: " + id
    );
  }
};


export const getCategoriaById = async (
  id: number
): Promise<CategoriaDocumento | null> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
    if (!response.data) return null;
    return humps.camelizeKeys(response.data) as CategoriaDocumento;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
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
    throw new Error("Error al obtener la categoria de documento con id: " + id);
  }
};


export const findByString = async (
  searchString: string
): Promise<CategoriaDocumento[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}search`, {
      params: humps.decamelizeKeys({ searchString }),
    });
    return humps.camelizeKeys(response.data) as CategoriaDocumento[];
  } catch (error) {
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
    throw new Error("Ocurrio un error al buscar la categoria del documento :(");
  }
};


export const getCategoriasPaginated = async (
  page: number,
  pageSize: number
): Promise<CategoriaDocumentoPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as CategoriaDocumento[],
      pagination: {
        currentPage: rawData.pagination.current_page,
        pageSize: rawData.pagination.page_size,
        totalItems: rawData.pagination.total_items,
        totalPages: rawData.pagination.total_pages,
      },
    };
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
    throw new Error(
      "Error al obtener las categorias de documentos registradas"
    );
  }
};
