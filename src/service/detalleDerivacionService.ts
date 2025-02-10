import { AxiosError } from "axios";
import humps from "humps";
import { DetalleDerivacion } from "@/model/detalleDerivacion";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/detalles-derivacion`;

export const createDetalleDerivacion = async (detalleDerivacion: DetalleDerivacion): Promise<DetalleDerivacion> => {
  try {
    console.log("detalleDerivacion");
    console.log(detalleDerivacion);
    const response = await axiosInstance.post(API_BASE_URL, humps.decamelizeKeys(detalleDerivacion));
    console.log("response");
    console.log(response);
    return humps.camelizeKeys(response.data) as DetalleDerivacion;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al crear el detalle de derivación");
  }
}

export const getDetalleDerivaciones = async (derivacionId: number): Promise<DetalleDerivacion[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${derivacionId}`);
    return humps.camelizeKeys(response.data) as DetalleDerivacion[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener los detalles de derivación");
  }
};

