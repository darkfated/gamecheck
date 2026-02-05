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

  const handleLibraryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }

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
                    <a
                      href='#'
                      onClick={handleLibraryClick}
                      className={`relative z-10 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] opacity-70`}
                      style={{
                        cursor: 'not-allowed',
                      }}
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
                        <path d='M12 6.253v13m0-13C6.228 6.253 2.092 7.371 2.092 8.5c0 1.128 4.136 2.247 9.908 2.247m0-13c5.771 0 9.908 1.119 9.908 2.247c0 1.128-4.136 2.247-9.908 2.247m0 13c-5.771 0-9.908-1.119-9.908-2.247c0-1.128 4.136-2.247 9.908-2.247m0 0c5.771 0 9.908 1.119 9.908 2.247c0 1.128-4.136 2.247-9.908 2.247'></path>
                      </svg>
                      Библиотека (недоступно)
                    </a>
                  </div>
                </motion.div>
              </div>
            </LayoutGroup>
          </div>

          <div className='flex items-center space-x-4'>
            {user ? (
              <>
                <div className='hidden md:flex items-center space-x-2'>
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className='w-8 h-8 rounded-full'
                  />
                  <span className='text-sm text-[var(--text-secondary)]'>
                    {user.displayName}
                  </span>
                </div>
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

                <a
                  href='#'
                  onClick={handleLibraryClick}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] opacity-50 cursor-not-allowed'
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
                      d='M12 6.253v13m0-13C6.228 6.253 2.092 7.371 2.092 8.5c0 1.128 4.136 2.247 9.908 2.247m0-13c5.771 0 9.908 1.119 9.908 2.247c0 1.128-4.136 2.247-9.908 2.247m0 13c-5.771 0-9.908-1.119-9.908-2.247c0-1.128 4.136-2.247 9.908-2.247m0 0c5.771 0 9.908 1.119 9.908 2.247c0 1.128-4.136 2.247-9.908 2.247'
                    />
                  </svg>
                  <span className='font-medium'>Библиотека (недоступно)</span>
                </a>

                {user && (
                  <div className='border-t border-[var(--border-color)] mt-4 pt-4'>
                    <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-tertiary)]'>
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className='w-8 h-8 rounded-full'
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
                          {user.displayName}
                        </p>
                      </div>
                    </div>
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
