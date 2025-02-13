import axiosInstance from "@/service/axiosConfig"
import { refreshToken } from "@/service/authService"

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (err: Error) => void
}[] = []

function processQueue(error: Error | null, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

export function setupRefreshTokenInterceptor(
  logoutCallback: () => void,
  updateTokens: (access: string, refresh: string) => void
) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Si la URL corresponde al endpoint de login, se rechaza el error sin refrescar
      if (originalRequest.url && originalRequest.url.includes("/login")) {
        return Promise.reject(error)
      }

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true

        const currentRefreshToken = sessionStorage.getItem("refreshToken")
        if (!currentRefreshToken) {
          logoutCallback()
          return Promise.reject(error)
        }

        if (isRefreshing) {
          try {
            const newToken = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })

            originalRequest.headers["Authorization"] = "Bearer " + newToken
            return axiosInstance(originalRequest)
          } catch (err) {
            return Promise.reject(err)
          }
        }

        isRefreshing = true

        try {
          const refreshed = await refreshToken(currentRefreshToken)

          const newRefreshToken =
            refreshed.refreshToken && refreshed.refreshToken.trim() !== ""
              ? refreshed.refreshToken
              : currentRefreshToken

          sessionStorage.setItem("accessToken", refreshed.accessToken)
          sessionStorage.setItem("refreshToken", newRefreshToken)

          updateTokens(refreshed.accessToken, newRefreshToken)

          axiosInstance.defaults.headers.common["Authorization"] =
            "Bearer " + refreshed.accessToken
          originalRequest.headers["Authorization"] =
            "Bearer " + refreshed.accessToken

          processQueue(null, refreshed.accessToken)
          isRefreshing = false

          return axiosInstance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError as Error, null)
          logoutCallback()
          isRefreshing = false
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )
}