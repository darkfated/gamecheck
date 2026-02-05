import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  wrapperClassName?: string
}

export function Select({
  className = '',
  wrapperClassName = '',
  children,
  ...props
}: SelectProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`w-full appearance-none rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] ${className}`}
      >
        {children}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--text-tertiary)]'>
        <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z'
            clipRule='evenodd'
          />
        </svg>
      </div>
    </div>
  )
}
