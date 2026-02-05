import { ReactNode } from 'react'

interface StatPillProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  className?: string
}

export function StatPill({
  label,
  value,
  icon,
  className = '',
}: StatPillProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] px-4 py-3 backdrop-blur-md ${className}`}
    >
      {icon ? (
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(var(--bg-tertiary-rgb),0.8)] text-[var(--accent-primary)]'>
          {icon}
        </div>
      ) : null}
      <div>
        <div className='text-lg font-semibold text-[var(--text-primary)]'>
          {value}
        </div>
        <div className='text-xs uppercase tracking-wide text-[var(--text-tertiary)]'>
          {label}
        </div>
      </div>
    </div>
  )
}
