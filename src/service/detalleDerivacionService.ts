import { AxiosError } from "axios";
import humps from "humps";
import { DetalleDerivacion } from "@/model/detalleDerivacion";
import { DetalleDerivacionDetails } from "./../model/detalleDerivacionDetails";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/detalle-derivaciones`;

export const createDetalleDerivacion = async (detalleDerivacion: DetalleDerivacion): Promise<DetalleDerivacionDetails> => {
  try {
    console.log(detalleDerivacion);
    const response = await axiosInstance.post(API_BASE_URL, humps.decamelizeKeys(detalleDerivacion));
    console.log(response);
    return humps.camelizeKeys(response.data) as DetalleDerivacionDetails;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al crear el detalle de derivación");
  }
}

export const getDetalleDerivaciones = async (derivacionId: number): Promise<DetalleDerivacionDetails[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${derivacionId}`);
    return humps.camelizeKeys(response.data) as DetalleDerivacionDetails[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener los detalles de derivación");
  }
};

