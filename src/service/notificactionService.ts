import {AxiosError} from "axios";
import humps from "humps";
import { Notificacion } from "@/model/notification";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/notificaciones/`;


export const createNotificacion = async (notificacion: Notificacion): Promise<Notificacion> => {
    try {
        const payload = humps.decamelizeKeys(notificacion);
        const response = await axiosInstance.post(API_BASE_URL, payload);
        return humps.camelizeKeys(response.data) as Notificacion;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error("Error al crear la notificacion");
    }
}