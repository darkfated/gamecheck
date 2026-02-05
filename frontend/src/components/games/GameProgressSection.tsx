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
        <GameList
          games={games}
          onUpdate={fetchGames}
          editable={isOwner}
          isOwner={isOwner}
        />
      </div>
    </ErrorBoundary>
  )
}

export default GameProgressSection
