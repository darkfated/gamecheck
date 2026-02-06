import { AnimatePresence, motion } from 'framer-motion'
import { FC, useState } from 'react'
import { ActivityFeed } from '../components/feed/ActivityFeed'
import { FeedGuest } from '../components/feed/FeedGuest'
import { FeedHeader } from '../components/feed/FeedHeader'
import { FeedRecentGames } from '../components/feed/FeedRecentGames'
import { FeedTopPlayers } from '../components/feed/FeedTopPlayers'
import { FeedUserSearch } from '../components/feed/FeedUserSearch'
import { Tabs } from '../components/ui/Tabs'
import { useAuth } from '../contexts/AuthContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren' as const,
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const Feed: FC = () => {
  const { user, login } = useAuth()
  const [activeTab, setActiveTab] = useState<'following' | 'all'>('following')
  const [activityCount, setActivityCount] = useState(0)

  const feedTabs = [
    {
      id: 'following',
      label: 'Подписки',
      icon: (
        <svg
          className='w-5 h-5'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      ),
    },
    {
      id: 'all',
      label: 'Все активности',
      icon: (
        <svg
          className='w-5 h-5'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
          />
        </svg>
      ),
    },
  ]

  if (!user) {
    return <FeedGuest onLogin={login} />
  }

  return (
    <motion.div
      className='container mx-auto px-4 py-8'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.div className='mb-8 space-y-6' variants={itemVariants}>
        <FeedHeader
          userId={user.id}
          displayName={user.displayName}
          activityCount={activityCount}
        />
      </motion.div>

      <motion.div
        className='mb-8 border-b border-[var(--border-color)] pb-4'
        variants={itemVariants}
      >
        <Tabs
          tabs={feedTabs}
          activeTab={activeTab}
          onChange={tabId => setActiveTab(tabId as 'following' | 'all')}
          layoutId='feed-tabs'
          size='md'
        />
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <motion.div className='lg:col-span-2 space-y-6' variants={itemVariants}>
          <FeedRecentGames userId={user.id} />

          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              <ActivityFeed
                showFollowingOnly={activeTab === 'following'}
                onCountChange={setActivityCount}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className='space-y-8'>
          <motion.div variants={itemVariants}>
            <FeedUserSearch />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeedTopPlayers />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Feed
