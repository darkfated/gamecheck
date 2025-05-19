import React from "react"
import { motion } from "framer-motion"

export function ProfileSidebar({ activeTab, onTabChange, tabs }) {
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
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
        {/* Навигация */}
        <motion.div
          className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)] backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[var(--border-color)] overflow-hidden relative'
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)" }}
        >
          {/* Декоративные элементы */}
          <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl'></div>
          <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

          <h3 className='text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 px-2'>
            Навигация
          </h3>

          <nav className='space-y-2'>
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-4 p-3 rounded-xl text-left text-sm font-medium
                  transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-[var(--text-primary)]"
                      : "hover:bg-[var(--bg-secondary)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }
                `}
              >
                <div
                  className={`
                  p-2 rounded-lg 
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-[var(--bg-tertiary)]/80 text-[var(--text-secondary)]"
                  }
                `}
                >
                  {getTabIcon(tab.id)}
                </div>
                <span className='text-sm'>{tab.label}</span>

                {activeTab === tab.id && (
                  <motion.div
                    className='ml-auto w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full'
                    initial={{ height: 0 }}
                    animate={{ height: "2rem" }}
                    layoutId='activeIndicator'
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Steam статистика */}
        <motion.div
          className='mt-6 bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)] backdrop-blur-md rounded-2xl p-5 shadow-xl border border-[var(--border-color)] space-y-4 relative overflow-hidden'
          variants={sidebarVariants}
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)" }}
        >
          <div className='flex items-center py-2'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-[var(--accent-tertiary)]'>
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

// Вспомогательная функция для получения иконок вкладок
function getTabIcon(tabId) {
  switch (tabId) {
    case "progress":
      return (
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
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      )
    case "activity":
      return (
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
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      )
    case "info":
      return (
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
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      )
    case "settings":
      return (
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
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      )
    default:
      return null
  }
}
