import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArcadeGlyph } from './icons/ArcadeGlyph'
import { Button } from './ui/Button'

const Navbar: FC = () => {
  const { user, login, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const isActive = (path: string): boolean => {
    if (path === '/library') {
      return location.pathname.startsWith('/library')
    }
    return location.pathname === path
  }

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.nav
      className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 border-b border-[var(--border-color)]`}
      style={{
        backgroundColor: scrolled
          ? 'rgba(var(--bg-secondary-rgb), 0.9)'
          : 'rgba(var(--bg-secondary-rgb), 0.7)',
        boxShadow: scrolled ? '0 4px 20px -1px rgba(0, 0, 0, 0.15)' : 'none',
        borderColor: 'rgba(var(--accent-primary-rgb), 0.1)',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-8'>
            <Link
              to='/'
              className='text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 hover:from-cyan-300 hover:via-teal-300 hover:to-amber-300 transition-all duration-300'
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 mr-2 rounded-lg bg-gradient-to-br from-cyan-500 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-cyan-500/20'>
                  <ArcadeGlyph className='h-5 w-5 text-white' />
                </div>
                GameCheck
              </div>
            </Link>

            <LayoutGroup>
              <div className='hidden md:flex space-x-2'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className='relative'>
                    {isActive('/') && (
                      <motion.div
                        layoutId='nav-active'
                        className='absolute inset-0 rounded-xl'
                        style={{
                          background:
                            'linear-gradient(to right, rgba(var(--accent-primary-rgb), 0.22), rgba(var(--accent-secondary-rgb), 0.18))',
                          boxShadow:
                            '0 6px 14px -4px rgba(var(--accent-primary-rgb), 0.35)',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <Link
                      to='/'
                      className={`relative z-10 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive('/')
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'></path>
                      </svg>
                      Лента
                    </Link>
                  </div>
                </motion.div>

                {user && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className='relative'>
                      {isActive(`/profile/${user.id}`) && (
                        <motion.div
                          layoutId='nav-active'
                          className='absolute inset-0 rounded-xl'
                          style={{
                            background:
                              'linear-gradient(to right, rgba(var(--accent-primary-rgb), 0.22), rgba(var(--accent-secondary-rgb), 0.18))',
                            boxShadow:
                              '0 6px 14px -4px rgba(var(--accent-primary-rgb), 0.35)',
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      <Link
                        to={`/profile/${user.id}`}
                        className={`relative z-10 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          isActive(`/profile/${user.id}`)
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                        </svg>
                        Профиль
                      </Link>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className='relative'>
                    {isActive('/users') && (
                      <motion.div
                        layoutId='nav-active'
                        className='absolute inset-0 rounded-xl'
                        style={{
                          background:
                            'linear-gradient(to right, rgba(var(--accent-primary-rgb), 0.22), rgba(var(--accent-secondary-rgb), 0.18))',
                          boxShadow:
                            '0 6px 14px -4px rgba(var(--accent-primary-rgb), 0.35)',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <Link
                      to='/users'
                      className={`relative z-10 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive('/users')
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path d='M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'></path>
                      </svg>
                      Пользователи
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className='relative'>
                    {isActive('/quizzes') && (
                      <motion.div
                        layoutId='nav-active'
                        className='absolute inset-0 rounded-xl'
                        style={{
                          background:
                            'linear-gradient(to right, rgba(var(--accent-primary-rgb), 0.22), rgba(var(--accent-secondary-rgb), 0.18))',
                          boxShadow:
                            '0 6px 14px -4px rgba(var(--accent-primary-rgb), 0.35)',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <Link
                      to='/quizzes'
                      className={`relative z-10 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive('/quizzes')
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'></path>
                      </svg>
                      Тесты
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className='relative'>
                    {isActive('/library') && (
                      <motion.div
                        layoutId='nav-active'
                        className='absolute inset-0 rounded-xl'
                        style={{
                          background:
                            'linear-gradient(to right, rgba(var(--accent-primary-rgb), 0.22), rgba(var(--accent-secondary-rgb), 0.18))',
                          boxShadow:
                            '0 6px 14px -4px rgba(var(--accent-primary-rgb), 0.35)',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <Link
                      to='/library'
                      className={`relative z-10 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive('/library')
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <svg
                        className='w-4 h-4'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M15.0001 2.25C15.4143 2.25 15.7501 2.58579 15.7501 3V4C15.7501 4.9665 14.9666 5.75 14.0001 5.75H13.0001C12.862 5.75 12.7501 5.86193 12.7501 6V6.25H13.2829C14.5963 6.24999 15.6372 6.24998 16.477 6.33283C17.3395 6.41791 18.0599 6.59536 18.7113 6.99393C19.0195 7.1825 19.3059 7.40357 19.5654 7.65336C20.1157 8.183 20.4603 8.83075 20.7436 9.63414C21.0186 10.4138 21.2561 11.4025 21.5545 12.6449L22.649 17.2015C23.132 19.2123 21.8438 21.1948 19.822 21.6539C18.12 22.0404 16.3544 21.2355 15.5735 19.6838L15.4455 19.4294C15.0058 18.5559 14.0854 17.9899 13.0637 17.9899H10.9364C9.91472 17.9899 8.9943 18.5559 8.55464 19.4294L8.42664 19.6838C7.6457 21.2355 5.88015 22.0404 4.17812 21.6539C2.15636 21.1948 0.868081 19.2123 1.3511 17.2015L2.44558 12.645C2.74401 11.4026 2.98151 10.4138 3.2565 9.63413C3.53987 8.83075 3.88444 8.183 4.4347 7.65336C4.6942 7.40357 4.98067 7.1825 5.28887 6.99393C5.94027 6.59536 6.66067 6.41791 7.52311 6.33283C8.36293 6.24998 9.40388 6.24999 10.7173 6.25H11.2501V6C11.2501 5.0335 12.0336 4.25 13.0001 4.25H14.0001C14.1381 4.25 14.2501 4.13807 14.2501 4V3C14.2501 2.58579 14.5859 2.25 15.0001 2.25ZM10.7569 7.75C9.39504 7.75 8.428 7.75085 7.67036 7.82559C6.9269 7.89893 6.45599 8.03831 6.07175 8.27342C5.85575 8.40558 5.65565 8.56011 5.47492 8.73407C5.15541 9.04161 4.91178 9.45069 4.67109 10.1331C4.42498 10.8308 4.20471 11.7438 3.89445 13.0355L2.80961 17.5518C2.52993 18.7162 3.26907 19.9093 4.51029 20.1911C5.5599 20.4295 6.62483 19.9273 7.08676 19.0094L7.21476 18.7551C7.91626 17.3613 9.36384 16.4899 10.9364 16.4899H13.0637C14.6363 16.4899 16.0839 17.3613 16.7854 18.7551L16.9134 19.0094C17.3753 19.9273 18.4402 20.4295 19.4898 20.1911C20.7311 19.9093 21.4702 18.7162 21.1905 17.5518L20.1057 13.0355C19.7954 11.7439 19.5752 10.8308 19.329 10.1331C19.0884 9.45069 18.8447 9.04161 18.5252 8.73407C18.3445 8.56011 18.1444 8.40558 17.9284 8.27342C17.5441 8.03831 17.0732 7.89893 16.3298 7.82559C15.5721 7.75085 14.6051 7.75 13.2432 7.75H10.7569ZM8.50007 10.25C8.91428 10.25 9.25007 10.5858 9.25007 11V11.75H10.0001C10.4143 11.75 10.7501 12.0858 10.7501 12.5C10.7501 12.9142 10.4143 13.25 10.0001 13.25H9.25007V14C9.25007 14.4142 8.91428 14.75 8.50007 14.75C8.08585 14.75 7.75007 14.4142 7.75007 14V13.25H7.00007C6.58585 13.25 6.25007 12.9142 6.25007 12.5C6.25007 12.0858 6.58585 11.75 7.00007 11.75H7.75007V11C7.75007 10.5858 8.08585 10.25 8.50007 10.25Z'
                        />
                        <path d='M16.0001 11C16.0001 11.5523 15.5524 12 15.0001 12C14.4478 12 14.0001 11.5523 14.0001 11C14.0001 10.4477 14.4478 10 15.0001 10C15.5524 10 16.0001 10.4477 16.0001 11Z' />
                        <path d='M18.0001 14C18.0001 14.5523 17.5524 15 17.0001 15C16.4478 15 16.0001 14.5523 16.0001 14C16.0001 13.4477 16.4478 13 17.0001 13C17.5524 13 18.0001 13.4477 18.0001 14Z' />
                      </svg>
                      Библиотека
                    </Link>
                  </div>
                </motion.div>
              </div>
            </LayoutGroup>
          </div>

          <div className='flex items-center space-x-4'>
            {user ? (
              <>
                <Link
                  to={`/profile/${user.id}`}
                  className='hidden md:flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
                  aria-label='Открыть профиль'
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className='w-8 h-8 rounded-full'
                  />
                  <span className='max-w-[140px] truncate'>
                    {user.displayName}
                  </span>
                </Link>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    onClick={logout}
                    variant='outline'
                    size='sm'
                    className='text-red-400 border-red-500/30 hover:border-red-400/60'
                  >
                    Выход
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Button onClick={login} variant='primary' size='sm'>
                  Вход
                </Button>
              </motion.div>
            )}

            {/* Мобильное меню кнопка */}
            <button
              className='md:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className='w-6 h-6 text-[var(--text-primary)]'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='md:hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)]'
            >
              <div className='px-4 py-4 space-y-2'>
                <Link
                  to='/'
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
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
                      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                    />
                  </svg>
                  <span className='font-medium'>Лента</span>
                </Link>

                {user && (
                  <Link
                    to={`/profile/${user.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(`/profile/${user.id}`)
                        ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
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
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                    <span className='font-medium'>Профиль</span>
                  </Link>
                )}

                <Link
                  to='/users'
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive('/users')
                      ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
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
                      d='M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                  <span className='font-medium'>Пользователи</span>
                </Link>

                <Link
                  to='/quizzes'
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive('/quizzes')
                      ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
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
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                    />
                  </svg>
                  <span className='font-medium'>Тесты</span>
                </Link>

                <Link
                  to='/library'
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive('/library')
                      ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <svg
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M15.0001 2.25C15.4143 2.25 15.7501 2.58579 15.7501 3V4C15.7501 4.9665 14.9666 5.75 14.0001 5.75H13.0001C12.862 5.75 12.7501 5.86193 12.7501 6V6.25H13.2829C14.5963 6.24999 15.6372 6.24998 16.477 6.33283C17.3395 6.41791 18.0599 6.59536 18.7113 6.99393C19.0195 7.1825 19.3059 7.40357 19.5654 7.65336C20.1157 8.183 20.4603 8.83075 20.7436 9.63414C21.0186 10.4138 21.2561 11.4025 21.5545 12.6449L22.649 17.2015C23.132 19.2123 21.8438 21.1948 19.822 21.6539C18.12 22.0404 16.3544 21.2355 15.5735 19.6838L15.4455 19.4294C15.0058 18.5559 14.0854 17.9899 13.0637 17.9899H10.9364C9.91472 17.9899 8.9943 18.5559 8.55464 19.4294L8.42664 19.6838C7.6457 21.2355 5.88015 22.0404 4.17812 21.6539C2.15636 21.1948 0.868081 19.2123 1.3511 17.2015L2.44558 12.645C2.74401 11.4026 2.98151 10.4138 3.2565 9.63413C3.53987 8.83075 3.88444 8.183 4.4347 7.65336C4.6942 7.40357 4.98067 7.1825 5.28887 6.99393C5.94027 6.59536 6.66067 6.41791 7.52311 6.33283C8.36293 6.24998 9.40388 6.24999 10.7173 6.25H11.2501V6C11.2501 5.0335 12.0336 4.25 13.0001 4.25H14.0001C14.1381 4.25 14.2501 4.13807 14.2501 4V3C14.2501 2.58579 14.5859 2.25 15.0001 2.25ZM10.7569 7.75C9.39504 7.75 8.428 7.75085 7.67036 7.82559C6.9269 7.89893 6.45599 8.03831 6.07175 8.27342C5.85575 8.40558 5.65565 8.56011 5.47492 8.73407C5.15541 9.04161 4.91178 9.45069 4.67109 10.1331C4.42498 10.8308 4.20471 11.7438 3.89445 13.0355L2.80961 17.5518C2.52993 18.7162 3.26907 19.9093 4.51029 20.1911C5.5599 20.4295 6.62483 19.9273 7.08676 19.0094L7.21476 18.7551C7.91626 17.3613 9.36384 16.4899 10.9364 16.4899H13.0637C14.6363 16.4899 16.0839 17.3613 16.7854 18.7551L16.9134 19.0094C17.3753 19.9273 18.4402 20.4295 19.4898 20.1911C20.7311 19.9093 21.4702 18.7162 21.1905 17.5518L20.1057 13.0355C19.7954 11.7439 19.5752 10.8308 19.329 10.1331C19.0884 9.45069 18.8447 9.04161 18.5252 8.73407C18.3445 8.56011 18.1444 8.40558 17.9284 8.27342C17.5441 8.03831 17.0732 7.89893 16.3298 7.82559C15.5721 7.75085 14.6051 7.75 13.2432 7.75H10.7569ZM8.50007 10.25C8.91428 10.25 9.25007 10.5858 9.25007 11V11.75H10.0001C10.4143 11.75 10.7501 12.0858 10.7501 12.5C10.7501 12.9142 10.4143 13.25 10.0001 13.25H9.25007V14C9.25007 14.4142 8.91428 14.75 8.50007 14.75C8.08585 14.75 7.75007 14.4142 7.75007 14V13.25H7.00007C6.58585 13.25 6.25007 12.9142 6.25007 12.5C6.25007 12.0858 6.58585 11.75 7.00007 11.75H7.75007V11C7.75007 10.5858 8.08585 10.25 8.50007 10.25Z'
                    />
                    <path d='M16.0001 11C16.0001 11.5523 15.5524 12 15.0001 12C14.4478 12 14.0001 11.5523 14.0001 11C14.0001 10.4477 14.4478 10 15.0001 10C15.5524 10 16.0001 10.4477 16.0001 11Z' />
                    <path d='M18.0001 14C18.0001 14.5523 17.5524 15 17.0001 15C16.4478 15 16.0001 14.5523 16.0001 14C16.0001 13.4477 16.4478 13 17.0001 13C17.5524 13 18.0001 13.4477 18.0001 14Z' />
                  </svg>
                  <span className='font-medium'>Библиотека</span>
                </Link>

                {user && (
                  <div className='border-t border-[var(--border-color)] mt-4 pt-4'>
                    <Link
                      to={`/profile/${user.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className='flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className='w-8 h-8 rounded-full'
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>
                          {user.displayName}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
