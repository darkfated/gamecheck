import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface GameData {
  name: string
  status: string
  rating?: number | null
  review?: string
  steamAppId?: number | null
  steamIconUrl?: string
  steamStoreUrl?: string
}

interface GameManagementHook {
  isSubmitting: boolean
  authError: boolean
  addGame: (gameData: GameData) => Promise<boolean>
  updateGame: (gameId: string, updates: Partial<GameData>) => Promise<boolean>
  deleteGame: (gameId: string) => Promise<boolean>
  updateSteamData: (gameId: string) => Promise<boolean>
}

export const useGameManagement = (
  onUpdateCallback: () => void
): GameManagementHook => {
  const { user, isAuthenticated, authInitialized } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState(false)

  const checkAuth = (): boolean => {
    if (!authInitialized) {
      return false
    }

    if (!isAuthenticated) {
      setAuthError(true)
      return false
    }

    if (!api.auth.hasToken()) {
      setAuthError(true)
      return false
    }

    if (!user) {
      setAuthError(true)
      return false
    }

    return true
  }

  const addGame = async (gameData: GameData): Promise<boolean> => {
    if (isSubmitting) return false

    if (!checkAuth()) {
      alert('Авторизация требуется для добавления игры')
      return false
    }

    if (gameData.name.length < 2) {
      alert('Название игры должно быть больше 2 символов')
      return false
    }
    if (gameData.name.length > 40) {
      alert('Название игры не должно превышать 40 символов')
      return false
    }

    if (gameData.rating !== undefined && gameData.rating !== null) {
      if (gameData.rating < 1 || gameData.rating > 10) {
        alert('Рейтинг может быть от 1 до 10')
        return false
      }
    }

    if (gameData.review && gameData.review.length > 200) {
      alert('Отзыв не должен превышать 200 символов')
      return false
    }

    try {
      setIsSubmitting(true)

      await api.progress.addGame(gameData)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Ошибка добавления игры:', error)

      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Авторизация требуется для добавления игры')
      } else if (error.response?.status === 409) {
        alert('Игра уже находится в твоём прогрессе')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Ошибка добавления игры: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`
        )
      }
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateGame = async (
    gameId: string,
    updates: Partial<GameData>
  ): Promise<boolean> => {
    if (!checkAuth()) {
      alert('Авторизация требуется для обновления игры')
      return false
    }

    if (updates.name && updates.name.length < 2) {
      alert('Название игры должно быть больше 2 символов')
      return false
    }
    if (updates.name && updates.name.length > 40) {
      alert('Название игры не должно превышать 40 символов')
      return false
    }

    if (updates.rating !== undefined && updates.rating !== null) {
      if (updates.rating < 1 || updates.rating > 10) {
        alert('Рейтинг может быть от 1 до 10')
        return false
      }
    }

    if (updates.review && updates.review.length > 200) {
      alert('Отзыв не должен превышать 200 символов')
      return false
    }

    try {
      await api.progress.updateGame(gameId, updates)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Ошибка обновления игры:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Авторизация требуется для обновления игры')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Ошибка обновления игры: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`
        )
      }
      return false
    }
  }

  const deleteGame = async (gameId: string): Promise<boolean> => {
    if (!window.confirm('Ты действительно хочешь удалить эту игру?')) {
      return false
    }

    if (!checkAuth()) {
      alert('Авторизация требуется для удаления игры')
      return false
    }

    try {
      await api.progress.deleteGame(gameId)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Ошибка удаления игры:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Авторизация требуется для удаления игры')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Ошибка удаления игры: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`
        )
      }
      return false
    }
  }

  const updateSteamData = async (gameId: string): Promise<boolean> => {
    if (!checkAuth()) {
      alert('Авторизация требуется для обновления данных Steam')
      return false
    }

    try {
      await api.progress.updateSteamData(gameId)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Ошибка обновления данных Steam:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Авторизация требуется для обновления данных Steam')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Ошибка обновления данных Steam: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`
        )
      }
      return false
    }
  }

  return {
    isSubmitting,
    authError,
    addGame,
    updateGame,
    deleteGame,
    updateSteamData,
  }
}
