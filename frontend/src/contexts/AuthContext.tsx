import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface User {
  id: string
  displayName: string
  avatarUrl: string
  profileUrl: string
  steamId?: string
  discordTag?: string
  followersCount?: number
  followingCount?: number
  gamesCount?: number
  totalPlaytime?: number
  averageRating?: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  authInitialized: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUserData: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function extractTokenFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  if (token) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
  return token
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)

        const tokenFromUrl = extractTokenFromUrl()
        if (tokenFromUrl) {
          api.auth.handleAuthToken(tokenFromUrl)
        }

        const { isAuthenticated: isAuth, user: userData } =
          await api.auth.checkAuth()

        setIsAuthenticated(isAuth)
        if (isAuth && userData) {
          setUser(userData)
        }
      } catch (err) {
        console.error('Auth initialization failed:', err)
        setError('Failed to check authentication')
      } finally {
        setLoading(false)
        setAuthInitialized(true)
      }
    }

    initAuth()
  }, [])

  const refreshUserData = async (): Promise<User | null> => {
    try {
      if (!api.auth.hasToken()) {
        return null
      }

      const { data: userData } = await api.auth.getCurrentUser()

      setUser(userData)
      setIsAuthenticated(true)

      return userData
    } catch (err: any) {
      console.error('Failed to get user data:', err)

      if (err.response?.status === 401) {
        setIsAuthenticated(false)
        setUser(null)
      }

      return null
    }
  }

  const login = () => {
    api.auth.steamLogin()
  }

  const logout = async () => {
    try {
      await api.auth.logout()
      setUser(null)
      setIsAuthenticated(false)
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
      setError('Failed to logout')

      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value: AuthContextType = {
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
