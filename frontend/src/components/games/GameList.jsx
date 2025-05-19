import { useMemo, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { AnimatePresence, motion } from "framer-motion"
import api from "../../services/api"
import { useGameManagement } from "../../hooks/useGameManagement"
import { GameCard } from "./GameCard"
import { GAME_STATUSES, getStatusOptions } from "../../constants"

export function GameList({ games, onUpdate, editable, isOwner }) {
  const { isAuthenticated, authInitialized } = useAuth()
  const { isSubmitting, authError, addGame, updateGame, deleteGame } =
    useGameManagement(onUpdate)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list' view mode
  const [newGame, setNewGame] = useState({
    name: "",
    status: GAME_STATUSES.PLAYING,
    rating: "",
    review: "",
  })

  const enableEditMode = () => {
    setIsFormVisible(true)
  }

  const statusOptions = getStatusOptions()

  const handleAddGame = async e => {
    e.preventDefault()
    const gameToAdd = { ...newGame }

    if (gameToAdd.rating) {
      gameToAdd.rating = Number(gameToAdd.rating)
    } else {
      gameToAdd.rating = null
    }

    if (!gameToAdd.review) {
      gameToAdd.review = ""
    }

    console.log("Добавляю игру:", gameToAdd)
    try {
      await addGame(gameToAdd)
      const lastStatus = newGame.status
      setNewGame({ name: "", status: lastStatus, rating: "", review: "" })
      setIsFormVisible(false)
    } catch (error) {
      console.error("Ошибка при добавлении игры:", error)
    }
  }

  const groupedGames = useMemo(() => {
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

  if (editable && !isAuthenticated && authInitialized) {
    return (
      <div className='bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 text-center shadow-xl'>
        <p className='text-orange-400 font-semibold mb-2'>
          Требуется авторизация
        </p>
        <p className='text-[var(--text-secondary)] mb-4'>
          Чтобы управлять своей коллекцией игр, необходимо войти в систему.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all'
        >
          Войти через Steam
        </button>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 text-center shadow-xl'
      >
        <svg
          className='w-16 h-16 mx-auto text-[var(--text-tertiary)] mb-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
          />
        </svg>
        <p className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
          {isOwner
            ? "Ваша коллекция игр пуста"
            : "Коллекция игр пользователя пуста"}
        </p>
        <p className='text-[var(--text-secondary)] mb-4'>
          {isOwner
            ? "Добавьте первую игру в коллекцию, чтобы начать отслеживать свой игровой прогресс."
            : "Пользователь пока не добавил ни одной игры в свою коллекцию."}
        </p>

        {isOwner && isAuthenticated && (
          <motion.button
            onClick={enableEditMode}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='mt-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 text-sm font-medium'
          >
            Добавить первую игру
          </motion.button>
        )}

        {isOwner && isAuthenticated && isFormVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-6 bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border-color)]'
          >
            <form onSubmit={handleAddGame} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                  Название игры
                </label>
                <input
                  type='text'
                  value={newGame.name}
                  onChange={e =>
                    setNewGame({ ...newGame, name: e.target.value })
                  }
                  required
                  placeholder='Название игры'
                  className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                  Статус
                </label>
                <select
                  value={newGame.status}
                  onChange={e =>
                    setNewGame({ ...newGame, status: e.target.value })
                  }
                  className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                  Оценка (опционально)
                </label>
                <select
                  value={newGame.rating}
                  onChange={e =>
                    setNewGame({ ...newGame, rating: e.target.value })
                  }
                  className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
                >
                  <option value=''>Без оценки</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                  Заметки (опционально)
                </label>
                <textarea
                  value={newGame.review}
                  onChange={e =>
                    setNewGame({ ...newGame, review: e.target.value })
                  }
                  placeholder='Ваши впечатления об игре'
                  className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
                  rows={3}
                />
              </div>

              <div className='flex gap-2'>
                <motion.button
                  type='submit'
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg py-2'
                >
                  {isSubmitting ? "Добавляю..." : "Добавить игру"}
                </motion.button>
                <motion.button
                  type='button'
                  onClick={() => setIsFormVisible(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg px-3 py-2'
                >
                  Отмена
                </motion.button>
              </div>

              {authError && (
                <div className='text-red-500 text-sm mt-2'>{authError}</div>
              )}
            </form>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
            {isOwner ? 'Моя коллекция игр' : 'Коллекция игр'}
          </h2>
          
          {/* View mode toggle buttons */}
          <div className='ml-4 flex bg-[var(--bg-secondary)] p-1 rounded-md'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' 
                  ? 'bg-[var(--accent-tertiary)] text-white' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              } transition-colors`}
              title="Отображение плиткой"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list' 
                  ? 'bg-[var(--accent-tertiary)] text-white' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              } transition-colors`}
              title="Отображение списком"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isOwner && isAuthenticated && (
          <motion.button
            onClick={enableEditMode}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 text-sm font-medium'
          >
            Добавить игру
          </motion.button>
        )}
      </div>

      {/* Форма добавления игры */}
      {editable && isAuthenticated && isFormVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border-color)]'
        >
          <form onSubmit={handleAddGame} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                Название игры
              </label>
              <input
                type='text'
                value={newGame.name}
                onChange={e => setNewGame({ ...newGame, name: e.target.value })}
                required
                placeholder='Название игры'
                className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                Статус
              </label>
              <select
                value={newGame.status}
                onChange={e =>
                  setNewGame({ ...newGame, status: e.target.value })
                }
                className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                Оценка (опционально)
              </label>
              <select
                value={newGame.rating}
                onChange={e =>
                  setNewGame({ ...newGame, rating: e.target.value })
                }
                className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
              >
                <option value=''>Без оценки</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-secondary)]'>
                Заметки (опционально)
              </label>
              <textarea
                value={newGame.review}
                onChange={e =>
                  setNewGame({ ...newGame, review: e.target.value })
                }
                placeholder='Ваши впечатления об игре'
                className='w-full p-2 mt-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg'
                rows={3}
              />
            </div>

            <div className='flex gap-2'>
              <motion.button
                type='submit'
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg py-2'
              >
                {isSubmitting ? "Добавляю..." : "Добавить игру"}
              </motion.button>
              <motion.button
                type='button'
                onClick={() => setIsFormVisible(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg px-3 py-2'
              >
                Отмена
              </motion.button>
            </div>

            {authError && (
              <div className='text-red-500 text-sm mt-2'>{authError}</div>
            )}
          </form>
        </motion.div>
      )}

      {/* Отображение списка игр по категориям статусов */}
      <AnimatePresence>
        {statusOptions.map(status => {
          const gamesInStatus = groupedGames[status.value] || []
          if (gamesInStatus.length === 0) return null

          return (
            <motion.div
              key={status.value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='space-y-4'
            >
              <div className='flex items-center gap-2 border-b border-[var(--divider-color)] pb-2'>
                <div
                  className={`w-3 h-3 rounded-full bg-${status.color}-500`}
                />
                <h2 className='text-lg font-bold text-[var(--text-primary)]'>
                  {status.label} ({gamesInStatus.length})
                </h2>
              </div>

              {viewMode === 'grid' ? (
                <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                  {gamesInStatus.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      statusOptions={statusOptions}
                      editable={editable}
                      onDelete={deleteGame}
                      onUpdate={updateGame}
                    />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                  {gamesInStatus.map(game => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='bg-[var(--card-bg)] p-4 border border-[var(--border-color)] rounded-lg flex justify-between items-center hover:border-[var(--border-color-hover)] transition-all'
                    >
                      <div className='flex-1'>
                        <div className='font-medium text-[var(--text-primary)]'>{game.name}</div>
                        <div className='flex items-center gap-2 mt-1'>
                          {game.rating && (
                            <div className='bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-medium'>
                              {game.rating}/10
                            </div>
                          )}
                        </div>
                      </div>

                      {editable && (
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => updateGame(game.id, { status: game.status === GAME_STATUSES.COMPLETED ? GAME_STATUSES.PLAYING : GAME_STATUSES.COMPLETED })}
                            className='text-indigo-500 hover:text-indigo-400 p-1'
                            title={game.status === GAME_STATUSES.COMPLETED ? 'Отметить как "Играю"' : 'Отметить как "Пройдено"'}
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' 
                                d={game.status === GAME_STATUSES.COMPLETED 
                                  ? 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                                  : 'M5 13l4 4L19 7'} 
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteGame(game.id)}
                            className='text-red-500 hover:text-red-400 p-1'
                            title='Удалить игру'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' 
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' 
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
