import { AxiosError } from "axios";
import humps from "humps";
import {ComunicacionArea} from "@/model/comunicacionArea";
import axiosInstance from "@/service/axiosConfig";
const API_BASE_URL = `/comunicaciones-area/`;

export const getAreasDestinoByAreaOrigenId = async (
    areaOrigenId: number
): Promise<ComunicacionArea[]> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}${areaOrigenId}/destinos`);
        console.log(response.data);
        return humps.camelizeKeys(response.data) as ComunicacionArea[];
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al obtener las áreas destino");
    }
};