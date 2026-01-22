import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const Footer: React.FC = () => {
  const { user } = useAuth()

  return (
    <motion.footer
      className='border-t border-[var(--border-color)] bg-[var(--bg-secondary)] mt-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className='font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2'>
              <div className='w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-white'
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
            </h3>
            <p className='text-sm text-[var(--text-secondary)] leading-relaxed'>
              Открытая платформа по отслеживания игровой активности с
              социальными функциями.
            </p>

            {user && (
              <div className='mt-4 flex items-center gap-3'>
                <Link
                  to={`/profile/${user.id}`}
                  className='flex items-center gap-3'
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className='w-10 h-10 rounded-full object-cover ring-2'
                    style={{
                      borderColor: 'rgba(var(--accent-primary-rgb), 0.25)',
                    }}
                  />
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-[var(--text-primary)] truncate'>
                      {user.displayName}
                    </span>
                    <span className='text-xs text-[var(--text-secondary)]'>
                      Перейти в профиль
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className='font-semibold text-[var(--text-primary)] mb-3'>
              Следите за нами
            </h4>
            <div className='flex flex-col space-y-2'>
              <a
                href='https://github.com/darkfated/gamecheck'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors group'
              >
                <svg
                  className='w-4 h-4 group-hover:scale-110 transition-transform'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
                GitHub
              </a>
              <a
                href='https://t.me/darkfated'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors group'
              >
                <svg
                  className='w-4 h-4 group-hover:scale-110 transition-transform'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.332-2.959-.924c-.643-.204-.658-.643.135-.953l11.566-4.461c.54-.203 1.01.122.84.953z' />
                </svg>
                Telegram
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className='border-t border-[var(--border-color)] mt-8 pt-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className='text-center text-xs text-[var(--text-tertiary)]'>
            <p>GameCheck © 2026</p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
