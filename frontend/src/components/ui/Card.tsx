import { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'surface' | 'glass' | 'outline'
type CardPadding = 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  variant?: CardVariant
  padding?: CardPadding
}

const variantClasses: Record<CardVariant, string> = {
  surface:
    'bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--shadow-soft)]',
  glass:
    'bg-[rgba(var(--bg-secondary-rgb),0.75)] border border-[var(--card-border)] backdrop-blur-md shadow-[var(--shadow-soft)]',
  outline: 'bg-transparent border border-[var(--border-color)]',
}

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  className = '',
  variant = 'surface',
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-2xl transition-all duration-300 ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
