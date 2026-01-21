import { LayoutGroup, motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
}

interface ProfileSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: Tab[]
}

const getTabIcon = (tabId: string): ReactNode => {
  switch (tabId) {
    case 'progress':
      return (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          viewBox='0 0 24 24'
        >
          <path d='M3 12h3l2 8 4-16 4 12 3-8h3' />
        </svg>
      )
    case 'activity':
      return (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          viewBox='0 0 24 24'
        >
          <polyline points='4 12 9 12 11 8 13 16 15 12 20 12' />
        </svg>
      )
    case 'info':
      return (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          viewBox='0 0 24 24'
        >
          <circle cx='12' cy='12' r='10' />
          <line x1='12' y1='16' x2='12' y2='12' />
          <line x1='12' y1='8' x2='12.01' y2='8' />
        </svg>
      )
    case 'settings':
      return (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          viewBox='0 0 24 24'
        >
          <circle cx='12' cy='12' r='3' />
          <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' />
        </svg>
      )
    default:
      return null
  }
}

export const ProfileSidebar: FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
  tabs,
}) => {
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.aside
      className='w-full lg:w-72 mb-6 lg:mb-0'
      initial='hidden'
      animate='visible'
      variants={sidebarVariants}
    >
      <div className='sticky top-4'>
        <motion.div
          className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)] backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[var(--border-color)] overflow-hidden relative'
          whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
        >
          <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl' />
          <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl' />

          <h3 className='text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 px-2'>
            Навигация
          </h3>

          <LayoutGroup>
            <nav className='space-y-2 relative z-10'>
              {tabs.map(tab => {
                const isActive = activeTab === tab.id

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className='relative w-full'
                  >
                    {isActive && (
                      <motion.div
                        layoutId='activeTabBg'
                        className='absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30'
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <div
                      className={`
                        relative z-10 flex items-center gap-4 p-3 rounded-xl
                        text-sm font-medium transition-colors
                        ${
                          isActive
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }
                      `}
                    >
                      <div
                        className={`
                          p-2 rounded-lg transition-all
                          ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                              : 'bg-[var(--bg-tertiary)]/80'
                          }
                        `}
                      >
                        {getTabIcon(tab.id)}
                      </div>

                      <span>{tab.label}</span>
                    </div>
                  </motion.button>
                )
              })}
            </nav>
          </LayoutGroup>
        </motion.div>

        <motion.div
          className='mt-6 bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)] backdrop-blur-md rounded-2xl p-5 shadow-xl border border-[var(--border-color)] space-y-4 relative overflow-hidden'
          variants={sidebarVariants}
          whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
        >
          <div className='flex items-center py-2'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center'>
              <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z' />
              </svg>
            </div>

            <div className='ml-4'>
              <p className='text-sm font-medium text-[var(--text-primary)]'>
                Steam
              </p>
              <motion.p
                className='text-xs text-[var(--accent-tertiary)]'
                whileHover={{ x: 3 }}
              >
                Аккаунт подключен
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
