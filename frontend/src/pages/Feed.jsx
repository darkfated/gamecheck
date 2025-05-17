import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ActivityFeed } from "../components/ActivityFeed"
import api from "../services/api"

export default function Feed() {
  const { user, login } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async e => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const response = await api.users.searchUsers(searchQuery)
      setSearchResults(response.data)
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setIsSearching(false)
    }
  }

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center bg-[var(--card-bg)] shadow rounded-lg p-8'>
          <h2 className='text-2xl font-bold mb-4 text-[var(--text-primary)]'>
            Добро пожаловать в GameCheck!
          </h2>
          <p className='text-[var(--text-secondary)] mb-6'>
            Войдите через Steam, чтобы отслеживать свои игры и следить за
            активностью друзей.
          </p>
          <button
            onClick={login}
            className='inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--accent-secondary)] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200'
          >
            Войти через Steam
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <ActivityFeed showFollowingOnly={true} />
        </div>

        <div className='space-y-6'>
          <div className='bg-[var(--card-bg)] rounded-lg shadow-lg p-4 border border-[var(--border-color)]'>
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
            <form onSubmit={handleSearch} className='space-y-4'>
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
                  className='w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all shadow-inner'
                />
              </div>
              <button
                type='submit'
                disabled={isSearching}
                className='w-full bg-[var(--accent-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-secondary)] disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2'
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
                {isSearching ? "Поиск..." : "Найти"}
              </button>
            </form>
          </div>

          {searchResults.length > 0 && (
            <div className='bg-[var(--card-bg)] rounded-lg shadow-lg p-4 border border-[var(--border-color)]'>
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
                Результаты поиска
              </h3>
              <div className='space-y-4'>
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className='flex items-center gap-4 p-3 hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200 border border-[var(--border-color)] shadow hover:shadow-md'
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className='w-10 h-10 rounded-full ring-1 ring-[var(--border-color)]'
                    />
                    <Link
                      to={`/profile/${user.id}`}
                      className='font-medium text-[var(--text-primary)] hover:text-[var(--accent-secondary)] transition-colors flex-grow'
                    >
                      {user.displayName}
                    </Link>
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
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
