import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Card } from '../ui/Card'

interface User {
  id: string
  displayName: string
  avatarUrl: string
  totalPlaytime?: number
}

export const FeedTopPlayers: FC = () => {
  const [topPlayers, setTopPlayers] = useState<User[]>([])
  const [isLoadingTop, setIsLoadingTop] = useState(false)

  useEffect(() => {
    const loadTopPlayers = async () => {
      setIsLoadingTop(true)
      try {
        const response = await api.users.listUsers(
          5,
          0,
          'totalPlaytime',
          'desc'
        )
        setTopPlayers(response.data.data || [])
      } catch (error) {
        console.error('Error loading top players:', error)
        setTopPlayers([])
      } finally {
        setIsLoadingTop(false)
      }
    }

    loadTopPlayers()
  }, [])

  return (
    <Card variant='surface' className='relative overflow-hidden'>
      <div className='absolute -top-10 -right-8 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/15 to-amber-500/10 blur-2xl' />
      <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2'>
        <svg
          className='w-5 h-5 text-[var(--accent-secondary)]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M13 10V3L4 14h7v7l9-11h-7z'
          />
        </svg>
        Топ игроков по времени
      </h3>

      {isLoadingTop ? (
        <div className='flex items-center justify-center py-6'>
          <div className='animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-[var(--accent-primary)]'></div>
        </div>
      ) : topPlayers.length === 0 ? (
        <p className='text-sm text-[var(--text-secondary)]'>
          Пока нет данных для рейтинга.
        </p>
      ) : (
        <div className='space-y-3'>
          {topPlayers.map((player, index) => (
            <Link
              key={player.id}
              to={`/profile/${player.id}`}
              className='flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] px-3 py-2 hover:border-[var(--border-color-hover)] transition-all'
            >
              <div className='w-8 h-8 rounded-full overflow-hidden ring-2 ring-[rgba(var(--accent-primary-rgb),0.2)]'>
                <img
                  src={player.avatarUrl}
                  alt={player.displayName}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium text-[var(--text-primary)] truncate'>
                  {player.displayName}
                </div>
                <div className='text-xs text-[var(--text-tertiary)]'>
                  #{index + 1}
                </div>
              </div>
              <div className='text-xs text-[var(--accent-secondary)] font-semibold'>
                {Math.round((player.totalPlaytime || 0) / 60)} ч
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
