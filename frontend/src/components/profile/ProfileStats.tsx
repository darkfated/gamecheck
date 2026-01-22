import { motion } from 'framer-motion'
import { FC } from 'react'

interface ProfileStatsProps {
  followersCount?: number
  followingCount?: number
  gamesCount: number
  onShowFollowersModal: () => void
  onShowFollowingModal: () => void
  followers?: any[]
  following?: any[]
}

export const ProfileStats: FC<ProfileStatsProps> = ({
  followersCount = 0,
  followingCount = 0,
  gamesCount = 0,
  onShowFollowersModal,
  onShowFollowingModal,
  followers = [],
  following = [],
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={itemVariants}
      className='mt-6 flex flex-wrap gap-6 sm:gap-8 md:gap-12'
    >
      <motion.button
        onClick={() => onShowFollowersModal()}
        whileHover={{ y: -2 }}
        className='group flex items-center gap-3'
      >
        <div className='h-10 w-10 flex items-center backdrop-blur-sm justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-300'>
          <svg
            className='w-5 h-5 text-blue-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
        </div>
        <div className='flex flex-col'>
          <span className='text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-tertiary)] transition-colors'>
            {followersCount || followers?.length || 0}
          </span>
          <span className='text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'>
            Подписчиков
          </span>
        </div>
      </motion.button>

      <motion.button
        onClick={() => onShowFollowingModal()}
        whileHover={{ y: -2 }}
        className='group flex items-center gap-3'
      >
        <div className='h-10 w-10 flex items-center backdrop-blur-sm justify-center rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/30 group-hover:to-purple-600/30 transition-all duration-300'>
          <svg
            className='w-5 h-5 text-purple-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        </div>
        <div className='flex flex-col'>
          <span className='text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-tertiary)] transition-colors'>
            {followingCount || following?.length || 0}
          </span>
          <span className='text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'>
            Подписок
          </span>
        </div>
      </motion.button>

      <div className='group flex items-center gap-3'>
        <div className='h-10 w-10 flex items-center backdrop-blur-sm justify-center rounded-xl bg-gradient-to-br from-pink-600/20 to-red-600/20 group-hover:from-pink-600/30 group-hover:to-red-600/30 transition-all duration-300'>
          <svg
            className='w-5 h-5 text-pink-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
            />
          </svg>
        </div>
        <div className='flex flex-col select-none'>
          <span className='text-xl font-bold text-[var(--text-primary)]'>
            {gamesCount}
          </span>
          <span className='text-sm text-[var(--text-secondary)]'>
            Игр в коллекции
          </span>
        </div>
      </div>
    </motion.div>
  )
}
