import { FC, useCallback, useEffect, useState } from 'react'
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

interface ProgressSummary {
  total: number
  avgRating: number
  ratingCount: number
  byStatus: Record<string, number>
}

interface GameProgressSectionProps {
  userId: string
  isOwner: boolean
}

const PAGE_SIZE = 30

const GameProgressSection: FC<GameProgressSectionProps> = ({
  userId,
  isOwner,
}) => {
  const [games, setGames] = useState<Game[]>([])
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [totalFiltered, setTotalFiltered] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [, setError] = useState<Error | null>(null)

  const fetchGames = useCallback(
    async (reset = false, offset = 0) => {
      try {
        if (reset) {
          setLoading(true)
        } else {
          setIsLoadingMore(true)
        }
        setError(null)

        const statusParam = statusFilter === 'all' ? undefined : statusFilter

        const response = await api.progress.getUserGames(userId, {
          limit: PAGE_SIZE,
          offset,
          status: statusParam,
          summary: reset,
        })

        const payload = response.data
        const items = Array.isArray(payload.data) ? payload.data : []

        setTotalFiltered(payload.total || 0)
        if (reset) {
          setGames(items)
        } else {
          setGames(prev => [...prev, ...items])
        }
        if (reset && payload.summary) {
          setSummary(payload.summary)
        }
      } catch (err) {
        console.error('Ошибка загрузки игр:', err)
        setError(err as Error)
      } finally {
        if (reset) {
          setLoading(false)
        } else {
          setIsLoadingMore(false)
        }
      }
    },
    [statusFilter, userId]
  )

  useEffect(() => {
    fetchGames(true, 0)
  }, [fetchGames, userId, statusFilter])

  const handleRetry = () => {
    fetchGames(true, 0)
  }

  const handleLoadMore = () => {
    if (loading || isLoadingMore) return
    if (games.length >= totalFiltered) return
    fetchGames(false, games.length)
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
          onUpdate={() => fetchGames(true, 0)}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusCounts={summary?.byStatus}
          totalCount={summary?.total}
          totalFiltered={totalFiltered}
          onLoadMore={handleLoadMore}
          hasMore={games.length < totalFiltered}
          isLoadingMore={isLoadingMore}
          isLoading={loading}
          editable={isOwner}
          isOwner={isOwner}
        />
      </div>
    </ErrorBoundary>
  )
}

export default GameProgressSection
