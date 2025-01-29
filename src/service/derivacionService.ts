import {AxiosError} from "axios";
import axiosInstance from "./axiosConfig";
import humps from "humps";
import { Derivacion } from "@/model/derivacion";

const API_BASE_URL = `/derivaciones/`;

export const createDerivacion = async (derivacion: Derivacion): Promise<Derivacion> => {
    try{
        const payload = humps.decamelizeKeys(derivacion);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as Derivacion;
    }catch(error){
        if(error instanceof AxiosError && error.response?.data?.detail){
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al crear la derivacion");
    }

}