import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface GameData {
  name: string
  status: string
  rating?: number | null
  review?: string
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
  onUpdateCallback: () => void,
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

    try {
      setIsSubmitting(true)
      await api.games.addGame(gameData)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Error adding game:', error)

      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to add game')
      } else {
        alert(
          `Error adding game: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`,
        )
      }
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateGame = async (
    gameId: string,
    updates: Partial<GameData>,
  ): Promise<boolean> => {
    if (!checkAuth()) {
      alert('Authentication required to update game')
      return false
    }

    try {
      await api.games.updateGame(gameId, updates)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Error updating game:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to update game')
      } else {
        alert(
          `Error updating game: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`,
        )
      }
      return false
    }
  }

  const deleteGame = async (gameId: string): Promise<boolean> => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return false
    }

    if (!checkAuth()) {
      alert('Authentication required to delete game')
      return false
    }

    try {
      await api.games.deleteGame(gameId)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Error deleting game:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to delete game')
      } else {
        alert(
          `Error deleting game: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`,
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
      await api.games.updateSteamData(gameId)
      onUpdateCallback()
      return true
    } catch (error: any) {
      console.error('Error updating Steam data:', error)
      if (error.response?.status === 401) {
        setAuthError(true)
        alert('Authentication required to update Steam data')
      } else {
        alert(
          `Error updating Steam data: ${
            error.response?.data?.error || error.message || 'Unknown error'
          }`,
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
