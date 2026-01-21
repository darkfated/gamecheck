import { motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { ActivityItem } from './ActivityItem'

interface ActivityData {
  id: string
  type: string
  user: {
    id: string
    displayName: string
    avatarUrl: string
  }
  progress?: {
    name: string
    status: string
    rating?: number
  }
  targetUser?: {
    id: string
    displayName: string
  }
  createdAt: string
}

interface ActivityFeedProps {
  userId?: string | null
  showFollowingOnly?: boolean
}

export const ActivityFeed: FC<ActivityFeedProps> = ({
  userId = null,
  showFollowingOnly = false,
}) => {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        setError(null)

        let response

        if (userId) {
          response = await api.activities.getUserActivity(userId)
        } else if (showFollowingOnly) {
          response = await api.activities.getFeed()
        } else {
          response = await api.activities.getAllActivities()
        }

        if (!Array.isArray(response.data)) {
          setError('Получены некорректные данные активностей')
          setActivities([])
        } else {
          setActivities(response.data as unknown as ActivityData[])
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Ошибка загрузки активностей',
        )
      } finally {
        setLoading(false)
      }
    }

    if (user || userId) {
      fetchActivities()
    } else {
      setLoading(false)
    }
  }, [userId, user, showFollowingOnly])

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center py-16'>
        <motion.div
          className='w-12 h-12 rounded-full border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)]'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          className='mt-4 text-[var(--text-secondary)]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Загрузка активностей...
        </motion.p>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        className='bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-400/30 shadow-lg'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className='flex items-center justify-center gap-3 text-red-400 mb-2'>
          <svg
            className='w-6 h-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h3 className='text-lg font-medium'>Ошибка загрузки</h3>
        </div>
        <p className='text-red-400/80 text-center'>{error}</p>
        <div className='flex justify-center mt-4'>
          <button
            className='px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors'
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      </motion.div>
    )
  }

  const getTitle = (): string => {
    if (userId) return 'Лента активности'
    if (showFollowingOnly) return 'Ваша лента'
    return 'Лента активности'
  }

  return (
    <div className='space-y-5'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20'>
          <svg
            className='w-5 h-5 text-[var(--accent-secondary)]'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z'
            />
          </svg>
        </div>
        <h2 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500'>
          {getTitle()}
        </h2>
      </div>

      {activities.length === 0 ? (
        <motion.div
          className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/50 backdrop-blur-md rounded-xl p-6 border border-[var(--border-color)] text-center shadow-md'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='flex flex-col items-center gap-4 p-6'>
            <div className='p-3 bg-[var(--bg-tertiary)]/30 rounded-full'>
              <svg
                className='w-8 h-8 text-[var(--text-secondary)]'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                />
              </svg>
            </div>
            <p className='text-[var(--text-secondary)] text-lg'>
              {userId
                ? 'У пользователя пока нет активности'
                : showFollowingOnly
                  ? 'Нет активности в вашей ленте. Подпишитесь на других пользователей, чтобы видеть их обновления.'
                  : 'Нет новых обновлений'}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className='space-y-4'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
