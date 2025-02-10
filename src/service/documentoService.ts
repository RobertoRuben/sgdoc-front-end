import { AxiosError } from "axios";
import humps from "humps";
import { Documento } from "@/model/documento";
import { DocumentosNoConfirmadosResponse } from "@/model/documentosNoConfirmadosResponse";
import { DocumentoPayload } from "@/model/documentoPayload";
import { DocumentoDetails } from "@/model/documentoDetails.ts";
import { DocumentoReceivedDetails } from "@/model/documentoReceivedDetails";
import { DocumentoSentDetails } from "@/model/documentoSendDetails";
import { DocumentoRechazadosDetails } from '@/model/documentosRechazadosDetails';
import { DocumentoPaginatedResponse } from "@/model/documentoPaginatedResponse";
import { DocumentoReceivedPaginatedResponse } from "@/model/documentoReceivedPaginatedResponse";
import { DocumentoSentPaginatedResponse } from "@/model/documentoSendPaginatedResponse";
import { DocumentoRechazadoPaginatedResponse } from "@/model/documentoRechazadoPaginatedResponse";
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
  
      const response = await axiosInstance.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return humps.camelizeKeys(response.data) as Documento;
    } catch (error) {
      if (error instanceof AxiosError) {
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
    const response = await axiosInstance.get(`${API_BASE_URL}search`, {
      params: humps.decamelizeKeys(params),
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
    throw new Error("Error al buscar los documentos");
  }
};

export const downloadDocumento = async (id: number): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}${id}/download`, {
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
    const response = await axiosInstance.get(`${API_BASE_URL}entered-current-date`, {
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

export const getSentDocumentsByAreaId = async (params: {
  p_area_origen_id: number;
  p_search_document?: string | null;
  p_id_caserio?: number;
  p_id_centro_poblado?: number;
  p_id_ambito?: number;
  p_nombre_categoria?: string;
  p_fecha_ingreso?: string;
  p_page: number;
  p_page_size: number;
}): Promise<DocumentoSentPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}sends`, {
      params: humps.decamelizeKeys(params),
    });
    const rawData = response.data;
    return {
      data: humps.camelizeKeys(rawData.data) as DocumentoSentDetails[],
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
    throw new Error("Error al obtener los documentos enviados por área de origen");
  }
};

export const getReceivedDocumentsByAreaId = async (params: {
  p_area_destino_id: number;
  p_search_document?: string | null;
  p_id_caserio?: number;
  p_id_centro_poblado?: number;
  p_id_ambito?: number;
  p_nombre_categoria?: string;
  p_fecha_ingreso?: string;
  p_recepcionada?: boolean;
  p_page: number;
  p_page_size: number;
}): Promise<DocumentoReceivedPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}received`, {
      params: humps.decamelizeKeys(params),
    });

    const rawData = response.data;

    return {
      data: humps.camelizeKeys(rawData.data) as DocumentoReceivedDetails[],
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
    throw new Error("Error al obtener los documentos recibidos por área de destino");
  }
};


export const getRejectedDocumentsByAreaId = async (params: {
  p_area_destino_id: number;
  p_search_document?: string | null;
  p_id_caserio?: number;
  p_id_centro_poblado?: number;
  p_id_ambito?: number;
  p_nombre_categoria?: string;
  p_fecha_ingreso?: string;
  p_page: number;
  p_page_size: number;
}): Promise<DocumentoRechazadoPaginatedResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}rejected`, {
      params: humps.decamelizeKeys(params),
    });

    const rawData = response.data;

    return {
      data: humps.camelizeKeys(rawData.data) as DocumentoRechazadosDetails[],
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
    throw new Error("Error al obtener los documentos recibidos por área de destino");
  }
};


export const getDocumentosNoConfirmados = async (
  p_area_destino_id: number
): Promise<DocumentosNoConfirmadosResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}unconfirmed`, {
      params: { p_area_destino_id },
    });
    return humps.camelizeKeys(response.data) as DocumentosNoConfirmadosResponse;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener la cantidad de documentos no confirmados");
  }
};


