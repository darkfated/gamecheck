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
      alert('Authentication required to add game')
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

      const gamesResponse = await api.progress.getUserGames()
      const existingGames = gamesResponse.data

      const duplicateGameByName = existingGames.find(
        g => g.name.toLowerCase() === gameData.name.toLowerCase()
      )

      const duplicateGameByAppId =
        gameData.steamAppId != null
          ? existingGames.find(g => g.steamAppId === gameData.steamAppId)
          : null

      if (duplicateGameByAppId || duplicateGameByName) {
        alert(`Игра "${gameData.name}" уже добавлена в вашу библиотеку`)
        return false
      }

      await api.progress.addGame(gameData)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Error adding game:', error)

      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to add game')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Error adding game: ${
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
      alert('Authentication required to update game')
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
      console.error('Error updating game:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to update game')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Error updating game: ${
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
      alert('Authentication required to delete game')
      return false
    }

    try {
      await api.progress.deleteGame(gameId)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Error deleting game:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to delete game')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Error deleting game: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`
        )
      }
      return false
    }
  }

  const updateSteamData = async (gameId: string): Promise<boolean> => {
    if (!checkAuth()) {
      alert('Authentication required to update Steam data')
      return false
    }

    try {
      await api.progress.updateSteamData(gameId)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Error updating Steam data:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to update Steam data')
      } else if (error.response?.status === 429) {
        alert('Слишком много запросов. Подожди немного и попробуй снова')
      } else {
        alert(
          `Error updating Steam data: ${
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
