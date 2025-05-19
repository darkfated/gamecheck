import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ActivityFeed } from "../components/ActivityFeed"
import api from "../services/api"

export default function Feed() {
  const { user, login } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState("following")

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".animate-on-load")
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("animate-fadeIn")
        }, index * 100)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

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
      <div className='container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]'>
        <div
          className='max-w-md w-full modern-card animate-scaleIn'
          style={{
            background:
              "linear-gradient(to bottom right, rgba(var(--bg-secondary-rgb), 0.9), rgba(var(--bg-tertiary-rgb), 0.9))",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className='flex justify-center mb-6'>
            <div className='w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-1 shadow-lg animate-glow'>
              <div
                className='w-full h-full rounded-full flex items-center justify-center'
                style={{
                  backgroundColor: "rgba(var(--bg-secondary-rgb), 0.2)",
                  backdropFilter: "blur(4px)",
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
          </div>

          <h2 className='text-2xl md:text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
            Добро пожаловать в GameCheck!
          </h2>

          <p className='text-[var(--text-secondary)] mb-8 text-center leading-relaxed'>
            Войдите через Steam, чтобы отслеживать свои игры и следить за
            активностью друзей в игровом сообществе.
          </p>

          <div className='flex justify-center'>
            <button
              onClick={login}
              className='btn-modern flex items-center gap-2 transform hover:-translate-y-1'
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Навигация по вкладкам */}
      <div className='mb-8 border-b border-[var(--border-color)] pb-2 animate-on-load opacity-0'>
        <div className='flex space-x-1 overflow-x-auto'>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${
                activeTab === "following"
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            style={{
              ...(activeTab !== "following" && {
                ":hover": {
                  backgroundColor: "rgba(var(--bg-tertiary-rgb), 0.5)",
                },
              }),
            }}
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
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            style={{
              ...(activeTab !== "all" && {
                ":hover": {
                  backgroundColor: "rgba(var(--bg-tertiary-rgb), 0.5)",
                },
              }),
            }}
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
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 animate-on-load opacity-0'>
          <ActivityFeed showFollowingOnly={activeTab === "following"} />
        </div>

        <div className='space-y-6'>
          <div className='modern-card animate-on-load opacity-0'>
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
                className='btn-modern w-full flex items-center justify-center gap-2'
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
            <div className='modern-card animate-scaleIn'>
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
              <div className='space-y-3'>
                {searchResults.map((user, index) => (
                  <div
                    key={user.id}
                    className='flex items-center gap-4 p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border'
                    style={{
                      backgroundColor: "rgba(var(--bg-secondary-rgb), 0.4)",
                      borderColor: "rgba(var(--accent-primary-rgb), 0.1)",
                      ":hover": {
                        backgroundColor: "rgba(var(--bg-secondary-rgb), 0.7)",
                        borderColor: "rgba(var(--accent-primary-rgb), 0.3)",
                      },
                    }}
                    data-animation-delay={index * 100}
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className='w-10 h-10 rounded-full ring-2 object-cover'
                      style={{
                        borderColor: "rgba(var(--accent-primary-rgb), 0.3)",
                      }}
                    />
                    <Link
                      to={`/profile/${user.id}`}
                      className='font-medium text-[var(--text-primary)] hover:text-indigo-400 transition-colors flex-grow'
                    >
                      {user.displayName}
                    </Link>
                    <button className='p-2 rounded-full hover:bg-indigo-500/10 transition-colors'>
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
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </button>
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
