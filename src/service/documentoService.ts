import { AxiosError } from "axios";
import humps from "humps";
import { Documento } from "@/model/documento";
import { DocumentoPayload } from "@/model/documentoPayload";
import { DocumentoDetails } from "@/model/documentoDetails.ts";
import { DocumentoPaginatedResponse } from "@/model/documentoPaginatedResponse";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/documentos/`;

export const getDocumentos = async (): Promise<Documento[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return humps.camelizeKeys(response.data) as Documento[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener los documentos");
  }
};

export const createDocumento = async (documento: DocumentoPayload): Promise<Documento> => {
    try {
      const snakeCaseData = humps.decamelizeKeys(documento);
  
      const formData = new FormData();
  
      if (documento.documentoBytes instanceof Blob) {
        formData.append("documento_file", documento.documentoBytes);
      } else {
        throw new Error("El archivo del documento no es válido.");
      }
  
      Object.entries(snakeCaseData).forEach(([key, value]) => {
        if (key !== "documento_bytes") {
          formData.append(key, value.toString());
        }
      });
  
      console.log("FormData enviado al backend:", Array.from(formData.entries()));
  
      const response = await axiosInstance.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return humps.camelizeKeys(response.data) as Documento;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error del servidor:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        if (error.response?.data?.detail) {
          throw new Error(`Error del servidor: ${error.response.data.detail}`);
        }
      }
      throw new Error("Error desconocido al crear el documento");
    }
  };
  

export const updateDocumento = async (
  id: number,
  documento: Partial<Documento>
): Promise<Documento | null> => {
  try {
    const formData = new FormData();
    if (documento.documentoBytes) {
      formData.append("documento_file", documento.documentoBytes as Blob);
    }
    formData.append("folios", documento.folios!.toString());
    formData.append("nombre", documento.nombre!);
    formData.append("asunto", documento.asunto!);
    formData.append("ambito_id", documento.ambitoId!.toString());
    formData.append("categoria_id", documento.categoriaId!.toString());
    formData.append("caserio_id", documento.caserioId!.toString());
    formData.append("centro_poblado_id", documento.centroPobladoId!.toString());

    const response = await axiosInstance.put(
      `${API_BASE_URL}${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return humps.camelizeKeys(response.data) as Documento;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al actualizar el documento con id: " + id);
  }
};

export const deleteDocumento = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}${id}/`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al eliminar el documento con id: " + id);
  }
};

export const getDocumentoById = async (
  id: number
): Promise<Documento | null> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
    if (!response.data) return null;
    return humps.camelizeKeys(response.data) as Documento;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el documento con id: " + id);
  }
};

export const searchDocumentos = async (params: {
  p_page: number;
  p_page_size: number;
  p_dni?: number;
  p_id_caserio?: number;
  p_id_centro_poblado?: number;
  p_id_ambito?: number;
  p_nombre_categoria?: string;
  p_fecha_ingreso?: string;
}): Promise<DocumentoPaginatedResponse> => {
  try {
    console.log("Params:", params);
    const response = await axiosInstance.get(`${API_BASE_URL}buscar`, {
      params: humps.decamelizeKeys(params),
    });
    console.log(axiosInstance.defaults.headers)
    console.log(params)
    console.log("Response data:", response.data);
    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as DocumentoDetails[],
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
    throw new Error("Error al buscar los documentos");
  }
};

export const downloadDocumento = async (id: number): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/descargar`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al descargar el documento con id: " + id);
  }
};

export const getDocumentosByCurrentDate = async (
  page: number,
  pageSize: number
): Promise<DocumentoPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}fecha_actual`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as DocumentoDetails[],
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
    throw new Error("Error al obtener los documentos con fecha actual");
  }
};
