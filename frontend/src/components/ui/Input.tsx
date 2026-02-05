import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type InputElement = 'input' | 'textarea'

type InputProps = {
  as?: InputElement
  className?: string
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>

export function Input({ as = 'input', className = '', ...props }: InputProps) {
  const Component = as === 'textarea' ? 'textarea' : 'input'
  return (
    <Component
      className={`w-full rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] shadow-inner transition focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] ${className}`}
      {...props}
    />
  )
}

