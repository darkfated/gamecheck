import { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 ${className}`}
    >
      <div>
        <h2 className='text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] font-[var(--font-display)]'>
          {title}
        </h2>
        {subtitle ? (
          <p className='text-sm text-[var(--text-secondary)] mt-1'>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className='flex-shrink-0'>{action}</div> : null}
    </div>
  )
}

