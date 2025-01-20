import { ReactNode, useState, useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"
import { AuthContextType } from "@/context/AuthContext"

import { AuthResponse } from "@/model/authResponse"
import { UserInfoResponse } from "@/model/userInforResponse"
import { loginForAccessToken, readUsersMe } from "@/service/authService"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfoResponse | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem("accessToken")
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    sessionStorage.getItem("refreshToken")
  )

  const isAuthenticated = !!accessToken

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
  }, [accessToken])

  const login = async (username: string, password: string) => {
    try {
      const authResponse: AuthResponse = await loginForAccessToken({
        nombreUsuario: username,
        password: password,
      })

      setAccessToken(authResponse.accessToken)
      setRefreshToken(authResponse.refreshToken)
      sessionStorage.setItem("accessToken", authResponse.accessToken)
      sessionStorage.setItem("refreshToken", authResponse.refreshToken)

      const userInfo = await readUsersMe()
      setUser(userInfo)

    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      throw err 
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")
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
