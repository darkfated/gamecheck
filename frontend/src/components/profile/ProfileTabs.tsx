import { LayoutGroup, motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
}

interface ProfileTabsProps {
  activeTab: string
  tabs: Tab[]
  onSelectTab: (tabId: string) => void
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

export const ProfileTabs: FC<ProfileTabsProps> = ({
  activeTab,
  tabs,
  onSelectTab,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className='w-full mb-6 lg:mb-0'>
      <div className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)] backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[var(--border-color)] overflow-hidden relative'>
        <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-cyan-500/10 to-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl' />
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl' />

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
                  onClick={() => onSelectTab(tab.id)}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className='relative w-full'
                >
                  {isActive && (
                    <motion.div
                      layoutId='activeTabBg'
                      className='absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/25 to-amber-500/25'
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
                            ? 'bg-gradient-to-r from-cyan-500 to-amber-500 text-[#001015] shadow-lg shadow-cyan-500/20'
                            : 'bg-[rgba(var(--bg-tertiary-rgb),0.8)]'
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
      </div>
    </div>
  )
}
