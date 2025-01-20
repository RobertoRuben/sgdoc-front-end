import axiosInstance from "./axiosConfig"
import { AxiosError } from "axios"
import { AuthCredentials } from "@/model/authCredentials"
import { AuthResponse } from "@/model/authResponse"
import { UserInfoResponse } from "@/model/userInforResponse"
import humps from "humps"

export const loginForAccessToken = async (
  { nombreUsuario, password }: AuthCredentials
): Promise<AuthResponse> => {
  try {
    const payload = new URLSearchParams()
    payload.append("username", nombreUsuario)
    payload.append("password", password)

    const response = await axiosInstance.post("/auth/login", payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })

    return humps.camelizeKeys(response.data) as AuthResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error("Error al iniciar sesión")
  }
}

export const readUsersMe = async (): Promise<UserInfoResponse> => {
  try {
    const response = await axiosInstance.get("/auth/me")
    return humps.camelizeKeys(response.data) as UserInfoResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error("Error al obtener la información del usuario")
  }
}

export const refreshToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  try {
    const payload = humps.decamelizeKeys({ refreshToken })
    const response = await axiosInstance.post("/auth/refresh", payload)
    return humps.camelizeKeys(response.data) as AuthResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error("Error al refrescar el token")
  }
}