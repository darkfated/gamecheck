import { AnimatePresence, motion } from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ActivityFeed } from '../components/feed/ActivityFeed'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface User {
  id: string
  displayName: string
  avatarUrl: string
}

const Feed: FC = () => {
  const { user, login } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'following' | 'all'>('following')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren' as const,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-load')
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-fadeIn')
        }, index * 100)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const response = await api.users.searchUsers(searchQuery)
      setSearchResults(response.data)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsSearching(false)
    }
  }

  if (!user) {
    return (
      <motion.div
        className='container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-color)]'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
          style={{
            background:
              'linear-gradient(to bottom right, rgba(var(--bg-secondary-rgb), 0.9), rgba(var(--bg-tertiary-rgb), 0.9))',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-6 py-8'>
            <motion.div
              className='flex justify-center mb-4'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
                delay: 0.4,
              }}
            >
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center p-1 shadow-lg'>
                <div
                  className='w-full h-full rounded-full flex items-center justify-center'
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-10 w-10 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.h2
              className='text-2xl md:text-3xl font-bold text-white text-center'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Добро пожаловать в GameCheck!
            </motion.h2>
          </div>

          <div className='px-6 py-8'>
            <motion.p
              className='text-[var(--text-secondary)] mb-8 text-center leading-relaxed'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Войдите через Steam, чтобы отслеживать свои игры и следить за
              активностью друзей в игровом сообществе.
            </motion.p>

            <motion.div
              className='flex justify-center'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={login}
                className='px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                  />
                </svg>
                Войти через Steam
              </button>
            </motion.div>
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
      <motion.div
        className='mb-8 border-b border-[var(--border-color)] pb-4'
        variants={itemVariants}
      >
        <div className='flex space-x-2 overflow-x-auto'>
          <motion.button
            onClick={() => setActiveTab('following')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${
                activeTab === 'following'
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            style={{
              background:
                activeTab === 'following'
                  ? 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))'
                  : 'none',
              boxShadow:
                activeTab === 'following'
                  ? '0 4px 10px -1px rgba(99, 102, 241, 0.2)'
                  : 'none',
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
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
            Подписки
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${
                activeTab === 'all'
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            style={{
              background:
                activeTab === 'all'
                  ? 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))'
                  : 'none',
              boxShadow:
                activeTab === 'all'
                  ? '0 4px 10px -1px rgba(99, 102, 241, 0.2)'
                  : 'none',
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
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
            Все активности
          </motion.button>
        </div>
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <motion.div className='lg:col-span-2' variants={itemVariants}>
          <ActivityFeed showFollowingOnly={activeTab === 'following'} />
        </motion.div>

        <div className='space-y-8'>
          <motion.div
            className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)] overflow-hidden relative'
            variants={itemVariants}
          >
            <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl'></div>
            <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

            <h2 className='text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]'>
              <svg
                className='w-5 h-5 text-indigo-400'
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
                <input
                  type='text'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Поиск по имени...'
                  className='w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all shadow-inner'
                />
              </div>
              <motion.button
                type='submit'
                disabled={isSearching}
                className='w-full px-4 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center gap-2'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.button>
            </form>
          </motion.div>

          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)] overflow-hidden relative'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              >
                <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl'></div>
                <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]'>
                  <svg
                    className='w-5 h-5 text-indigo-400'
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
                      className='flex items-center gap-4 p-3 rounded-xl transition-all duration-300 transform border border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-secondary)]/60 to-[var(--bg-tertiary)]/40 hover:shadow-md'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
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
                        className='font-medium text-[var(--text-primary)] hover:text-[var(--accent-secondary)] transition-colors flex-grow'
                      >
                        {user.displayName}
                      </Link>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link
                          to={`/profile/${user.id}`}
                          className='flex items-center justify-center p-2 rounded-full hover:bg-[var(--accent-primary)]/10 transition-colors'
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default Feed
