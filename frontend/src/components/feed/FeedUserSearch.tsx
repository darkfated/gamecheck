import { AnimatePresence, motion } from 'framer-motion'
import React, { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'

interface User {
  id: string
  displayName: string
  avatarUrl: string
  profileUrl?: string
  totalPlaytime?: number
}

export const FeedUserSearch: FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchAttempted, setSearchAttempted] = useState(false)

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

  return (
    <div className='space-y-8'>
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
    </div>
  )
}
