import { AxiosError } from "axios";
import humps from "humps";
import { Notificacion } from "@/model/notification";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = `/notifications`;

export const createNotificacion = async (notificacion: Notificacion): Promise<Notificacion> => {
  try {
    const payload = humps.decamelizeKeys(notificacion);
    const response = await axiosInstance.post(`${API_BASE_URL}`, payload);
    return humps.camelizeKeys(response.data) as Notificacion;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al crear la notificación");
  }
};


export const getNotificationsByAreaId = async (areaId: number): Promise<Notificacion[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/area/${areaId}`);
    return humps.camelizeKeys(response.data) as Notificacion[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al obtener las notificaciones");
  }
};


export const markNotificationAsRead = async (notificationId: number): Promise<Notificacion> => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${notificationId}/read`);
    return humps.camelizeKeys(response.data) as Notificacion;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Error al marcar la notificación como leída");
  }
};
