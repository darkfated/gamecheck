import { motion } from 'framer-motion'
import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span className='mr-3 text-sm font-medium text-[var(--text-secondary)]'>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
      <motion.label
        className='relative inline-flex items-center cursor-pointer'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <input
          type='checkbox'
          className='sr-only peer'
          checked={theme === 'light'}
          onChange={toggleTheme}
        />
        <div
          className={`
          w-11 h-6 peer-focus:outline-none rounded-full transition-colors duration-300
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:rounded-full after:h-5 after:w-5
          after:transition-all after:duration-300 peer-checked:after:translate-x-full
          ${
            theme === 'dark'
              ? 'bg-[var(--bg-tertiary)] after:bg-[var(--accent-tertiary)]'
              : 'bg-indigo-500/80 border border-indigo-600/20 after:bg-white'
          }
        `}
        >
          <span
            className={`absolute inset-0 flex items-center justify-end pr-1 ${
              theme === 'dark' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <svg
              className='w-3 h-3 text-[var(--text-tertiary)]'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
            </svg>
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-start pl-1 ${
              theme === 'light' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <svg
              className='w-3 h-3 text-white'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                clipRule='evenodd'
              />
            </svg>
          </span>
        </div>
      </motion.label>
    </div>
  )
}
