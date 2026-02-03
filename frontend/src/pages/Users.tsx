import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface User {
  id: string
  displayName: string
  avatarUrl: string
  gamesCount?: number
  totalPlaytime?: number
  averageRating?: number
  followersCount?: number
  isOnline?: boolean
  discordTag?: string
  createdAt?: string | number
  verified?: boolean
}

interface UsersListResponse {
  data: User[]
  total: number
  limit: number
  offset: number
}

const formatHours = (minutes?: number) => `${Math.round((minutes || 0) / 60)} ч`

const Users: FC = () => {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(12)

  const [sortBy, setSortBy] = useState<
    'createdAt' | 'totalPlaytime' | 'averageRating'
  >('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all')
  const [followingIds, setFollowingIds] = useState<Record<string, boolean>>({})

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const requestRef = useRef(0)

  const totalPages = Math.max(1, Math.ceil(total / limit))

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 200)
    return () => clearTimeout(t)
  }, [searchQuery])

  const fetchUsers = async (offset: number) => {
    const req = ++requestRef.current
    const initialLoad = users.length === 0
    try {
      if (initialLoad) setLoading(true)
      setIsFetching(true)
      setError(null)
      const response = await api.users.listUsers(limit, offset, sortBy, order)
      if (requestRef.current !== req) return
      const payload: UsersListResponse = response.data
      setUsers(payload.data || [])
      setTotal(payload.total || 0)
    } catch (err: any) {
      if (requestRef.current !== req) return
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Ошибка при загрузке пользователей'
      )
      setUsers([])
      setTotal(0)
    } finally {
      if (requestRef.current === req) {
        setIsFetching(false)
        if (initialLoad) setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchUsers(page * limit)
  }, [page, limit, sortBy, order])

  useEffect(() => {
    let mounted = true
    const loadFollowing = async () => {
      if (!currentUser) return
      try {
        const res = await api.subscriptions.getFollowing(currentUser.id)
        if (!mounted) return
        const map: Record<string, boolean> = {}
        res.data.forEach((u: { id: string }) => (map[u.id] = true))
        setFollowingIds(map)
      } catch {
        if (!mounted) return
        setFollowingIds({})
      }
    }
    loadFollowing()
    return () => {
      mounted = false
    }
  }, [currentUser])

  const handleSortChange = (newSort: typeof sortBy) => {
    if (newSort === sortBy) {
      setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(newSort)
      setOrder('desc')
    }
    setPage(0)
  }

  const baseList = useMemo(() => {
    return activeTab === 'following'
      ? users.filter(u => followingIds[u.id])
      : users
  }, [users, activeTab, followingIds])

  const filteredUsers = useMemo(() => {
    if (!debouncedQuery) return baseList
    const q = debouncedQuery.toLowerCase()
    return baseList.filter(
      u =>
        u.displayName.toLowerCase().includes(q) ||
        (u.discordTag ?? '').toLowerCase().includes(q)
    )
  }, [baseList, debouncedQuery])

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers]
    const getTime = (val?: string | number) => {
      if (!val) return 0
      const n = typeof val === 'number' ? val : Date.parse(String(val))
      return Number.isNaN(n) ? 0 : n
    }
    const cmp = (a: User, b: User) => {
      if (sortBy === 'averageRating') {
        return (a.averageRating ?? 0) - (b.averageRating ?? 0)
      }
      if (sortBy === 'totalPlaytime') {
        return (a.totalPlaytime ?? 0) - (b.totalPlaytime ?? 0)
      }
      return getTime(a.createdAt) - getTime(b.createdAt)
    }
    list.sort((a, b) => (order === 'asc' ? cmp(a, b) : -cmp(a, b)))
    return list
  }, [filteredUsers, sortBy, order])

  const rankedUsers = useMemo(
    () => sortedUsers.map((u, idx) => ({ ...u, rank: page * limit + idx + 1 })),
    [sortedUsers, page, limit]
  )

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
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className='bg-[var(--bg-primary)]'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='container mx-auto px-4 py-8 relative'>
        <motion.div className='mb-6' variants={itemVariants}>
          <h1 className='text-3xl sm:text-4xl font-bold text-[var(--text-primary)]'>
            Игроки
          </h1>
          <div className='mt-2 flex items-center gap-3'>
            <p className='text-sm text-[var(--text-secondary)]'>
              Всего пользователей: <span className='font-medium'>{total}</span>
            </p>
            {isFetching && (
              <span className='text-xs text-[var(--text-secondary)]'>
                Обновление...
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          className='flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between mb-6'
          variants={itemVariants}
        >
          <div style={{ overflowX: 'visible' }}>
            <LayoutGroup>
              <div className='flex gap-3 items-center relative'>
                <div className='relative'>
                  {activeTab === 'following' && (
                    <motion.div
                      layoutId='users-active-tab'
                      className='absolute rounded-xl pointer-events-none'
                      style={{
                        top: 4,
                        bottom: 4,
                        left: 4,
                        right: 4,
                        borderRadius: 14,
                        background:
                          'linear-gradient(to right, rgba(99, 102, 241, 0.18), rgba(168, 85, 247, 0.18), rgba(217, 70, 239, 0.18))',
                        boxShadow: '0 8px 20px -10px rgba(99, 102, 241, 0.12)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 28,
                      }}
                    />
                  )}

                  <button
                    onClick={() => setActiveTab('following')}
                    className={`relative z-10 px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      activeTab === 'following'
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
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
                  </button>
                </div>

                <div className='relative'>
                  {activeTab === 'all' && (
                    <motion.div
                      layoutId='users-active-tab'
                      className='absolute rounded-xl pointer-events-none'
                      style={{
                        top: 4,
                        bottom: 4,
                        left: 4,
                        right: 4,
                        borderRadius: 14,
                        background:
                          'linear-gradient(to right, rgba(99, 102, 241, 0.18), rgba(168, 85, 247, 0.18), rgba(217, 70, 239, 0.18))',
                        boxShadow: '0 8px 20px -10px rgba(99, 102, 241, 0.12)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 28,
                      }}
                    />
                  )}

                  <button
                    onClick={() => setActiveTab('all')}
                    className={`relative z-10 px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      activeTab === 'all'
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
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
                    Все игроки
                  </button>
                </div>
              </div>
            </LayoutGroup>
          </div>

          <motion.div
            className='w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-3'
            variants={itemVariants}
          >
            <div className='flex-1'>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Поиск по имени или тегу'
                className='w-full md:w-[260px] lg:w-[290px] h-12 px-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] shadow-inner transition'
              />
            </div>

            <div className='flex items-center gap-2'>
              <div className='h-12 flex items-center gap-2 bg-transparent'>
                <button
                  onClick={() => handleSortChange('createdAt')}
                  className={`h-10 px-4 rounded-md text-sm border ${sortBy === 'createdAt' ? 'border-[var(--accent-primary)] bg-[var(--bg-tertiary)]' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'}`}
                >
                  Дата
                </button>
                <button
                  onClick={() => handleSortChange('totalPlaytime')}
                  className={`h-10 px-4 rounded-md text-sm border ${sortBy === 'totalPlaytime' ? 'border-[var(--accent-primary)] bg-[var(--bg-tertiary)]' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'}`}
                >
                  Время
                </button>
                <button
                  onClick={() => handleSortChange('averageRating')}
                  className={`h-10 px-4 rounded-md text-sm border ${sortBy === 'averageRating' ? 'border-[var(--accent-primary)] bg-[var(--bg-tertiary)]' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'}`}
                >
                  Рейтинг
                </button>
              </div>

              <select
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value))
                  setPage(0)
                }}
                className='h-10 px-4 rounded-md text-sm border border-[var(--border-color)] bg-[var(--bg-secondary)]'
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={
              activeTab + '-' + page + '-' + limit + '-' + sortBy + '-' + order
            }
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {loading && page === 0 ? (
                Array.from({ length: Math.max(3, limit / 3) }).map((_, i) => (
                  <div
                    key={i}
                    className='animate-pulse bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-full bg-[var(--bg-tertiary)]' />
                      <div className='flex-1 space-y-2'>
                        <div className='h-4 bg-[var(--bg-tertiary)] rounded w-3/4' />
                        <div className='h-3 bg-[var(--bg-tertiary)] rounded w-1/2' />
                      </div>
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className='col-span-full bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-6 shadow'>
                  <p className='text-red-400 font-semibold mb-3'>Ошибка</p>
                  <p className='text-[var(--text-secondary)] mb-5'>{error}</p>
                  <div>
                    <button
                      onClick={() => fetchUsers(page * limit)}
                      className='px-5 py-2 rounded-md bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20'
                    >
                      Повторить
                    </button>
                  </div>
                </div>
              ) : rankedUsers.length === 0 ? (
                <div className='col-span-full bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-color)]'>
                  <p className='text-[var(--text-secondary)]'>
                    Пользователей не найдено.
                  </p>
                </div>
              ) : (
                rankedUsers.map(u => (
                  <motion.div
                    key={u.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    whileHover={{ scale: 1.01 }}
                    className='group bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)] flex items-center gap-4'
                  >
                    <div className='relative flex-shrink-0'>
                      <div className='absolute -left-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'>
                        {u.rank}
                      </div>
                      <img
                        src={u.avatarUrl}
                        alt={u.displayName}
                        className='w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-1 ring-[var(--border-color)] object-cover'
                      />
                      {u.isOnline && (
                        <span className='absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] bg-green-400' />
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-3'>
                        <div className='min-w-0'>
                          <Link
                            to={`/profile/${u.id}`}
                            className='font-semibold text-[var(--text-primary)] truncate'
                          >
                            {u.displayName}
                          </Link>
                          <div className='text-xs text-[var(--text-secondary)] mt-1 truncate'>
                            {u.discordTag ??
                              `${u.followersCount ?? 0} подписчиков`}
                          </div>
                        </div>

                        <div className='hidden sm:flex sm:flex-col sm:items-end sm:gap-1'>
                          <div className='text-xs text-[var(--text-secondary)]'>
                            Игры
                          </div>
                          <div className='font-semibold text-[var(--accent-primary)] text-sm'>
                            {u.gamesCount ?? 0}
                          </div>
                        </div>
                      </div>

                      <div className='mt-2 flex items-center justify-between gap-3'>
                        <div className='text-xs text-[var(--text-secondary)]'>
                          Рейтинг{' '}
                          <span className='font-semibold text-[var(--text-primary)] ml-1'>
                            {(u.averageRating ?? 0).toFixed(1)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='text-xs text-[var(--text-secondary)]'>
                            {formatHours(u.totalPlaytime)}
                          </div>
                          <Link
                            to={`/profile/${u.id}`}
                            className='px-3 py-1 rounded-md text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                          >
                            Открыть
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='text-sm text-[var(--text-secondary)]'>
            Страница <span className='font-medium'>{page + 1}</span> из{' '}
            <span className='font-medium'>{totalPages}</span>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            >
              ⏮
            </button>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            >
              ←
            </button>

            <div className='hidden sm:flex items-center gap-1'>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = 0
                if (totalPages <= 5) pageNum = i
                else {
                  const start = Math.max(0, Math.min(page - 2, totalPages - 5))
                  pageNum = start + i
                }
                if (pageNum >= totalPages) return null
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-md ${pageNum === page ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border-color)]'}`}
                  >
                    {pageNum + 1}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            >
              →
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Users
