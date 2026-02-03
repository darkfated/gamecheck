import { motion } from 'framer-motion'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { GAME_STATUS_CONFIG, GAME_STATUS_LABELS } from '../../constants'
import { timeAgo } from '../../utils/dateFormatter'

interface User {
  id: string
  displayName: string
  avatarUrl: string
  profileUrl?: string
}

interface Activity {
  id: string
  type: string
  userId: string
  user: User
  progressId?: string
  gameName?: string
  status?: string
  rating?: number
  targetUserId?: string
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

const StarRating: FC<{ rating: number }> = ({ rating }) => {
  return (
    <span className='inline-flex items-center gap-1 ml-1.5 font-medium text-[var(--text-primary)]'>
      {Math.min(10, Math.max(1, Math.round(rating)))}
      <svg className='w-5 h-5 fill-yellow-400' viewBox='0 0 24 24'>
        <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
      </svg>
    </span>
  )
}

const StatusBadgeInline: FC<{ status: string }> = ({ status }) => {
  const statusConfig = GAME_STATUS_CONFIG[
    status as keyof typeof GAME_STATUS_CONFIG
  ] || {
    bgClass: 'bg-gray-500/10',
    textClass: 'text-gray-400',
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-sm font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`}
    >
      {GAME_STATUS_LABELS[status as keyof typeof GAME_STATUS_LABELS] || status}
    </span>
  )
}

export const ActivityItem: FC<ActivityItemProps> = ({ activity }) => {
  const renderActivityContent = () => {
    const { type, gameName, status, rating } = activity

    switch (type) {
      case 'add_game':
        if (!gameName) return <span>добавил(а) игру</span>
        return (
          <span>
            добавил(а) игру{' '}
            <span className='font-medium text-[var(--accent-tertiary)]'>
              {gameName}
            </span>{' '}
            в {status && <StatusBadgeInline status={status} />}
          </span>
        )
      case 'update_game':
      case 'update_status':
        if (!gameName) return <span>изменил(а) статус игры</span>
        return (
          <span>
            изменил(а) статус игры{' '}
            <span className='font-medium text-[var(--accent-tertiary)]'>
              {gameName}
            </span>{' '}
            на {status && <StatusBadgeInline status={status} />}
          </span>
        )
      case 'rate_game':
        if (!gameName) return <span>оценил(а) игру</span>
        return (
          <span>
            оценил(а) игру{' '}
            <span className='font-medium text-[var(--accent-tertiary)]'>
              {gameName}
            </span>
            {rating && <StarRating rating={rating} />}
          </span>
        )
      case 'follow':
        if (!activity.targetUser)
          return <span>подписался(ась) на пользователя</span>
        return (
          <span>
            подписался(ась) на{' '}
            <Link
              to={`/profile/${activity.targetUser.id}`}
              className='font-medium text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)] transition-colors'
            >
              {activity.targetUser.displayName}
            </Link>
          </span>
        )
      case 'unfollow':
        if (!activity.targetUser)
          return <span>отписался(ась) от пользователя</span>
        return (
          <span>
            отписался(ась) от{' '}
            <Link
              to={`/profile/${activity.targetUser.id}`}
              className='font-medium text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)] transition-colors'
            >
              {activity.targetUser.displayName}
            </Link>
          </span>
        )
      default:
        return <span>{type}</span>
    }
  }

  return (
    <motion.div
      className='flex items-start p-3 md:p-5 bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/50 backdrop-blur-md rounded-lg md:rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden relative'
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
              className='w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl object-cover ring-2 ring-[var(--accent-primary)]/20'
            />
            <div className='absolute -bottom-1 -right-1 w-2.5 md:w-3 h-2.5 md:h-3 bg-green-500 rounded-full border border-[var(--bg-primary)]'></div>
          </div>
        </Link>
      </motion.div>

      <div className='ml-2 md:ml-4 flex-grow z-10 min-w-0'>
        <div className='select-none'>
          <Link
            to={`/profile/${activity.user.id}`}
            className='font-medium text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors break-words'
          >
            {activity.user.displayName}
          </Link>{' '}
          <span className='text-[var(--text-primary)] text-sm md:text-base break-words'>
            {renderActivityContent()}
          </span>
        </div>
        <div className='text-xs md:text-sm text-[var(--text-tertiary)] mt-2 flex items-center gap-1'>
          <svg
            className='w-3 md:w-3.5 h-3 md:h-3.5 flex-shrink-0'
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
          <span className='flex-shrink-0'>{timeAgo(activity.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  )
}
