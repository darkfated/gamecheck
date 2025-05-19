import React from "react"

export function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className='mb-6 border-b border-[var(--border-color)]'>
      <div className='flex flex-wrap -mb-px'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`inline-block py-3 px-4 font-medium text-sm sm:text-base border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[var(--accent-primary)] text-[var(--accent-secondary)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
