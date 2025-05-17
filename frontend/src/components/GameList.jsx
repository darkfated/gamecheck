import { useState, useMemo, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { motion, AnimatePresence } from "framer-motion"

export default function GameList({ games, onUpdate, editable }) {
  const { user, isAuthenticated, authInitialized } = useAuth()
  const [newGame, setNewGame] = useState({
    name: "",
    status: "plan_to_play",
    review: "",
    rating: null,
    steamAppId: null,
    imageUrl: "https://via.placeholder.com/150",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState(false)

  const statusOptions = [
    { value: "playing", label: "Играю", color: "emerald" },
    { value: "completed", label: "Пройдено", color: "blue" },
    { value: "plan_to_play", label: "Планирую", color: "purple" },
    { value: "dropped", label: "Брошено", color: "red" },
  ]

  const groupedGames = useMemo(() => {
    // Проверка, есть ли игры для группировки
    if (!Array.isArray(games) || games.length === 0) {
      return statusOptions.reduce((acc, status) => {
        acc[status.value] = []
        return acc
      }, {})
    }

    const grouped = {}
    statusOptions.forEach(status => {
      grouped[status.value] = games.filter(game => game.status === status.value)
    })

    return grouped
  }, [games])

  // Проверка аутентификации при монтировании компонента и изменении статуса
  useEffect(() => {
    console.log("GameList: проверка авторизации:", {
      isAuthenticated,
      hasUser: !!user,
      editable,
      hasToken: api.auth.hasToken(),
    })

    if (editable && !isAuthenticated) {
      console.log(
        "GameList: пользователь не аутентифицирован для редактирования"
      )
      setAuthError(true)
    } else if (editable && isAuthenticated) {
      console.log(
        "GameList: пользователь аутентифицирован для редактирования",
        user?.id
      )
      setAuthError(false)
    }
  }, [editable, isAuthenticated, user, authInitialized])

  // Проверка аутентификации перед любым действием
  const checkAuth = () => {
    // Проверяем инициализацию контекста аутентификации
    if (!authInitialized) {
      console.log("GameList: контекст аутентификации не инициализирован")
      return false
    }

    // Проверяем состояние аутентификации
    if (!isAuthenticated) {
      console.log("GameList: пользователь не аутентифицирован")
      setAuthError(true)
      return false
    }

    // Проверяем наличие токена
    if (!api.auth.hasToken()) {
      console.log("GameList: нет токена авторизации")
      setAuthError(true)
      return false
    }

    // Проверяем наличие пользователя
    if (!user) {
      console.log("GameList: нет данных пользователя")
      setAuthError(true)
      return false
    }

    return true
  }

  // Обработка добавления новой игры
  const handleAddGame = async e => {
    e.preventDefault()
    if (isSubmitting) return

    console.log("GameList: попытка добавления игры")

    // Проверка аутентификации
    if (!checkAuth()) {
      alert("Для добавления игры необходимо авторизоваться")
      return
    }

    try {
      setIsSubmitting(true)
      console.log("GameList: отправка данных для добавления игры:", newGame)

      const response = await api.games.addGame(newGame)
      console.log("GameList: игра успешно добавлена:", response.data)

      // Сбрасываем форму
      setNewGame({
        name: "",
        status: "plan_to_play",
        review: "",
        rating: null,
        steamAppId: null,
        imageUrl: "https://via.placeholder.com/150",
      })

      // Обновляем список игр
      onUpdate()
    } catch (error) {
      console.error("GameList: ошибка при добавлении игры:", error)

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
    } finally {
      setIsSubmitting(false)
    }
  }

  // Обновление игры
  const handleUpdateGame = async (gameId, updates) => {
    console.log("GameList: попытка обновления игры")

    // Проверка аутентификации
    if (!checkAuth()) {
      alert("Для обновления игры необходимо авторизоваться")
      return
    }

    try {
      console.log("GameList: отправка обновления для игры:", {
        gameId,
        updates,
      })
      await api.games.updateGame(gameId, updates)
      onUpdate()
    } catch (error) {
      console.error("GameList: ошибка при обновлении игры:", error)
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
    }
  }

  // Удаление игры
  const handleDeleteGame = async gameId => {
    if (!window.confirm("Вы уверены, что хотите удалить эту игру?")) return

    console.log("GameList: попытка удаления игры")

    // Проверка аутентификации
    if (!checkAuth()) {
      alert("Для удаления игры необходимо авторизоваться")
      return
    }

    try {
      await api.games.deleteGame(gameId)
      onUpdate()
    } catch (error) {
      console.error("GameList: ошибка при удалении игры:", error)
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
    }
  }

  // Отображаем предупреждение, если пользователь не авторизован, но страница редактируемая
  if (editable && !isAuthenticated && authInitialized) {
    return (
      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center text-red-400'>
        <h2 className='text-xl font-semibold mb-2'>Требуется авторизация</h2>
        <p>Для управления списком игр необходимо выполнить вход через Steam.</p>
        <button
          onClick={() => api.auth.steamLogin()}
          className='mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
        >
          Войти через Steam
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-8 text-gray-100'>
      {/* Форма добавления игры */}
      {user && editable && isAuthenticated && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddGame}
          className='space-y-3 xs:space-y-4 p-4 xs:p-6 bg-[#1a1f2e] rounded-xl border border-[#2563eb]/10 shadow-lg'
        >
          {authError && (
            <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-3'>
              Ошибка авторизации. Пожалуйста, перезайдите в систему.
            </div>
          )}

          <input
            type='text'
            value={newGame.name}
            onChange={e => setNewGame({ ...newGame, name: e.target.value })}
            placeholder='Название игры'
            className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[#151b27] border border-[#2563eb]/20 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]/30 transition-all'
            required
          />
          <select
            value={newGame.status}
            onChange={e => setNewGame({ ...newGame, status: e.target.value })}
            className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[#151b27] border border-[#2563eb]/20 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]/30 transition-all'
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <textarea
            value={newGame.review}
            onChange={e => setNewGame({ ...newGame, review: e.target.value })}
            placeholder='Заметки'
            className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[#151b27] border border-[#2563eb]/20 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]/30 transition-all'
            rows={3}
          />
          <select
            value={newGame.rating || ""}
            onChange={e =>
              setNewGame({
                ...newGame,
                rating: e.target.value ? Number(e.target.value) : null,
              })
            }
            className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[#151b27] border border-[#2563eb]/20 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]/30 transition-all'
          >
            <option value=''>Без оценки</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[#2563eb] text-white rounded-lg font-medium hover:bg-[#2563eb]/90 disabled:bg-[#2563eb]/50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            disabled={isSubmitting}
          >
            {isSubmitting ? "Добавление..." : "Добавить игру"}
          </motion.button>
        </motion.form>
      )}

      {/* Отображение сообщения об отсутствии игр */}
      {Array.isArray(games) && games.length === 0 && (
        <div className='bg-[#1a1f2e] border border-[#2563eb]/10 rounded-lg p-6 text-center'>
          <p className='text-gray-400'>
            {editable
              ? "У вас пока нет игр в списке. Добавьте первую игру!"
              : "У пользователя пока нет игр в списке."}
          </p>
        </div>
      )}

      {/* Отображение списка игр по категориям статусов */}
      <AnimatePresence>
        {statusOptions.map(status => (
          <motion.div
            key={status.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-4'
          >
            {groupedGames[status.value] &&
              groupedGames[status.value].length > 0 && (
                <>
                  <h2 className='text-lg xs:text-xl font-bold text-gray-100 flex items-center gap-2 px-1'>
                    <div
                      className={`w-2 h-2 rounded-full bg-${status.color}-500`}
                    />
                    {status.label} ({groupedGames[status.value].length})
                  </h2>
                  <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                    {groupedGames[status.value].map(game => (
                      <div
                        key={game.id}
                        className='group p-4 bg-[#1a1f2e]/90 backdrop-blur-sm border border-[#2563eb]/10 rounded-xl hover:border-[#2563eb]/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      >
                        <div className='flex justify-between items-start gap-2'>
                          <h3 className='text-base font-semibold text-gray-100 line-clamp-2 flex-grow'>
                            {game.name}
                          </h3>
                          {user && user.id === game.userId && editable && (
                            <button
                              onClick={() => handleDeleteGame(game.id)}
                              className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity focus:opacity-100 p-1'
                            >
                              <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div className='mt-3 space-y-3'>
                          {user && user.id === game.userId && editable ? (
                            <div className='flex flex-col gap-2'>
                              <select
                                value={game.status}
                                onChange={e =>
                                  handleUpdateGame(game.id, {
                                    status: e.target.value,
                                  })
                                }
                                className='p-2 w-full bg-[#151b27]/90 backdrop-blur-sm border border-[#2563eb]/20 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]/30 transition-all duration-200 shadow-inner hover:bg-[#151b27] text-sm'
                              >
                                {statusOptions.map(option => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>

                              <div className='flex items-center gap-2'>
                                <span className='text-gray-200 text-sm'>
                                  Оценка:
                                </span>
                                <select
                                  value={game.rating || ""}
                                  onChange={e =>
                                    handleUpdateGame(game.id, {
                                      rating: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                    })
                                  }
                                  className='p-2 flex-1 bg-[#151b27]/90 backdrop-blur-sm border border-[#2563eb]/20 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]/30 transition-all duration-200 shadow-inner hover:bg-[#151b27] text-sm'
                                >
                                  <option value=''>Нет оценки</option>
                                  {[...Array(10)].map((_, i) => (
                                    <option
                                      key={i + 1}
                                      value={i + 1}
                                      className='bg-[#151b27] text-gray-100'
                                    >
                                      {i + 1}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-wrap items-center gap-2'>
                              <div
                                className={`px-3 py-1 rounded-lg text-sm ${
                                  statusOptions.find(
                                    s => s.value === game.status
                                  )?.color === "emerald"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : statusOptions.find(
                                        s => s.value === game.status
                                      )?.color === "blue"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : statusOptions.find(
                                        s => s.value === game.status
                                      )?.color === "purple"
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {
                                  statusOptions.find(
                                    s => s.value === game.status
                                  )?.label
                                }
                              </div>
                              {game.rating && (
                                <div className='flex items-center gap-1 px-3 py-1 bg-[#2563eb]/10 text-blue-400 rounded-lg text-sm'>
                                  <svg
                                    className='w-4 h-4'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                  </svg>
                                  <span>{game.rating}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {game.review && (
                            <p className='text-gray-300 text-sm line-clamp-3'>
                              {game.review}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
