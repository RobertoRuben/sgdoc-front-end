import { AxiosError } from "axios";
import humps from "humps";
import { 
  TotalDocumentosIngresados,
  TotalDocumentosDerivados,
  TotalDocumentosNoDerivados,
  TotalDocumentosPorCaserio
} from "@/model/dashboardMesaPartes";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/dashboard-mesa-partes/documents`;

export const getTotalDocumentsToday = async (): Promise<TotalDocumentosIngresados> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/received-today`);
    return humps.camelizeKeys(response.data) as TotalDocumentosIngresados;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener total de documentos: ${error.message}`);
    }
    throw error;
  }
};


export const getTotalDerivedDocumentsToday = async (): Promise<TotalDocumentosDerivados> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/derived-today`);
    return humps.camelizeKeys(response.data) as TotalDocumentosDerivados;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener documentos derivados: ${error.message}`);
    }
    throw error;
  }
};


export const getTotalPendingDerivedDocumentsToday = async (): Promise<TotalDocumentosNoDerivados> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/pending-derivation-today`);
    return humps.camelizeKeys(response.data) as TotalDocumentosNoDerivados;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener documentos pendientes de derivar: ${error.message}`);
    }
    throw error;
  }
};


export const getTotalDocumentsByCaserioToday = async (): Promise<TotalDocumentosPorCaserio[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/received-today/by-village`);
    return humps.camelizeKeys(response.data) as TotalDocumentosPorCaserio[];
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener documentos por caserío: ${error.message}`);
    }
    throw error;
  }
};