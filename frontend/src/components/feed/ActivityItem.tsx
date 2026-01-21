import { motion } from 'framer-motion'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { GAME_STATUS_LABELS } from '../../constants'
import { timeAgo } from '../../utils/dateFormatter'

interface User {
  id: string
  displayName: string
  avatarUrl: string
}

interface Progress {
  name: string
  status: string
  rating?: number
}

interface Activity {
  id: string
  type: string
  user: User
  progress?: Progress
  targetUser?: {
    id: string
    displayName: string
    avatarUrl?: string
  }
  createdAt: string
}

interface ActivityItemProps {
  activity: Activity
}

export const ActivityItem: FC<ActivityItemProps> = ({ activity }) => {
  const getStatusLabel = (status: string): string => {
    return (
      GAME_STATUS_LABELS[status as keyof typeof GAME_STATUS_LABELS] || status
    )
  }

  const renderActivityContent = () => {
    const { type, progress, targetUser } = activity

    switch (type) {
      case 'add_game':
        if (!progress) return <span>добавил(а) игру</span>
        return (
          <span>
            добавил(а) игру{' '}
            <span className='font-medium text-[var(--accent-tertiary)]'>
              {progress.name}
            </span>{' '}
            в список "{getStatusLabel(progress.status)}"
          </span>
        )
      case 'update_game':
      case 'update_status':
        if (!progress) return <span>изменил(а) статус игры</span>
        return (
          <span>
            изменил(а) статус игры{' '}
            <span className='font-medium text-[var(--accent-tertiary)]'>
              {progress.name}
            </span>{' '}
            на "{getStatusLabel(progress.status)}"
          </span>
        )
      case 'rate_game':
        if (!progress) return <span>оценил(а) игру</span>
        return (
          <span>
            оценил(а) игру{' '}
            <span className='font-medium text-[var(--accent-tertiary)]'>
              {progress.name}
            </span>{' '}
            на {progress.rating}/10
          </span>
        )
      case 'follow':
        if (!targetUser) return <span>подписался(ась) на пользователя</span>
        return (
          <span>
            подписался(ась) на{' '}
            <Link
              to={`/profile/${targetUser.id}`}
              className='font-medium text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)] transition-colors'
            >
              {targetUser.displayName}
            </Link>
          </span>
        )
      case 'unfollow':
        if (!targetUser) return <span>отписался(ась) от пользователя</span>
        return (
          <span>
            отписался(ась) от{' '}
            <Link
              to={`/profile/${targetUser.id}`}
              className='font-medium text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)] transition-colors'
            >
              {targetUser.displayName}
            </Link>
          </span>
        )
      default:
        return <span>{type}</span>
    }
  }

  return (
    <motion.div
      className='flex items-start p-5 bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/50 backdrop-blur-md rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden relative'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      whileHover={{
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        y: -2,
        borderColor: 'rgba(var(--accent-primary-rgb), 0.3)',
      }}
    >
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

      <motion.div whileHover={{ scale: 1.05 }} className='flex-shrink-0 z-10'>
        <Link to={`/profile/${activity.user.id}`} className='block'>
          <div className='relative'>
            <img
              src={activity.user.avatarUrl}
              alt={activity.user.displayName}
              className='w-12 h-12 rounded-xl object-cover ring-2 ring-[var(--accent-primary)]/20'
            />
            <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-[var(--bg-primary)]'></div>
          </div>
        </Link>
      </motion.div>

      <div className='ml-4 flex-grow z-10'>
        <div className='select-none'>
          <Link
            to={`/profile/${activity.user.id}`}
            className='font-medium text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors'
          >
            {activity.user.displayName}
          </Link>{' '}
          <span className='text-[var(--text-primary)]'>
            {renderActivityContent()}
          </span>
        </div>
        <div className='text-sm text-[var(--text-tertiary)] mt-2 flex items-center gap-1'>
          <svg
            className='w-3.5 h-3.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          {timeAgo(activity.createdAt)}
        </div>
      </div>
    </motion.div>
  )
}
