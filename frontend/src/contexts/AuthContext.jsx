import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

// Поиск токена в URL после редиректа с бэкенда
function extractTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get("token")
  if (token) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
  return token
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)
  const navigate = useNavigate()

  // Инициализация аутентификации при загрузке
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)

        // 1. Проверяем, есть ли токен в URL (при редиректе от Steam)
        const tokenFromUrl = extractTokenFromUrl()
        if (tokenFromUrl) {
          api.auth.handleAuthToken(tokenFromUrl)
        }

        // 2. Проверяем наличие токена в localStorage

        // 3. Проверяем статус аутентификации через API
        const { isAuthenticated, user } = await api.auth.checkAuth()

        setIsAuthenticated(isAuthenticated)
        if (isAuthenticated && user) {
          setUser(user)
        }
      } catch (err) {
        console.error(
          "AuthContext: ошибка при инициализации аутентификации:",
          err
        )
        setError("Ошибка при проверке аутентификации")
      } finally {
        setLoading(false)
        setAuthInitialized(true)
      }
    }

    initAuth()
  }, [])

  // Функция для обновления данных пользователя
  const refreshUserData = async () => {
    try {
      if (!api.auth.hasToken()) {
        return null
      }

      const { data: userData } = await api.auth.getCurrentUser()

      setUser(userData)
      setIsAuthenticated(true)

      return userData
    } catch (err) {
      console.error(
        "AuthContext: ошибка при получении данных пользователя:",
        err
      )

      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false)
        setUser(null)
      }

      return null
    }
  }

  const login = () => {
    api.auth.steamLogin()
  }

  // Выход из системы
  const logout = async () => {
    try {
      await api.auth.logout()
      setUser(null)
      setIsAuthenticated(false)
      navigate("/")
    } catch (err) {
      console.error("AuthContext: ошибка при выходе из системы:", err)
      setError("Ошибка при выходе из системы")

      // Даже при ошибке сбрасываем состояние на клиенте
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    authInitialized,
    login,
    logout,
    refreshUserData,
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent'></div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
