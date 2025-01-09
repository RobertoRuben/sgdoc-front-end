import { AxiosError } from "axios";
import humps from "humps";
import { Categoria } from "@/model/categoria";
import { CategoriaPaginatedResponse } from "@/model/categoriaPaginatedResponse";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/categorias/`;

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return humps.camelizeKeys(response.data) as Categoria[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener las categorias de documentos");
  }
};

export const createCategoria = async (
  categoria: Categoria
): Promise<Categoria> => {
  try {
    const payload = humps.decamelizeKeys(categoria);
    const response = await axiosInstance.post(API_BASE_URL, payload);
    return humps.camelizeKeys(response.data) as Categoria;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al crear la categoria de documento");
  }
};

export const updateCategoria = async (
  id: number,
  categoria: Omit<Categoria, "id">
): Promise<Categoria | null> => {
  try {
    const payload = humps.decamelizeKeys(categoria);
    const response = await axiosInstance.put(`${API_BASE_URL}${id}/`, payload);
    return humps.camelizeKeys(response.data) as Categoria;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
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
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(
      "Error al eliminar la categoria de documento con id: " + id
    );
  }
};

export const getCategoriaById = async (
  id: number
): Promise<Categoria | null> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
    if (!response.data) return null;
    return humps.camelizeKeys(response.data) as Categoria;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener la categoria de documento con id: " + id);
  }
};

export const findByString = async (
  searchString: string
): Promise<Categoria[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}search`, {
      params: humps.decamelizeKeys({ searchString }),
    });
    return humps.camelizeKeys(response.data) as Categoria[];
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

export const getCategoriasPaginated = async (
  page: number,
  pageSize: number
): Promise<CategoriaPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}paginated`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as Categoria[],
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
