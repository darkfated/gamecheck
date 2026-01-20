import { motion } from 'framer-motion'
import React, { FC, useMemo, useState } from 'react'
import { GAME_STATUSES, getStatusOptions } from '../../constants'
import { useAuth } from '../../contexts/AuthContext'
import { useGameManagement } from '../../hooks/useGameManagement'
import { GameCard } from './GameCard'

interface Game {
  id: string
  name: string
  status: string
  rating?: number
  review?: string
  steamAppId?: string
  steamIconUrl?: string
  steamPlaytimeForever?: number
}

interface StatusOption {
  value: string
  label: string
}

interface GameListProps {
  games: Game[]
  onUpdate?: () => void
  editable?: boolean
  isOwner?: boolean
  viewMode?: 'cards' | 'list'
}

export const GameList: FC<GameListProps> = ({
  games,
  onUpdate = () => {},
  editable,
  isOwner,
  viewMode = 'cards',
}) => {
  const { isAuthenticated, authInitialized } = useAuth()
  const {
    isSubmitting,
    authError,
    addGame,
    updateGame,
    deleteGame,
    updateSteamData,
  } = useGameManagement(onUpdate)

  const handleUpdateSteam = (gameId: string) => {
    if (updateSteamData) {
      updateSteamData(gameId)
    }
  }

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [newGame, setNewGame] = useState<any>({
    name: '',
    status: GAME_STATUSES.PLAYING,
    rating: '',
    review: '',
  })

  const enableEditMode = () => {
    setIsFormVisible(true)
  }

  const statusOptions: StatusOption[] = getStatusOptions()

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault()
    const gameToAdd = { ...newGame }

    if (gameToAdd.rating) {
      gameToAdd.rating = Number(gameToAdd.rating)
    } else {
      gameToAdd.rating = null
    }

    if (!gameToAdd.review) {
      gameToAdd.review = ''
    }

    try {
      await addGame(gameToAdd)
      const lastStatus = newGame.status
      setNewGame({ name: '', status: lastStatus, rating: '', review: '' })
      setIsFormVisible(false)
    } catch (error) {
      console.error('Ошибка при добавлении игры:', error)
    }
  }

  const groupedGames = useMemo(() => {
    if (!Array.isArray(games) || games.length === 0) {
      return statusOptions.reduce(
        (acc, status) => {
          acc[status.value] = []
          return acc
        },
        {} as Record<string, Game[]>,
      )
    }

    const grouped: Record<string, Game[]> = {}
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
          onClick={() => (window.location.href = '/login')}
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
            ? 'Ваша коллекция игр пуста'
            : 'Коллекция игр пользователя пуста'}
        </p>
        <p className='text-[var(--text-secondary)] mb-4'>
          {isOwner
            ? 'Добавьте первую игру в коллекцию, чтобы начать отслеживать свой игровой прогресс.'
            : 'Пользователь пока не добавил ни одной игры в свою коллекцию.'}
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
                  {isSubmitting ? 'Добавляю...' : 'Добавить игру'}
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
      {isOwner && isAuthenticated && (
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
            Моя коллекция игр
          </h2>

          <motion.button
            onClick={enableEditMode}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 text-sm font-medium'
          >
            Добавить игру
          </motion.button>
        </div>
      )}

      {isOwner && isAuthenticated && isFormVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
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
                {isSubmitting ? 'Добавляю...' : 'Добавить игру'}
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

      {statusOptions.map(status => {
        const gamesInStatus = groupedGames[status.value] || []
        if (gamesInStatus.length === 0) return null

        return (
          <div key={status.value} className='space-y-4'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
              {status.label}
            </h3>
            {viewMode === 'cards' ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {gamesInStatus.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onUpdate={updateGame}
                    onDelete={deleteGame}
                    onUpdateSteam={handleUpdateSteam}
                    editable={editable}
                    isOwner={isOwner}
                    statusOptions={statusOptions}
                  />
                ))}
              </div>
            ) : (
              <div className='space-y-3'>
                {gamesInStatus.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onUpdate={updateGame}
                    onDelete={deleteGame}
                    onUpdateSteam={handleUpdateSteam}
                    editable={editable}
                    isOwner={isOwner}
                    statusOptions={statusOptions}
                    listMode={true}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
