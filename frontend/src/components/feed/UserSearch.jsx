import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import api from "../../services/api"

export const UserSearch = () => {
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

  return (
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
        <motion.button
          type='submit'
          disabled={isSearching}
          className='btn-modern w-full flex items-center justify-center gap-2'
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
          {isSearching ? "Поиск..." : "Найти"}
        </motion.button>
      </form>

      {searchResults.length > 0 && (
        <div className='mt-6'>
          <h3 className='text-sm font-semibold mb-3 text-[var(--text-secondary)]'>
            Результаты поиска
          </h3>
          <div className='space-y-2'>
            {searchResults.map(user => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className='flex items-center p-2 hover:bg-[var(--bg-secondary)]/50 rounded-lg transition-colors'
              >
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className='w-10 h-10 rounded-full mr-3'
                />
                <div>
                  <div className='font-medium text-[var(--text-primary)]'>
                    {user.displayName}
                  </div>
                  <div className='text-xs text-[var(--text-tertiary)]'>
                    {user.steamId && "Steam ID: " + user.steamId}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
