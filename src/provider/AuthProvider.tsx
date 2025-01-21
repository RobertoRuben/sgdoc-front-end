import { ReactNode, useState, useEffect, useCallback } from "react"
import { AuthContext, AuthContextType } from "@/context/AuthContext"
import { AuthResponse } from "@/model/authResponse"
import { UserInfoResponse } from "@/model/userInforResponse"
import { loginForAccessToken, readUsersMe } from "@/service/authService"
import { useNavigate } from "react-router-dom"
import { setupRefreshTokenInterceptor } from "@/interceptors/refreshInterceptor"

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfoResponse | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem("accessToken")
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    sessionStorage.getItem("refreshToken")
  )

  const isAuthenticated = !!accessToken

  const logout = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")

    sessionStorage.removeItem("rolName")
    sessionStorage.removeItem("userId")
    sessionStorage.removeItem("areaId")

    navigate('/login')
    window.location.reload()
  }, [navigate])

  useEffect(() => {
    setupRefreshTokenInterceptor(logout, (newAccess, newRefresh) => {
      setAccessToken(newAccess)
      setRefreshToken(newRefresh)
    })
  }, [logout])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (accessToken) {
          const userInfo = await readUsersMe()
          setUser(userInfo)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error al obtener información del usuario:", error)
        logout()
      }
    }
    fetchUser()
  }, [accessToken, logout])

  const login = async (username: string, password: string) => {
    try {
      const authResponse: AuthResponse = await loginForAccessToken({
        nombreUsuario: username,
        password: password,
      })

      const finalRefreshToken =
        authResponse.refreshToken && authResponse.refreshToken.trim() !== ""
          ? authResponse.refreshToken
          : sessionStorage.getItem("refreshToken") 

      setAccessToken(authResponse.accessToken)
      setRefreshToken(finalRefreshToken)
      sessionStorage.setItem("accessToken", authResponse.accessToken)
      sessionStorage.setItem("refreshToken", finalRefreshToken || "")

      sessionStorage.setItem("rolName", authResponse.rolName)
      sessionStorage.setItem("userId", authResponse.userId.toString())
      sessionStorage.setItem("areaId", authResponse.areaId.toString())

      const userInfo = await readUsersMe()
      setUser(userInfo)
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      throw err
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    accessToken,
    refreshToken,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
