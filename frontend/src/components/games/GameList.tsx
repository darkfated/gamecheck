import { AnimatePresence, motion } from 'framer-motion'
import { FC, useMemo, useState } from 'react'
import { getStatusOptions } from '../../constants'
import { useAuth } from '../../contexts/AuthContext'
import { useGameManagement } from '../../hooks/useGameManagement'
import { GameAddForm } from './GameAddForm'
import { GameCard } from './GameCard'

interface Game {
  id: string
  name: string
  status: string
  rating?: number | null
  review?: string
  steamAppId?: number | null
  steamStoreUrl?: string
  steamIconUrl?: string
  steamPlaytimeForever?: number | null
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

  const enableEditMode = () => {
    setIsFormVisible(true)
  }

  const statusOptions: StatusOption[] = getStatusOptions()

  const handleAddGame = async (gameData: any) => {
    try {
      await addGame(gameData)
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

        <AnimatePresence>
          {isOwner && isAuthenticated && isFormVisible && (
            <div className='mt-6'>
              <GameAddForm
                onSubmit={handleAddGame}
                onCancel={() => setIsFormVisible(false)}
                isSubmitting={isSubmitting}
              />
              {authError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-red-500 text-sm mt-4 text-center'
                >
                  {authError}
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
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

      <AnimatePresence>
        {isOwner && isAuthenticated && isFormVisible && (
          <GameAddForm
            onSubmit={handleAddGame}
            onCancel={() => setIsFormVisible(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {authError && (
        <div className='text-red-500 text-sm mt-4 text-center bg-red-500/10 p-4 rounded-lg'>
          {authError}
        </div>
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
