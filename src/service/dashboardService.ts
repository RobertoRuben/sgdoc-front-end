import { AxiosError } from "axios";
import humps from "humps";
import axiosInstance from "./axiosConfig";
import { DashboardRequest } from "@/model/dashboardRequest";
import { 
  IngresosPorAmbitoResponse,
  IngresosPorCaserioResponse,
  IngresosCentroPobladoResponse,
  TotalIngresosResponse,
  PromedioIngresosResponse,
  TopIngresosResponse
} from "@/model/dashboardResponse";

const API_BASE_URL = "/dashboard";

export const getTotalDocumentsByDocumentaryScope = async (
  dashboardRequest: DashboardRequest
): Promise<IngresosPorAmbitoResponse[]> => {
  try {
    const payload = humps.decamelizeKeys(dashboardRequest);
    const response = await axiosInstance.post<IngresosPorAmbitoResponse[]>(
      `${API_BASE_URL}/documentary-scope/total`,
      payload
    );
    return humps.camelizeKeys(response.data) as IngresosPorAmbitoResponse[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener los documentos por ámbito documental.");
  }
};


export const getTotalDocumentsByVillage = async (
  dashboardRequest: DashboardRequest
): Promise<IngresosPorCaserioResponse[]> => {
  try {
    const payload = humps.decamelizeKeys(dashboardRequest);
    const response = await axiosInstance.post<IngresosPorCaserioResponse[]>(
      `${API_BASE_URL}/village/total`,
      payload
    );
    return humps.camelizeKeys(response.data) as IngresosPorCaserioResponse[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener los documentos por caserío.");
  }
};


export const getTotalDocumentsByCentroPoblado = async (
  dashboardRequest: DashboardRequest
): Promise<IngresosCentroPobladoResponse[]> => {
  try {
    const payload = humps.decamelizeKeys(dashboardRequest);
    const response = await axiosInstance.post<IngresosCentroPobladoResponse[]>(
      `${API_BASE_URL}/centro-poblado/total`,
      payload
    );
    return humps.camelizeKeys(response.data) as IngresosCentroPobladoResponse[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener los documentos por centro poblado.");
  }
};


export const getTotalDocuments = async (
  dashboardRequest: DashboardRequest
): Promise<TotalIngresosResponse | null> => {
  try {
    const payload = humps.decamelizeKeys(dashboardRequest);
    const response = await axiosInstance.post<TotalIngresosResponse>(
      `${API_BASE_URL}/documents/total`,
      payload
    );
    return humps.camelizeKeys(response.data) as TotalIngresosResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el total de documentos.");
  }
};


export const getAverageTotalDocuments = async (
  dashboardRequest: DashboardRequest
): Promise<PromedioIngresosResponse | null> => {
  try {
    const payload = humps.decamelizeKeys(dashboardRequest);
    const response = await axiosInstance.post<PromedioIngresosResponse>(
      `${API_BASE_URL}/documents/average`,
      payload
    );
    return humps.camelizeKeys(response.data) as PromedioIngresosResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el promedio de documentos.");
  }
};


export const getTopVillagesWithMostDocuments = async (
  dashboardRequest: DashboardRequest
): Promise<TopIngresosResponse[]> => {
  try {
    const payload = humps.decamelizeKeys(dashboardRequest);
    const response = await axiosInstance.post<TopIngresosResponse[]>(
      `${API_BASE_URL}/top-villages/most`,
      payload
    );
    return humps.camelizeKeys(response.data) as TopIngresosResponse[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el top de caseríos con más documentos.");
  }
};


export const getTopVillagesWithLeastDocuments = async (
  dashboardRequest: DashboardRequest
): Promise<TopIngresosResponse[]> => {
  try {
    const payload = humps.decamelizeKeys(dashboardRequest);
    const response = await axiosInstance.post<TopIngresosResponse[]>(
      `${API_BASE_URL}/top-villages/least`,
      payload
    );
    return humps.camelizeKeys(response.data) as TopIngresosResponse[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    throw new Error("Error al obtener el top de caseríos con menos documentos.");
  }
};
