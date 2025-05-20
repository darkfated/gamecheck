import axios from "axios"

const API_URL = "http://localhost:5000/api"
const PROGRESS_API_URL = "http://localhost:5001/api"

// Основной экземпляр для большинства API запросов
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Экземпляр для запросов к микросервису прогресса
const progressAxiosInstance = axios.create({
  baseURL: PROGRESS_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

const tokenService = {
  getToken: () => localStorage.getItem("authToken"),
  saveToken: token => {
    if (token) {
      localStorage.setItem("authToken", token)
      return true
    }
    return false
  },
  removeToken: () => {
    localStorage.removeItem("authToken")
  },
}

// Настраиваем интерцепторы для основного API
axiosInstance.interceptors.request.use(
  config => {
    const token = tokenService.getToken()
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    console.error(
      "API Error:",
      error.response
        ? {
            status: error.response.status,
            message: error.response.data,
            url: error.config.url,
          }
        : error.message
    )

    if (error.response && error.response.status === 401) {
      tokenService.removeToken()
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  }
)

// Настраиваем интерцепторы для Progress API
progressAxiosInstance.interceptors.request.use(
  config => {
    const token = tokenService.getToken()
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
      
      console.log("[Auth Debug] Отправка запроса к микросервису прогресса:", {
        url: config.url,
        hasToken: !!token,
        tokenPrefix: token ? token.substring(0, 10) + "..." : "нет"
      });
    } else {
      console.warn("[Auth Debug] Отправка запроса к микросервису прогресса без токена!");
    }
    return config
  },
  error => Promise.reject(error)
)

progressAxiosInstance.interceptors.response.use(
  response => {
    console.log("[Auth Debug] Успешный ответ от микросервиса прогресса:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async error => {
    console.error(
      "Progress API Error:",
      error.response
        ? {
            status: error.response.status,
            message: error.response.data,
            url: error.config.url,
            error: error.response.data.error || "Неизвестная ошибка"
          }
        : error.message
    )

    if (error.response && error.response.status === 401) {
      console.log("[Auth Debug] Получена ошибка авторизации 401 от микросервиса прогресса");
      tokenService.removeToken()
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  }
)

const authApi = {
  checkAuth: async () => {
    try {
      const token = tokenService.getToken()
      if (!token) {
        return { isAuthenticated: false }
      }

      const response = await axiosInstance.get("/auth/validate-token")
      return { isAuthenticated: true, user: response.data.user }
    } catch (error) {
      console.warn("Auth check failed:", error)
      return { isAuthenticated: false }
    }
  },

  getCurrentUser: () => axiosInstance.get("/auth/current"),
  handleAuthToken: token => {
    if (!token || token.length < 10) {
      return false
    }
    return tokenService.saveToken(token)
  },

  getToken: () => tokenService.getToken(),
  hasToken: () => !!tokenService.getToken(),
  logout: async () => {
    try {
      if (tokenService.getToken()) {
        await axiosInstance.post("/auth/logout")
      }
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      tokenService.removeToken()
    }
  },

  steamLogin: () => {
    window.location.href = `${API_URL}/auth/steam`
  },
}

const progressApi = {
  getUserGames: userId =>
    progressAxiosInstance.get(userId ? `/progress/user/${userId}` : "/progress"),

  addGame: data => {
    if (!tokenService.getToken()) {
      return Promise.reject(new Error("Отсутствует токен авторизации"))
    }
    return progressAxiosInstance.post("/progress", data)
  },

  updateGame: (id, data) => {
    if (!tokenService.getToken()) {
      return Promise.reject(new Error("Отсутствует токен авторизации"))
    }
    return progressAxiosInstance.patch(`/progress/${id}`, data)
  },

  deleteGame: id => {
    if (!tokenService.getToken()) {
      return Promise.reject(new Error("Отсутствует токен авторизации"))
    }
    return progressAxiosInstance.delete(`/progress/${id}`)
  },

  getGameById: id => progressAxiosInstance.get(`/progress/${id}`),
}

const gamesApi = progressApi

const usersApi = {
  getProfile: id => axiosInstance.get(`/users/${id}`),
  updateProfile: data => axiosInstance.patch("/users/profile", data),
  searchUsers: query => axiosInstance.get(`/users/search/${query}`),
}

const activitiesApi = {
  getFeed: () => {
    console.log("[Activities API] Запрос общей ленты активностей");
    return axiosInstance.get("/activity")
      .then(response => {
        console.log("[Activities API] Получен ответ от getFeed:", {
          status: response.status,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          itemCount: Array.isArray(response.data) ? response.data.length : 'n/a'
        });
        return response;
      });
  },
  
  getUserActivity: userId => {
    console.log(`[Activities API] Запрос активностей пользователя ${userId}`);
    return axiosInstance.get(`/activity/user/${userId}`)
      .then(response => {
        console.log("[Activities API] Получен ответ от getUserActivity:", {
          userId,
          status: response.status,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          itemCount: Array.isArray(response.data) ? response.data.length : 'n/a'
        });
        return response;
      });
  },
  
  getFollowingActivity: () => {
    console.log("[Activities API] Запрос активностей подписок");
    return axiosInstance.get("/activity/following")
      .then(response => {
        console.log("[Activities API] Получен ответ от getFollowingActivity:", {
          status: response.status,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          itemCount: Array.isArray(response.data) ? response.data.length : 'n/a'
        });
        return response;
      });
  },
}

const subscriptionsApi = {
  getFollowers: userId =>
    axiosInstance.get(`/subscriptions/${userId}/followers`),
  getFollowing: userId =>
    axiosInstance.get(`/subscriptions/${userId}/following`),
  follow: userId => axiosInstance.post(`/subscriptions/follow/${userId}`),
  unfollow: userId => axiosInstance.delete(`/subscriptions/unfollow/${userId}`),
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
