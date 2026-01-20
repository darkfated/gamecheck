import { motion } from 'framer-motion'
import { FC } from 'react'

interface ProfileStatsProps {
  followersCount?: number
  followingCount?: number
  gamesCount: number
  onShowFollowersModal: () => void
  onShowFollowingModal: () => void
}

export const ProfileStats: FC<ProfileStatsProps> = ({
  followersCount = 0,
  followingCount = 0,
  gamesCount = 0,
  onShowFollowersModal,
  onShowFollowingModal,
}) => {
  const stats = [
    {
      label: 'Подписчики',
      value: followersCount,
      onClick: onShowFollowersModal,
    },
    {
      label: 'Подписки',
      value: followingCount,
      onClick: onShowFollowingModal,
    },
    { label: 'Игры', value: gamesCount, onClick: () => {} },
  ]

  return (
    <div className='grid grid-cols-3 gap-4 my-6'>
      {stats.map((stat, idx) => (
        <motion.button
          key={idx}
          onClick={stat.onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='bg-[var(--bg-secondary)] rounded-lg p-4 text-center hover:bg-[var(--bg-tertiary)] transition-colors'
        >
          <div className='text-2xl font-bold text-[var(--accent-primary)]'>
            {stat.value}
          </div>
          <div className='text-sm text-[var(--text-secondary)] mt-2'>
            {stat.label}
          </div>
        </motion.button>
      ))}
    </div>
  )
}
