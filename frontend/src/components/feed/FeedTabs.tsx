import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon: ReactNode
}

interface FeedTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const FeedTabs: FC<FeedTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: Tab[] = [
    {
      id: 'following',
      label: 'Подписки',
      icon: (
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
      ),
    },
    {
      id: 'all',
      label: 'Все активности',
      icon: (
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
      ),
    },
  ]

  return (
    <div className='mb-8 border-b border-[var(--border-color)] pb-2 animate-on-load opacity-0'>
      <div className='flex space-x-1 overflow-x-auto'>
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            whileHover={{
              scale: activeTab !== tab.id ? 1.02 : 1,
              backgroundColor:
                activeTab !== tab.id ? 'rgba(var(--bg-tertiary-rgb), 0.5)' : '',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
