// Feed.tsx
import { AnimatePresence, motion } from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { ActivityFeed } from '../components/feed/ActivityFeed'
import { ArcadeGlyph } from '../components/icons/ArcadeGlyph'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { SectionHeader } from '../components/ui/SectionHeader'
import { StatPill } from '../components/ui/StatPill'
import { Tabs } from '../components/ui/Tabs'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface User {
  id: string
  displayName: string
  avatarUrl: string
  profileUrl?: string
  totalPlaytime?: number
}

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
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchAttempted, setSearchAttempted] = useState(false)
  const [activeTab, setActiveTab] = useState<'following' | 'all'>('following')
  const [topPlayers, setTopPlayers] = useState<User[]>([])
  const [isLoadingTop, setIsLoadingTop] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [gamesCount, setGamesCount] = useState(0)
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchAttempted(false)
      return
    }
    setIsSearching(true)
    setSearchAttempted(true)
    try {
      const response = await api.users.searchUsers(searchQuery)
      setSearchResults(response.data)
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

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

  useEffect(() => {
    if (!user) return

    const loadStats = async () => {
      try {
        const [profileRes, gamesRes] = await Promise.all([
          api.users.getProfile(user.id),
          api.progress.getUserGames(user.id),
        ])
        setFollowersCount(profileRes.data.followersCount || 0)
        setFollowingCount(profileRes.data.followingCount || 0)
        setGamesCount(gamesRes.data.length || 0)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [user])

  if (!user) {
    return (
      <motion.div
        className='relative overflow-hidden px-4 py-12'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='absolute inset-0'>
          <div className='absolute top-10 left-8 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-8 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl'></div>
        </div>

        <motion.div
          className='relative max-w-5xl mx-auto'
          variants={itemVariants}
        >
          <div className='relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[rgba(var(--bg-secondary-rgb),0.72)] shadow-[var(--shadow-card)]'>
            <div className='absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-primary-rgb),0.12)] via-transparent to-[rgba(var(--accent-secondary-rgb),0.12)]'></div>

            <div className='relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8 lg:p-12'>
              <div className='space-y-6'>
                <div className='inline-flex items-center gap-3 rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.4)] px-4 py-2 text-sm text-[var(--text-secondary)]'>
                  <ArcadeGlyph className='w-5 h-5 text-[var(--accent-primary)]' />
                  Стартовая страница
                </div>

                <div>
                  <h2 className='text-3xl md:text-4xl font-bold text-[var(--text-primary)]'>
                    Добро пожаловать в GameCheck
                  </h2>
                  <p className='mt-3 text-[var(--text-secondary)] leading-relaxed'>
                    Подключите Steam и управляйте коллекцией, следите за
                    активностью друзей и находите новые игровые поводы.
                  </p>
                </div>

                <div className='flex flex-col sm:flex-row gap-3'>
                  <Button
                    onClick={login}
                    size='lg'
                    className='w-full sm:w-auto'
                  >
                    Войти через Steam
                  </Button>
                  <Link to='/users' className='w-full sm:w-auto'>
                    <Button variant='secondary' size='lg' className='w-full'>
                      Смотреть игроков
                    </Button>
                  </Link>
                </div>

                <div className='flex flex-wrap gap-2 text-xs text-[var(--text-tertiary)]'>
                  <span className='rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.5)] px-3 py-1'>
                    Коллекции и рейтинги
                  </span>
                  <span className='rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.5)] px-3 py-1'>
                    Без навязчивых уведомлений
                  </span>
                  <span className='rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.5)] px-3 py-1'>
                    Квизы
                  </span>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-[var(--text-secondary)]'>
                  <span>Вы также можете сменить тему интерфейса:</span>
                  <ThemeToggle />
                </div>
              </div>

              <div className='grid gap-4'>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link
                    to='/users'
                    className='group block rounded-2xl border border-[var(--card-border)] bg-[rgba(var(--bg-tertiary-rgb),0.55)] p-4 transition-all hover:border-[var(--border-color-hover)] hover:bg-[rgba(var(--bg-tertiary-rgb),0.7)]'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-sm text-[var(--text-tertiary)]'>
                          Исследуйте
                        </p>
                        <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                          Топ игроков и коллекций
                        </h3>
                      </div>
                      <span className='rounded-full bg-[rgba(var(--accent-primary-rgb),0.18)] px-3 py-1 text-xs text-[var(--accent-primary)]'>
                        Открыть
                      </span>
                    </div>
                    <p className='mt-3 text-sm text-[var(--text-secondary)]'>
                      Подглядывайте, во что играют друзья и кто собирает самые
                      редкие тайтлы.
                    </p>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link
                    to='/quizzes'
                    className='group block rounded-2xl border border-[var(--card-border)] bg-[rgba(var(--bg-tertiary-rgb),0.55)] p-4 transition-all hover:border-[var(--border-color-hover)] hover:bg-[rgba(var(--bg-tertiary-rgb),0.7)]'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-sm text-[var(--text-tertiary)]'>
                          Прокачайте знания
                        </p>
                        <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                          Игровые квизы
                        </h3>
                      </div>
                      <span className='rounded-full bg-[rgba(var(--accent-secondary-rgb),0.2)] px-3 py-1 text-xs text-[var(--accent-secondary)]'>
                        Играть
                      </span>
                    </div>
                    <p className='mt-3 text-sm text-[var(--text-secondary)]'>
                      Пройдите быстрый тест и поделитесь результатом с друзьями.
                    </p>
                  </Link>
                </motion.div>

                <motion.button
                  type='button'
                  onClick={login}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className='text-left rounded-2xl border border-[var(--card-border)] bg-[rgba(var(--bg-tertiary-rgb),0.55)] p-4 transition-all hover:border-[var(--border-color-hover)] hover:bg-[rgba(var(--bg-tertiary-rgb),0.7)]'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='text-sm text-[var(--text-tertiary)]'>
                        Начните сейчас
                      </p>
                      <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                        Синхронизация со Steam
                      </h3>
                    </div>
                    <span className='rounded-full bg-[rgba(var(--accent-primary-rgb),0.18)] px-3 py-1 text-xs text-[var(--accent-primary)]'>
                      Войти
                    </span>
                  </div>
                  <p className='mt-3 text-sm text-[var(--text-secondary)]'>
                    Данные из вашей библиотеки подтянутся и добавят информацию.
                  </p>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className='container mx-auto px-4 py-8'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.div className='mb-8 space-y-6' variants={itemVariants}>
        <SectionHeader
          title={`С возвращением, ${user.displayName}`}
          subtitle='Свежая активность, подписки и новые игроки в одном месте.'
          action={
            <Link to='/users'>
              <Button variant='secondary' size='sm'>
                Найти игроков
              </Button>
            </Link>
          }
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatPill
            label='подписки'
            value={followingCount}
            icon={
              <svg
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            }
          />
          <StatPill
            label='подписчики'
            value={followersCount}
            icon={
              <svg
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            }
          />
          <StatPill
            label='игр в коллекции'
            value={gamesCount}
            icon={
              <svg
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
                />
              </svg>
            }
          />
          <StatPill
            label='активностей'
            value={activityCount}
            icon={
              <svg
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M3 12h4l2 5 4-10 2 5h6'
                />
              </svg>
            }
          />
        </div>
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
        <motion.div className='lg:col-span-2' variants={itemVariants}>
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
            <Card variant='glass' className='relative overflow-hidden'>
              <h2 className='text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]'>
                <svg
                  className='w-5 h-5 text-[var(--accent-primary)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
                Поиск пользователей
              </h2>

              <form onSubmit={handleSearch} className='space-y-4 relative z-10'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg
                      className='w-5 h-5 text-[var(--text-tertiary)]'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                  </div>

                  <Input
                    type='text'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder='Поиск по имени...'
                    className='pl-10'
                    aria-label='Поиск пользователей'
                  />
                </div>

                <Button
                  type='submit'
                  disabled={isSearching}
                  variant='primary'
                  size='lg'
                  className='w-full'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                  {isSearching ? 'Поиск...' : 'Найти'}
                </Button>
              </form>
            </Card>
          </motion.div>

          <AnimatePresence>
            {searchResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Card variant='glass' className='relative overflow-hidden'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]'>
                    <svg
                      className='w-5 h-5 text-[var(--accent-primary)]'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    </svg>
                    Найдено игроков: {searchResults.length}
                  </h3>

                  <div className='space-y-3 relative z-10'>
                    {searchResults.map((user, index) => (
                      <motion.div
                        key={user.id}
                        className='flex items-center gap-4 p-3 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] hover:shadow-md'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName}
                          className='w-10 h-10 rounded-full ring-2 object-cover'
                          style={{
                            borderColor: 'rgba(var(--accent-primary-rgb), 0.3)',
                          }}
                        />
                        <Link
                          to={`/profile/${user.id}`}
                          className='font-medium text-[var(--text-primary)] hover:text-[var(--accent-secondary)] transition-colors flex-grow truncate'
                        >
                          {user.displayName}
                        </Link>

                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={`/profile/${user.id}`}
                            className='flex items-center justify-center p-2 rounded-full hover:bg-[rgba(var(--accent-primary-rgb),0.1)] transition-colors'
                            aria-label={`Открыть профиль ${user.displayName}`}
                          >
                            <svg
                              className='w-5 h-5 text-[var(--accent-primary)]'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5l7 7-7 7'
                              />
                            </svg>
                          </Link>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : searchAttempted && !isSearching ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Card variant='glass' className='text-center'>
                  <p className='text-[var(--text-primary)] font-medium'>
                    Никого не нашли
                  </p>
                  <p className='text-sm text-[var(--text-secondary)] mt-1'>
                    Попробуйте другое имя или тег.
                  </p>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Feed
