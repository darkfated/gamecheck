import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent-primary)] text-[var(--button-text-on-accent)] hover:bg-[var(--accent-primary-hover)] shadow-[0_12px_24px_rgba(34,211,238,0.22)]',
  secondary:
    'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary-hover)]',
  outline:
    'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)]',
  danger:
    'bg-[var(--error)] text-white hover:bg-[var(--error-hover)] shadow-[0_10px_20px_rgba(248,113,113,0.25)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    />
  )
}
