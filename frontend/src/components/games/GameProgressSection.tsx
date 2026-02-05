import { FC, useEffect, useState } from 'react'
import api from '../../services/api'
import ErrorBoundary from '../common/ErrorBoundary'
import { GameList } from './GameList'
import ProgressErrorFallback from './ProgressErrorFallback'

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

interface GameProgressSectionProps {
  userId: string
  isOwner: boolean
}

const GameProgressSection: FC<GameProgressSectionProps> = ({
  userId,
  isOwner,
}) => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<Error | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

  const fetchGames = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.progress.getUserGames(userId)
      setGames(response.data)
    } catch (err) {
      console.error('Ошибка загрузки игр:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [userId])

  const handleRetry = () => {
    fetchGames()
  }

  const toggleViewMode = () => {
    setViewMode(prevMode => (prevMode === 'cards' ? 'list' : 'cards'))
  }

  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-b-transparent border-[var(--accent-primary)]'></div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      componentName='Игровой прогресс'
      fallback={<ProgressErrorFallback onRetry={handleRetry} />}
      onRetry={handleRetry}
      retryButton={true}
    >
      <div>
        <div className='flex justify-end mb-4'>
          <button
            onClick={toggleViewMode}
            className='relative inline-flex items-center h-8 rounded-full bg-[var(--bg-secondary)] p-1 transition-colors duration-200 ease-in-out hover:bg-[var(--bg-secondary-hover)] hidden md:inline-flex'
            title={
              viewMode === 'cards'
                ? 'Переключить на список'
                : 'Переключить на карточки'
            }
          >
            <span className='sr-only'>
              {viewMode === 'cards'
                ? 'Переключить на список'
                : 'Переключить на карточки'}
            </span>
            <div className='flex items-center'>
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-cyan-500 to-amber-500 text-[#001015] transform translate-x-0'
                    : 'text-[var(--text-secondary)] transform translate-x-6'
                }`}
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                  />
                </svg>
              </div>
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-cyan-500 to-amber-500 text-[#001015] transform -translate-x-6'
                    : 'text-[var(--text-secondary)] transform translate-x-0'
                }`}
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
        <GameList
          games={games}
          onUpdate={fetchGames}
          editable={isOwner}
          isOwner={isOwner}
          viewMode={viewMode}
        />
      </div>
    </ErrorBoundary>
  )
}

export default GameProgressSection
