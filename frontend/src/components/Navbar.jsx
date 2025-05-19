import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

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

  return (
    <nav
      className={`sticky top-0 z-40 backdrop-blur-lg transition-all duration-300 
        border-b border-[var(--border-color)]`}
      style={{
        backgroundColor: scrolled
          ? "rgba(var(--bg-secondary-rgb), 0.9)"
          : "rgba(var(--bg-secondary-rgb), 0.7)",
        boxShadow: scrolled
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          : "none",
        borderColor: "rgba(var(--accent-primary-rgb), 0.1)",
      }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-8'>
            <Link
              to='/'
              className='text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300'
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 mr-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center'>
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
            <div className='hidden md:flex space-x-1'>
              <Link
                to='/'
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                style={{
                  background: isActive("/")
                    ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))"
                    : "none",
                }}
              >
                Лента
              </Link>
              {user && (
                <Link
                  to={`/profile/${user.id}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(`/profile/${user.id}`)
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  style={{
                    background: isActive(`/profile/${user.id}`)
                      ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))"
                      : "none",
                  }}
                >
                  Профиль
                </Link>
              )}
            </div>
          </div>

          {/* Мобильная кнопка меню */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-all'
            aria-label='Открыть меню'
            style={{
              ":hover": {
                backgroundColor: "rgba(var(--bg-tertiary-rgb), 0.5)",
              },
            }}
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
          </button>

          {/* Десктопное меню */}
          <div className='hidden md:flex items-center gap-4'>
            {user ? (
              <>
                <Link
                  to={`/profile/${user.id}`}
                  className='flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200'
                  style={{
                    ":hover": {
                      backgroundColor: "rgba(var(--bg-tertiary-rgb), 0.5)",
                    },
                  }}
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
                <button
                  onClick={logout}
                  className='px-4 py-2 text-sm text-red-400 rounded-full transition-all duration-200'
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    borderWidth: "1px",
                    borderColor: "rgba(239, 68, 68, 0.2)",
                    ":hover": {
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                    },
                  }}
                >
                  <span className='flex items-center gap-1'>
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
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className='flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
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
              </button>
            )}
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div
            className='md:hidden py-4 border-t animate-fadeIn'
            style={{ borderColor: "rgba(var(--accent-primary-rgb), 0.1)" }}
          >
            <div className='space-y-2 mb-4'>
              <Link
                to='/'
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/")
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
                style={{
                  background: isActive("/")
                    ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))"
                    : "none",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Лента
              </Link>
              {user && (
                <Link
                  to={`/profile/${user.id}`}
                  className={`block px-4 py-2 rounded-lg ${
                    isActive(`/profile/${user.id}`)
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                  style={{
                    background: isActive(`/profile/${user.id}`)
                      ? "linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))"
                      : "none",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
              )}
            </div>

            {user ? (
              <div className='space-y-4'>
                <div
                  className='flex items-center gap-3 p-3 rounded-lg'
                  style={{
                    backgroundColor: "rgba(var(--bg-tertiary-rgb), 0.2)",
                  }}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className='w-10 h-10 rounded-full ring-2'
                    style={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
                  />
                  <div>
                    <span className='text-[var(--text-primary)] font-medium block'>
                      {user.displayName}
                    </span>
                    <span className='text-[var(--text-secondary)] text-sm'>
                      Онлайн
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className='w-full px-4 py-3 text-sm text-red-400 rounded-lg flex items-center justify-center gap-2 transition-all duration-200'
                  style={{
                    background:
                      "linear-gradient(to right, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))",
                    ":hover": {
                      background:
                        "linear-gradient(to right, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))",
                    },
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
              </div>
            ) : (
              <button
                onClick={() => {
                  login()
                  setIsMenuOpen(false)
                }}
                className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md'
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
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
