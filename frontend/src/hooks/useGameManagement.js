import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"

export const useGameManagement = onUpdateCallback => {
  const { user, isAuthenticated, authInitialized } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState(false)

  const checkAuth = () => {
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

  const addGame = async gameData => {
    if (isSubmitting) return

    if (!checkAuth()) {
      alert("Для добавления игры необходимо авторизоваться")
      return
    }

    try {
      setIsSubmitting(true)
      await api.games.addGame(gameData)
      onUpdateCallback()
      return true
    } catch (error) {
      console.error("Ошибка при добавлении игры:", error)

      if (error.response && error.response.status === 401) {
        setAuthError(true)
        alert("Для добавления игры необходимо авторизоваться")
      } else {
        alert(
          `Ошибка при добавлении игры: ${
            error.response?.data?.error || error.message || "Неизвестная ошибка"
          }`
        )
      }
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateGame = async (gameId, updates) => {
    if (!checkAuth()) {
      alert("Для обновления игры необходимо авторизоваться")
      return false
    }

    try {
      await api.games.updateGame(gameId, updates)
      onUpdateCallback()
      return true
    } catch (error) {
      console.error("Ошибка при обновлении игры:", error)
      if (error.response && error.response.status === 401) {
        setAuthError(true)
        alert("Для обновления игры необходимо авторизоваться")
      } else {
        alert(
          `Ошибка при обновлении игры: ${
            error.response?.data?.error || error.message || "Неизвестная ошибка"
          }`
        )
      }
      return false
    }
  }

  const deleteGame = async gameId => {
    if (!window.confirm("Вы уверены, что хотите удалить эту игру?"))
      return false

    if (!checkAuth()) {
      alert("Для удаления игры необходимо авторизоваться")
      return false
    }

    try {
      await api.games.deleteGame(gameId)
      onUpdateCallback()
      return true
    } catch (error) {
      console.error("Ошибка при удалении игры:", error)
      if (error.response && error.response.status === 401) {
        setAuthError(true)
        alert("Для удаления игры необходимо авторизоваться")
      } else {
        alert(
          `Ошибка при удалении игры: ${
            error.response?.data?.error || error.message || "Неизвестная ошибка"
          }`
        )
      }
      return false
    }
  }

  const updateSteamData = async gameId => {
    if (!checkAuth()) {
      alert("Для обновления Steam данных необходимо авторизоваться")
      return false
    }

    try {
      await api.games.updateSteamData(gameId)
      onUpdateCallback()
      return true
    } catch (error) {
      console.error("Ошибка при обновлении Steam данных:", error)
      if (error.response && error.response.status === 401) {
        setAuthError(true)
        alert("Для обновления Steam данных необходимо авторизоваться")
      } else {
        alert(
          `Ошибка при обновлении Steam данных: ${
            error.response?.data?.error || error.message || "Неизвестная ошибка"
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
