import { AxiosError } from "axios";
import humps from "humps";
import { DetalleDerivacion } from "@/model/detalleDerivacion";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/detalles-derivacion`;

export const createDetalleDerivacion = async (detalleDerivacion: DetalleDerivacion): Promise<DetalleDerivacion> => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, humps.decamelizeKeys(detalleDerivacion));
    return humps.camelizeKeys(response.data) as DetalleDerivacion;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const rawMsg = error.response.data.details || error.response.data.error || error.response.data.detail;
      let message = rawMsg;
      const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
      if (match) {
        message = match[1];
      }
      throw new Error(message);
    }
    throw new Error("Error al crear el detalle de derivación");
  }
}


export const getDetalleDerivaciones = async (derivacionId: number): Promise<DetalleDerivacion[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${derivacionId}`);
    return humps.camelizeKeys(response.data) as DetalleDerivacion[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) return [];
      if (error.response?.data) {
        const rawMsg = error.response.data.details || error.response.data.error || error.response.data.detail;
        let message = rawMsg;
        const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
        if (match) {
          message = match[1];
        }
        throw new Error(message);
      }
    }
    throw new Error("Error al obtener los detalles de derivación");
  }
};

export const updateDetalleDerivacion = async (
  id: number, 
  detalleDerivacion: Omit<DetalleDerivacion, "id">
): Promise<DetalleDerivacion | null> => {
  try {
    const payload = humps.decamelizeKeys(detalleDerivacion);
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, payload);
    return humps.camelizeKeys(response.data) as DetalleDerivacion;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const rawMsg = error.response.data.details || error.response.data.error || error.response.data.detail;
      let message = rawMsg;
      const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
      if (match) {
        message = match[1];
      }
      throw new Error(message);
    }
    throw new Error(`Error al actualizar el detalle de derivación con id: ${id}`);
  }
};

export const deleteDetalleDerivacion = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const rawMsg = error.response.data.details || error.response.data.error || error.response.data.detail;
      let message = rawMsg;
      const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
      if (match) {
        message = match[1];
      }
      throw new Error(message);
    }
    throw new Error(`Error al eliminar el detalle de derivación con id: ${id}`);
  }
};

export const getDetalleDerivacionById = async (id: number): Promise<DetalleDerivacion | null> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    if (!response.data) return null;
    return humps.camelizeKeys(response.data) as DetalleDerivacion;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) return null;
      if (error.response?.data) {
        const rawMsg = error.response.data.details || error.response.data.error || error.response.data.detail;
        let message = rawMsg;
        const match = rawMsg && typeof rawMsg === 'string' ? rawMsg.match(/'error':\s*'([^']+)'/) : null;
        if (match) {
          message = match[1];
        }
        throw new Error(message);
      }
    }
    throw new Error(`Error al obtener el detalle de derivación con id: ${id}`);
  }
};