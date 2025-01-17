import { AxiosError } from "axios";
import humps from "humps";
import { 
  DocumentosByCurrentDateResponse,
  TotalDerivedDocumentsToday,
  TotalPendingDerivedDocumentsToday,
  TotalDocumentsByCaserioToday 
} from "@/model/dashboardMesaPartes";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/documentos-by-current-date`;

export const getTotalDocumentsToday = async (): Promise<DocumentosByCurrentDateResponse> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return humps.camelizeKeys(response.data) as DocumentosByCurrentDateResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener total de documentos: ${error.message}`);
    }
    throw error;
  }
};


export const getTotalDerivedDocumentsToday = async (): Promise<TotalDerivedDocumentsToday> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/derived`);
    return humps.camelizeKeys(response.data) as TotalDerivedDocumentsToday;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener documentos derivados: ${error.message}`);
    }
    throw error;
  }
};


export const getTotalPendingDerivedDocumentsToday = async (): Promise<TotalPendingDerivedDocumentsToday> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/pending-derived`);
    return humps.camelizeKeys(response.data) as TotalPendingDerivedDocumentsToday;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener documentos pendientes de derivar: ${error.message}`);
    }
    throw error;
  }
};


export const getTotalDocumentsByCaserioToday = async (): Promise<TotalDocumentsByCaserioToday[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/caserios`);
    return humps.camelizeKeys(response.data) as TotalDocumentsByCaserioToday[];
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error al obtener documentos por caserío: ${error.message}`);
    }
    throw error;
  }
};