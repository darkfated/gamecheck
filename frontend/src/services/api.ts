import axios, { AxiosInstance } from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

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
  isFollowing?: boolean
}

interface GameData {
  name: string
  status: string
  rating?: number | null
  review?: string
}

interface Game extends GameData {
  id: string
  userId: string
  steamAppId?: number | null
  steamStoreUrl?: string
  steamIconUrl?: string
  steamPlaytimeForever?: number | null
}

interface Activity {
  id: string
  type: string
  userId: string
  user: {
    id: string
    displayName: string
    avatarUrl: string
  }
  progressId?: string
  gameName?: string
  status?: string
  rating?: number
  targetUserId?: string
  targetUser?: {
    id: string
    displayName: string
    avatarUrl?: string
  }
  createdAt: string
}

interface AuthCheckResponse {
  isAuthenticated: boolean
  user?: User
}

interface TokenService {
  getToken: () => string | null
  saveToken: (token: string) => boolean
  removeToken: () => void
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const tokenService: TokenService = {
  getToken: () => localStorage.getItem('authToken'),
  saveToken: (token: string) => {
    if (token) {
      localStorage.setItem('authToken', token)
      return true
    }
    return false
  },
  removeToken: () => {
    localStorage.removeItem('authToken')
  },
}

axiosInstance.interceptors.request.use(
  config => {
    const token = tokenService.getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    console.error(
      'API Error:',
      error.response
        ? {
            status: error.response.status,
            message: error.response.data,
            url: error.config.url,
          }
        : error.message
    )

    if (error.response?.status === 401) {
      tokenService.removeToken()
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  }
)

const authApi = {
  checkAuth: async (): Promise<AuthCheckResponse> => {
    try {
      const token = tokenService.getToken()
      if (!token) {
        return { isAuthenticated: false }
      }

      const response = await axiosInstance.get<{ user: User }>(
        '/auth/validate-token'
      )
      return { isAuthenticated: true, user: response.data.user }
    } catch (error) {
      console.warn('Auth check failed:', error)
      return { isAuthenticated: false }
    }
  },

  getCurrentUser: () => axiosInstance.get<User>('/auth/current'),

  handleAuthToken: (token: string): boolean => {
    if (!token || token.length < 10) {
      return false
    }
    return tokenService.saveToken(token)
  },

  hasToken: () => !!tokenService.getToken(),

  logout: async (): Promise<void> => {
    try {
      if (tokenService.getToken()) {
        await axiosInstance.post('/auth/logout')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      tokenService.removeToken()
    }
  },

  steamLogin: () => {
    window.location.href = `${API_URL}/auth/steam`
  },
}

const progressApi = {
  getUserGames: (userId?: string) =>
    axiosInstance.get<Game[]>(
      userId ? `/progress/user/${userId}` : '/progress'
    ),

  addGame: (data: GameData) => {
    if (!tokenService.getToken()) {
      return Promise.reject(new Error('Missing authentication token'))
    }
    return axiosInstance.post<Game>('/progress', data)
  },

  updateGame: (id: string, data: Partial<GameData>) => {
    if (!tokenService.getToken()) {
      return Promise.reject(new Error('Missing authentication token'))
    }
    return axiosInstance.patch<Game>(`/progress/${id}`, data)
  },

  deleteGame: (id: string) => {
    if (!tokenService.getToken()) {
      return Promise.reject(new Error('Missing authentication token'))
    }
    return axiosInstance.delete(`/progress/${id}`)
  },

  updateSteamData: (id: string) => {
    if (!tokenService.getToken()) {
      return Promise.reject(new Error('Missing authentication token'))
    }
    return axiosInstance.post(`/progress/${id}/update-steam`)
  },
}

const gamesApi = progressApi

const usersApi = {
  listUsers: (limit = 10, offset = 0, sort = 'createdAt', order = 'desc') =>
    axiosInstance.get<{
      data: User[]
      total: number
      limit: number
      offset: number
    }>('/users', { params: { limit, offset, sort, order } }),
  getProfile: (id: string) => axiosInstance.get<User>(`/users/${id}`),
  updateProfile: (data: Partial<User>) =>
    axiosInstance.patch<User>('/users/profile', data),
  searchUsers: (query: string) =>
    axiosInstance.get<User[]>(`/users/search/${query}`),
}

const activitiesApi = {
  getAllActivities: () => axiosInstance.get<Activity[]>('/activity/all'),
  getFeed: () => axiosInstance.get<Activity[]>('/activity/feed'),
  getUserActivity: (userId: string) =>
    axiosInstance.get<Activity[]>(`/activity/user/${userId}`),
}

const subscriptionsApi = {
  getFollowers: (userId: string) =>
    axiosInstance.get<User[]>(`/subscriptions/${userId}/followers`),
  getFollowing: (userId: string) =>
    axiosInstance.get<User[]>(`/subscriptions/${userId}/following`),
  follow: (userId: string) =>
    axiosInstance.post(`/subscriptions/follow/${userId}`),
  unfollow: (userId: string) =>
    axiosInstance.delete(`/subscriptions/unfollow/${userId}`),
}

const api = {
  auth: authApi,
  games: gamesApi,
  progress: progressApi,
  users: usersApi,
  activities: activitiesApi,
  subscriptions: subscriptionsApi,
  tokenService,
}

export default api
