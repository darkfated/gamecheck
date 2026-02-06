import { AnimatePresence, motion } from 'framer-motion'
import { FC, useMemo, useState } from 'react'
import { getStatusOptions } from '../../constants'
import { useAuth } from '../../contexts/AuthContext'
import { useGameManagement } from '../../hooks/useGameManagement'
import { ArcadeGlyph } from '../icons/ArcadeGlyph'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Tabs } from '../ui/Tabs'
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
  statusFilter: string
  onStatusChange: (status: string) => void
  statusCounts?: Record<string, number>
  totalCount?: number
  totalFiltered?: number
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  isLoading?: boolean
}

type SortOption = 'default' | 'name' | 'rating' | 'playtime'

export const GameList: FC<GameListProps> = ({
  games,
  onUpdate = () => {},
  editable,
  isOwner,
  statusFilter,
  onStatusChange,
  statusCounts,
  totalCount,
  totalFiltered,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  isLoading = false,
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

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [query, setQuery] = useState('')

  const statusOptions: StatusOption[] = getStatusOptions()

  const handleUpdateSteam = (gameId: string) => {
    if (updateSteamData) {
      updateSteamData(gameId)
    }
  }

  const handleAddGame = async (gameData: any) => {
    try {
      await addGame(gameData)
      setIsFormVisible(false)
    } catch (error) {
      console.error('Ошибка при добавлении игры:', error)
    }
  }

  const localStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    statusOptions.forEach(status => {
      counts[status.value] = 0
    })

    games.forEach(game => {
      if (counts[game.status] !== undefined) {
        counts[game.status] += 1
      }
    })

    return counts
  }, [games, statusOptions])

  const effectiveStatusCounts = useMemo(() => {
    const merged: Record<string, number> = { ...localStatusCounts }
    if (statusCounts) {
      Object.keys(statusCounts).forEach(key => {
        merged[key] = statusCounts[key]
      })
    }
    return merged
  }, [localStatusCounts, statusCounts])

  const getStatusIcon = (statusId: string) => {
    switch (statusId) {
      case 'playing':
        return (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M14 5l7 7-7 7M3 5l7 7-7 7'
            />
          </svg>
        )
      case 'completed':
        return (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        )
      case 'plan_to_play':
        return (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
            />
          </svg>
        )
      case 'dropped':
        return (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        )
      default:
        return (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        )
    }
  }

  const statusTabs = useMemo(
    () => [
      {
        id: 'all',
        label: 'Все',
        badge: totalCount ?? games.length,
        icon: getStatusIcon('all'),
      },
      ...statusOptions.map(status => ({
        id: status.value,
        label: status.label,
        badge: effectiveStatusCounts[status.value] || 0,
        icon: getStatusIcon(status.value),
      })),
    ],
    [games.length, totalCount, effectiveStatusCounts, statusOptions]
  )

  const filteredGames = useMemo(() => {
    let result = [...games]

    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery) {
      result = result.filter(game =>
        game.name.toLowerCase().includes(normalizedQuery)
      )
    }

    if (sortBy !== 'default') {
      result.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name)
        }
        if (sortBy === 'rating') {
          return (b.rating ?? -1) - (a.rating ?? -1)
        }
        return (b.steamPlaytimeForever ?? 0) - (a.steamPlaytimeForever ?? 0)
      })
    }

    return result
  }, [games, query, sortBy])

  const hasFilters =
    statusFilter !== 'all' || query.trim() !== '' || sortBy !== 'default'

  const resetFilters = () => {
    onStatusChange('all')
    setSortBy('default')
    setQuery('')
  }

  const isRefreshing = isLoading && games.length > 0
  const isInitialLoading = isLoading && games.length === 0
  const isCollectionEmpty = !isLoading && (totalCount ?? games.length) === 0

  if (editable && !isAuthenticated && authInitialized) {
    return (
      <Card variant='glass' className='text-center'>
        <div className='flex flex-col items-center gap-3'>
          <ArcadeGlyph className='w-12 h-12 text-[var(--accent-secondary)]' />
          <p className='text-lg font-semibold text-[var(--text-primary)]'>
            Требуется авторизация
          </p>
          <p className='text-[var(--text-secondary)]'>
            Войдите в систему, чтобы управлять своей коллекцией игр.
          </p>
          <Button onClick={() => (window.location.href = '/login')}>
            Войти через Steam
          </Button>
        </div>
      </Card>
    )
  }

  if (isCollectionEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant='glass' className='text-center'>
          <div className='flex flex-col items-center gap-4'>
            <ArcadeGlyph className='w-16 h-16 text-[var(--text-tertiary)]' />
            <div className='space-y-2'>
              <p className='text-lg font-semibold text-[var(--text-primary)]'>
                {isOwner
                  ? 'Ваша коллекция игр пуста'
                  : 'Коллекция игр пользователя пуста'}
              </p>
              <p className='text-[var(--text-secondary)]'>
                {isOwner
                  ? 'Добавьте первую игру, чтобы начать отслеживать прогресс и делиться достижениями.'
                  : 'Пользователь пока не добавил ни одной игры.'}
              </p>
            </div>

            {isOwner && isAuthenticated && (
              <Button onClick={() => setIsFormVisible(true)}>
                Добавить первую игру
              </Button>
            )}

            <AnimatePresence>
              {isOwner && isAuthenticated && isFormVisible && (
                <div className='mt-4 w-full'>
                  <GameAddForm
                    onSubmit={handleAddGame}
                    onCancel={() => setIsFormVisible(false)}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-[var(--text-primary)]'>
            Коллекция игр
          </h2>
          <p className='text-sm text-[var(--text-secondary)]'>
            Всего игр: {totalCount ?? games.length}
          </p>
        </div>

        {isOwner && isAuthenticated && (
          <Button onClick={() => setIsFormVisible(true)} size='md'>
            Добавить игру
          </Button>
        )}
      </div>

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

      <Card variant='glass' className='space-y-4'>
        <Tabs
          tabs={statusTabs}
          activeTab={statusFilter}
          onChange={onStatusChange}
          layoutId='progress-tabs'
          size='md'
          className='flex-wrap'
        />

        <div className='flex flex-col sm:flex-row gap-3'>
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Поиск по названию'
            className='h-12'
          />
          <Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            wrapperClassName='min-w-[220px]'
            className='h-12'
          >
            <option value='default'>Сортировка: по умолчанию</option>
            <option value='name'>Сортировка: по названию</option>
            <option value='rating'>Сортировка: по рейтингу</option>
            <option value='playtime'>Сортировка: по времени</option>
          </Select>
        </div>
      </Card>

      {isInitialLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              variant='glass'
              className='h-[220px] animate-pulse'
            >
              <div />
            </Card>
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <Card variant='glass' className='text-center'>
          <div className='flex flex-col items-center gap-3'>
            <ArcadeGlyph className='w-12 h-12 text-[var(--text-tertiary)]' />
            <p className='text-lg font-semibold text-[var(--text-primary)]'>
              Ничего не найдено
            </p>
            <p className='text-[var(--text-secondary)]'>
              Попробуйте изменить фильтры или поисковый запрос.
            </p>
            {hasFilters && (
              <Button variant='secondary' onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-xs text-[var(--text-tertiary)]'
            >
              Обновляем список...
            </motion.div>
          )}
          <motion.div
            layout
            className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity duration-200 ${
              isRefreshing ? 'opacity-60 pointer-events-none' : 'opacity-100'
            }`}
          >
            <AnimatePresence initial={false} mode='popLayout'>
              {filteredGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onUpdate={updateGame}
                  onDelete={deleteGame}
                  onUpdateSteam={handleUpdateSteam}
                  editable={editable}
                  statusOptions={statusOptions}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          {onLoadMore && hasMore && (
            <div className='flex justify-center pt-4'>
              <Button
                onClick={onLoadMore}
                variant='secondary'
                size='md'
                disabled={isLoadingMore}
                className='min-w-[180px]'
              >
                {isLoadingMore ? 'Загрузка...' : 'Показать ещё'}
              </Button>
            </div>
          )}
          {typeof totalFiltered === 'number' && totalFiltered > 0 && (
            <div className='text-center text-xs text-[var(--text-tertiary)]'>
              Показано {games.length} из {totalFiltered}
            </div>
          )}
        </>
      )}
    </div>
  )
}
