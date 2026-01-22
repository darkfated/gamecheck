import { motion } from 'framer-motion'
import { FC, useState } from 'react'
import { GAME_STATUS_CONFIG, getStatusOptions } from '../../constants'

interface GameAddFormProps {
  onSubmit: (gameData: any) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const GameAddForm: FC<GameAddFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [gameName, setGameName] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('playing')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [review, setReview] = useState('')

  const statusOptions = getStatusOptions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name: gameName,
      status: selectedStatus,
      rating: selectedRating,
      review: review || '',
    })

    setGameName('')
    setSelectedStatus('playing')
    setSelectedRating(null)
    setReview('')
  }

  const StarRating: FC<{ max?: number }> = ({ max = 10 }) => {
    return (
      <div className='flex gap-1'>
        {Array.from({ length: max }).map((_, i) => {
          const rating = i + 1
          const isFilled = (selectedRating || 0) >= rating

          return (
            <motion.button
              key={i}
              type='button'
              onClick={() => setSelectedRating(rating)}
              whileTap={{ scale: 0.9 }}
              className='transition-all'
            >
              <svg className='w-7 h-7' viewBox='0 0 24 24'>
                <motion.path
                  d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
                  fill={isFilled ? '#FBBF24' : 'none'}
                  stroke={isFilled ? '#FBBF24' : '#9CA3AF'}
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  animate={{
                    fill: isFilled ? '#FBBF24' : 'none',
                    stroke: isFilled ? '#FBBF24' : '#9CA3AF',
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}
                />
              </svg>
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/50 backdrop-blur-md p-4 md:p-6 rounded-xl border border-[var(--border-color)] shadow-xl space-y-4 md:space-y-6 max-w-2xl mx-auto'
    >
      <h3 className='text-lg md:text-xl font-semibold text-[var(--text-primary)]'>
        Добавить новую игру
      </h3>

      <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
        <div>
          <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2'>
            Название игры *
          </label>
          <input
            type='text'
            value={gameName}
            onChange={e => setGameName(e.target.value)}
            required
            placeholder='Введите название игры'
            disabled={isSubmitting}
            className='w-full px-3 md:px-4 py-2 md:py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent transition-all text-base'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2 md:mb-3'>
            Статус *
          </label>
          <div className='flex gap-1.5 md:gap-2 flex-wrap'>
            {statusOptions.map(option => {
              const statusConfig =
                GAME_STATUS_CONFIG[
                  option.value as keyof typeof GAME_STATUS_CONFIG
                ]
              const isSelected = selectedStatus === option.value

              return (
                <motion.button
                  key={option.value}
                  type='button'
                  onClick={() => setSelectedStatus(option.value)}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-medium transition-all ${
                    isSelected
                      ? `${statusConfig.bgClass} ${statusConfig.textClass} ring-2 ring-[var(--accent-primary)]`
                      : `${statusConfig.bgClass} ${statusConfig.textClass} hover:ring-1 hover:ring-[var(--accent-primary)]/50`
                  }`}
                >
                  {option.label}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2 md:mb-3'>
            Оценка (опционально)
          </label>
          <div className='flex items-center gap-2 md:gap-4 flex-wrap'>
            <StarRating />
            {selectedRating && (
              <span className='text-sm font-medium text-[var(--text-primary)]'>
                {selectedRating}/10
              </span>
            )}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2'>
            Заметки (опционально)
          </label>
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder='Ваши впечатления об игре...'
            disabled={isSubmitting}
            maxLength={200}
            rows={3}
            className='w-full px-3 md:px-4 py-2 md:py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent transition-all resize-none text-base'
          />
          <div className='text-xs text-[var(--text-tertiary)] mt-1'>
            {review.length}/200 символов
          </div>
        </div>

        <div className='flex flex-col-reverse md:flex-row justify-end gap-2 md:gap-3 pt-4 md:pt-6 border-t border-[var(--border-color)]/30'>
          <motion.button
            type='button'
            onClick={onCancel}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full md:w-auto px-3 md:px-4 py-2.5 md:py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg font-medium hover:bg-[var(--bg-secondary-hover)] transition-all disabled:opacity-50 text-sm md:text-base'
          >
            Отмена
          </motion.button>
          <motion.button
            type='submit'
            disabled={!gameName.trim() || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={isSubmitting ? { opacity: 0.8 } : { opacity: 1 }}
            className='w-full md:w-auto px-3 md:px-4 py-2.5 md:py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 text-sm md:text-base flex items-center justify-center gap-2'
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full'
                />
                Добавляю...
              </>
            ) : (
              'Добавить игру'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
