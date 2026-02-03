import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'framer-motion'
import React, { FC, ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  ariaLabel?: string
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}

const overlayVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(4px)',
    transition: { duration: 0.22 } as unknown as Transition,
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.18 } as unknown as Transition,
  },
}

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 32,
    } as unknown as Transition,
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.995,
    transition: { duration: 0.18 } as unknown as Transition,
  },
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.25, 0.8, 0.25, 1] as unknown,
    } as unknown as Transition,
  },
}

const focusableSelectors =
  'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  ariaLabel,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const originalBodyOverflow = useRef<string | null>(null)
  const originalBodyPaddingRight = useRef<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const docEl = document.documentElement
    const scrollbarWidth = window.innerWidth - docEl.clientWidth
    originalBodyOverflow.current = document.body.style.overflow
    originalBodyPaddingRight.current = document.body.style.paddingRight

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return
        const focusableElements = Array.from(
          panel.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter(el => el.offsetParent !== null && !el.hasAttribute('disabled'))
        if (focusableElements.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', trap)

    requestAnimationFrame(() => {
      const panel = panelRef.current
      if (!panel) return
      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter(el => el.offsetParent !== null && !el.hasAttribute('disabled'))
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      } else {
        panel.setAttribute('tabindex', '-1')
        panel.focus()
      }
    })

    return () => {
      window.removeEventListener('keydown', trap)
      document.body.style.overflow = originalBodyOverflow.current ?? ''
      document.body.style.paddingRight = originalBodyPaddingRight.current ?? ''
      if (
        previouslyFocused.current &&
        typeof previouslyFocused.current.focus === 'function'
      ) {
        previouslyFocused.current.focus()
      }
    }
  }, [isOpen, onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <motion.div
            className='absolute inset-0 bg-black/40'
            variants={overlayVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            ref={overlayRef}
            onMouseDown={handleOverlayClick}
            style={{ backdropFilter: 'blur(4px)' }}
            aria-hidden
          />

          <motion.div
            className={`relative w-full ${sizeClasses[size]} mx-auto`}
            variants={panelVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            role='dialog'
            aria-modal='true'
            aria-label={ariaLabel || title || 'Модальное окно'}
            ref={panelRef}
            onMouseDown={e => e.stopPropagation()}
            style={{ zIndex: 51 }}
          >
            <div className='bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden'>
              <div className='flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--border-color)]'>
                <div className='min-w-0'>
                  {title ? (
                    <h3 className='text-lg font-semibold text-[var(--text-primary)] truncate'>
                      {title}
                    </h3>
                  ) : null}
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={onClose}
                    aria-label='Закрыть'
                    className='p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]'
                  >
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
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <motion.div
                className='p-4 max-h-[calc(100vh-8rem)] overflow-y-auto'
                variants={contentVariants}
                initial='hidden'
                animate='visible'
                exit='hidden'
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
