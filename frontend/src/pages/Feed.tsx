import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import { ActivityFeed } from '../components/feed/ActivityFeed'
import { FeedGame, FeedGames } from '../components/feed/FeedGames'
import { FeedGuest } from '../components/feed/FeedGuest'
import { FeedHeader } from '../components/feed/FeedHeader'
import { FeedTopPlayers } from '../components/feed/FeedTopPlayers'
import { FeedUserSearch } from '../components/feed/FeedUserSearch'
import { Tabs } from '../components/ui/Tabs'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

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

const RECENT_LIMIT = 20
const POPULAR_LIMIT = 20

const normalize = (value: number, min: number, max: number) => {
  if (max <= min) return 0
  return (value - min) / (max - min)
}

const Feed: FC = () => {
  const { user, login } = useAuth()
  const [activeTab, setActiveTab] = useState<'following' | 'all'>('following')
  const [activityCount, setActivityCount] = useState(0)
  const [recentGames, setRecentGames] = useState<FeedGame[]>([])
  const [popularGames, setPopularGames] = useState<FeedGame[]>([])
  const [isLoadingRecent, setIsLoadingRecent] = useState(false)
  const [isLoadingPopular, setIsLoadingPopular] = useState(false)

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

  useEffect(() => {
    if (!user) return
    let active = true

    const loadRecentGames = async () => {
      setIsLoadingRecent(true)
      try {
        const response = await api.library.list(
          RECENT_LIMIT,
          0,
          'createdAt',
          'desc',
          '',
          ''
        )
        if (!active) return
        setRecentGames((response.data.data || []).slice(0, RECENT_LIMIT))
      } catch (error) {
        if (!active) return
        console.error('Error loading recent games:', error)
        setRecentGames([])
      } finally {
        if (active) setIsLoadingRecent(false)
      }
    }

    loadRecentGames()

    return () => {
      active = false
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    let active = true

    const loadPopularGames = async () => {
      setIsLoadingPopular(true)
      try {
        const [progressRes, ratingRes] = await Promise.all([
          api.library.list(POPULAR_LIMIT, 0, 'progress', 'desc', '', ''),
          api.library.list(POPULAR_LIMIT, 0, 'rating', 'desc', '', ''),
        ])

        const progressList = progressRes.data.data || []
        const ratingList = ratingRes.data.data || []

        const combinedMap = new Map<string, FeedGame>()
        progressList.forEach(game => combinedMap.set(game.id, game))
        ratingList.forEach(game => combinedMap.set(game.id, game))

        const combined = Array.from(combinedMap.values())
        const filtered = combined.filter(
          game => (game.progressCount || 0) > 0 || (game.averageRating || 0) > 0
        )
        const candidates = filtered.length > 0 ? filtered : combined

        const progressValues = candidates.map(game => game.progressCount || 0)
        const ratingValues = candidates.map(game => game.averageRating || 0)
        const minProgress = progressValues.length
          ? Math.min(...progressValues)
          : 0
        const maxProgress = progressValues.length
          ? Math.max(...progressValues)
          : 0
        const minRating = ratingValues.length ? Math.min(...ratingValues) : 0
        const maxRating = ratingValues.length ? Math.max(...ratingValues) : 0

        const scored = [...candidates].sort((a, b) => {
          const scoreA =
            0.5 * normalize(a.progressCount || 0, minProgress, maxProgress) +
            0.5 * normalize(a.averageRating || 0, minRating, maxRating)
          const scoreB =
            0.5 * normalize(b.progressCount || 0, minProgress, maxProgress) +
            0.5 * normalize(b.averageRating || 0, minRating, maxRating)
          return scoreB - scoreA
        })

        if (!active) return
        setPopularGames(scored.slice(0, POPULAR_LIMIT))
      } catch (error) {
        if (!active) return
        console.error('Error loading popular games:', error)
        setPopularGames([])
      } finally {
        if (active) setIsLoadingPopular(false)
      }
    }

    loadPopularGames()

    return () => {
      active = false
    }
  }, [user])

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
          <FeedGames
            title='Недавно добавленные игры'
            subtitle='Пополнения библиотеки за последние дни.'
            linkTo='/library'
            items={recentGames}
            isLoading={isLoadingRecent}
            emptyTitle='Пока нет новинок'
            emptyDescription='Добавьте игру в прогресс и библиотека обновится.'
            getMetaLabel={game => `${game.reviewsCount || 0} комментариев`}
            showRating
          />

          <FeedGames
            title='Самое популярное'
            subtitle='Учитываем количество игроков и рейтинг.'
            linkTo='/library'
            items={popularGames}
            isLoading={isLoadingPopular}
            emptyTitle='Пока нет популярных игр'
            emptyDescription='Когда появятся рейтинги и прогресс, здесь будет подборка.'
            getMetaLabel={game => `${game.progressCount || 0} игроков`}
            showRating
          />

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
