import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className='sticky top-0 z-40 backdrop-blur-lg bg-[#1a1f2e]/80 border-b border-[#2563eb]/10 shadow-lg'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Link
            to='/'
            className='text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-blue-400'
          >
            GameCheck
          </Link>

          {/* Мобильная кнопка меню */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 text-gray-400 hover:text-gray-300'
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
                  className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#151b27]/50 transition-all duration-200'
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className='w-8 h-8 rounded-full ring-2 ring-[#2563eb]/50'
                  />
                  <span className='text-gray-100'>{user.displayName}</span>
                </Link>
                <button
                  onClick={logout}
                  className='px-4 py-2 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-200 border border-red-500/20'
                >
                  Выйти
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className='flex items-center gap-2 px-4 py-2 bg-[#151b27]/90 text-white rounded-lg hover:bg-[#1a1f2e]/90 transition-all duration-200 border border-[#2563eb]/20'
              >
                Войти через Steam
              </button>
            )}
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-[#2563eb]/10'>
            {user ? (
              <div className='space-y-4'>
                <Link
                  to={`/profile/${user.id}`}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-[#151b27]/50 transition-all duration-200'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className='w-8 h-8 rounded-full ring-2 ring-[#2563eb]/50'
                  />
                  <span className='text-gray-100'>{user.displayName}</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className='w-full px-4 py-2 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-200 border border-red-500/20'
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  login()
                  setIsMenuOpen(false)
                }}
                className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#151b27]/90 text-white rounded-lg hover:bg-[#1a1f2e]/90 transition-all duration-200 border border-[#2563eb]/20'
              >
                Войти через Steam
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
