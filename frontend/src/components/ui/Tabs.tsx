import { LayoutGroup, motion } from 'framer-motion'
import { ReactNode } from 'react'

export interface TabOption {
  id: string
  label: string
  icon?: ReactNode
  badge?: number | string
}

interface TabsProps {
  tabs: TabOption[]
  activeTab: string
  onChange: (tabId: string) => void
  layoutId?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'px-4 py-2.5 text-sm rounded-2xl',
  md: 'px-5 py-3 text-base rounded-2xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  layoutId = 'tabs-active-pill',
  className = '',
  size = 'md',
}: TabsProps) {
  return (
    <LayoutGroup>
      <div
        className={`flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 ${className}`}
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          return (
            <div key={tab.id} className='relative flex-shrink-0'>
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className='absolute inset-1 rounded-2xl pointer-events-none'
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(var(--accent-primary-rgb),0.22), rgba(var(--accent-secondary-rgb),0.22))',
                    boxShadow:
                      '0 6px 16px -12px rgba(var(--accent-primary-rgb),0.25)',
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                />
              )}

              <motion.button
                type='button'
                onClick={() => onChange(tab.id)}
                whileHover={{ scale: isActive ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative z-10 inline-flex items-center gap-2 border border-transparent font-medium transition-colors ${sizeClasses[size]} ${
                  isActive
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(var(--bg-tertiary-rgb),0.45)]'
                }`}
                aria-pressed={isActive}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className='rounded-full bg-[rgba(var(--bg-tertiary-rgb),0.6)] px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)]'>
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            </div>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
