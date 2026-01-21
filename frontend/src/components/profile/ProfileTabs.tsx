import { motion } from 'framer-motion'
import { FC } from 'react'

interface ProfileTabsProps {
  activeTab: string
  tabs: Array<{ id: string; label: string }>
  onSelectTab: (tabId: string) => void
}

export const ProfileTabs: FC<ProfileTabsProps> = ({
  activeTab,
  tabs,
  onSelectTab,
}) => {
  return (
    <div className='flex gap-4 border-b border-[var(--border-color)] mb-6 overflow-x-auto'>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`px-4 py-3 font-medium whitespace-nowrap transition-colors relative ${
            activeTab === tab.id
              ? 'text-[var(--accent-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId='activeTab'
              className='absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]'
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
