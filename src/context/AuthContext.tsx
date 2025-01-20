import { createContext } from "react"
import { UserInfoResponse } from "@/model/userInforResponse"

export interface AuthContextType {
  user: UserInfoResponse | null
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
