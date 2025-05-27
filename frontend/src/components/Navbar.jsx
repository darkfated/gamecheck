import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const isActive = path => {
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

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Временный обработчик для неактивных ссылок
  const handleLibraryClick = e => {
    e.preventDefault()
  }

  return (
    <motion.nav
      className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 
        border-b border-[var(--border-color)]`}
      style={{
        backgroundColor: scrolled
          ? "rgba(var(--bg-secondary-rgb), 0.9)"
          : "rgba(var(--bg-secondary-rgb), 0.7)",
        boxShadow: scrolled ? "0 4px 20px -1px rgba(0, 0, 0, 0.15)" : "none",
        borderColor: "rgba(var(--accent-primary-rgb), 0.1)",
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-8'>
            <Link
              to='/'
              className='text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 transition-all duration-300'
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 mr-2 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
                    />
                  </svg>
                </div>
                GameCheck
              </div>
            </Link>

            {/* Навигация по разделам - только для десктопа */}
            <div className='hidden md:flex space-x-2'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to='/'
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive("/")
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  style={{
                    background: isActive("/")
                      ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))"
                      : "none",
                    boxShadow: isActive("/")
                      ? "0 4px 10px -1px rgba(99, 102, 241, 0.2)"
                      : "none",
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
                    <path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'></path>
                  </svg>
                  Лента
                </Link>
              </motion.div>

              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to={`/profile/${user.id}`}
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive(`/profile/${user.id}`)
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                    style={{
                      background: isActive(`/profile/${user.id}`)
                        ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))"
                        : "none",
                      boxShadow: isActive(`/profile/${user.id}`)
                        ? "0 4px 10px -1px rgba(99, 102, 241, 0.2)"
                        : "none",
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
                      <path d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                    </svg>
                    Профиль
                  </Link>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to='/quizzes'
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive("/quizzes")
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  style={{
                    background: isActive("/quizzes")
                      ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))"
                      : "none",
                    boxShadow: isActive("/quizzes")
                      ? "0 4px 10px -1px rgba(99, 102, 241, 0.2)"
                      : "none",
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
                    <path d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'></path>
                  </svg>
                  Тесты
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <a
                  href='#'
                  onClick={handleLibraryClick}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] opacity-70`}
                  style={{
                    cursor: "not-allowed",
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
                    <path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'></path>
                  </svg>
                  Библиотека
                </a>
              </motion.div>
            </div>
          </div>

          {/* Мобильная кнопка меню */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-all bg-[var(--bg-tertiary)]/20 hover:bg-[var(--bg-tertiary)]/50'
            aria-label='Открыть меню'
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </motion.button>

          {/* Десктопное меню */}
          <div className='hidden md:flex items-center gap-4'>
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    to={`/profile/${user.id}`}
                    className='flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 bg-gradient-to-r from-[var(--card-bg)] to-[var(--bg-tertiary)]/50 hover:shadow-md border border-[var(--border-color)]'
                  >
                    <div className='relative'>
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className='w-8 h-8 rounded-full ring-2 object-cover'
                        style={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
                      />
                      <span className='absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-[var(--bg-secondary)]'></span>
                    </div>
                    <span className='text-[var(--text-primary)] font-medium'>
                      {user.displayName}
                    </span>
                  </Link>
                </motion.div>
                <motion.button
                  onClick={logout}
                  className='px-4 py-2 text-sm text-red-400 rounded-xl transition-all duration-200 hover:shadow-md flex items-center gap-1 border border-red-400/20 bg-red-400/10 hover:bg-red-400/20'
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                  Выйти
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={login}
                className='flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                  />
                </svg>
                Войти через Steam
              </motion.button>
            )}
          </div>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className='md:hidden py-4 border-t'
              style={{ borderColor: "rgba(var(--accent-primary-rgb), 0.1)" }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='space-y-3 mb-4'>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to='/'
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      isActive("/")
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                    style={{
                      background: isActive("/")
                        ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))"
                        : "none",
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className='w-5 h-5'
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
                </motion.div>

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to={`/profile/${user.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                        isActive(`/profile/${user.id}`)
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                      style={{
                        background: isActive(`/profile/${user.id}`)
                          ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))"
                          : "none",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg
                        className='w-5 h-5'
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
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link
                    to='/quizzes'
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      isActive("/quizzes")
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                    style={{
                      background: isActive("/quizzes")
                        ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2))"
                        : "none",
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className='w-5 h-5'
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <a
                    href='#'
                    onClick={handleLibraryClick}
                    className='flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--text-secondary)] opacity-70'
                    style={{
                      cursor: "not-allowed",
                    }}
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'></path>
                    </svg>
                    Библиотека
                  </a>
                </motion.div>
              </div>

              {user ? (
                <motion.div
                  className='space-y-4'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div
                    className='flex items-center gap-3 p-4 rounded-xl'
                    style={{
                      background:
                        "linear-gradient(to right, rgba(var(--bg-tertiary-rgb), 0.3), rgba(var(--bg-tertiary-rgb), 0.1))",
                      borderWidth: "1px",
                      borderColor: "rgba(var(--accent-primary-rgb), 0.1)",
                    }}
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className='w-10 h-10 rounded-full ring-2 object-cover'
                      style={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
                    />
                    <div>
                      <span className='text-[var(--text-primary)] font-medium block'>
                        {user.displayName}
                      </span>
                      <span className='text-[var(--text-tertiary)] text-sm flex items-center gap-1'>
                        <span className='inline-block w-2 h-2 bg-green-500 rounded-full'></span>
                        Онлайн
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className='w-full px-4 py-3 text-sm text-red-400 rounded-xl flex items-center justify-center gap-2 transition-all duration-300'
                    style={{
                      background:
                        "linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.2))",
                      borderWidth: "1px",
                      borderColor: "rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                    Выйти из аккаунта
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => {
                    login()
                    setIsMenuOpen(false)
                  }}
                  className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                    />
                  </svg>
                  Войти через Steam
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
