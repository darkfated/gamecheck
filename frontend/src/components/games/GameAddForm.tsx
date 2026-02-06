import { motion } from 'framer-motion'
import { FC, FormEvent, useState } from 'react'
import { GAME_STATUS_CONFIG, getStatusOptions } from '../../constants'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'

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

  const handleSubmit = async (e: FormEvent) => {
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
      <div className='flex flex-wrap gap-1 sm:gap-1.5'>
        {Array.from({ length: max }).map((_, i) => {
          const rating = i + 1
          const isFilled = (selectedRating || 0) >= rating

          return (
            <motion.button
              key={i}
              type='button'
              onClick={() => setSelectedRating(rating)}
              whileTap={{ scale: 0.9 }}
              className='transition-all flex-shrink-0'
            >
              <svg className='w-5 h-5 sm:w-7 sm:h-7' viewBox='0 0 24 24'>
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
    >
      <Card variant='glass' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-primary-rgb),0.08)] via-transparent to-[rgba(var(--accent-secondary-rgb),0.1)]'></div>
        <div className='relative space-y-6'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-xl font-semibold text-[var(--text-primary)]'>
              Добавить новую игру
            </h3>
            <p className='text-sm text-[var(--text-secondary)]'>
              Заполните детали, чтобы отслеживать прогресс и делиться
              впечатлениями.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2'>
                Название игры *
              </label>
              <Input
                type='text'
                value={gameName}
                onChange={e => setGameName(e.target.value)}
                required
                placeholder='Введите название игры'
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2'>
                Статус *
              </label>
              <div className='flex flex-wrap gap-2'>
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
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all border ${
                        isSelected
                          ? `${statusConfig.bgClass} ${statusConfig.textClass} border-[rgba(var(--accent-primary-rgb),0.4)]`
                          : `${statusConfig.bgClass} ${statusConfig.textClass} border-transparent hover:border-[rgba(var(--accent-primary-rgb),0.35)]`
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-secondary)] mb-2'>
                Оценка (опционально)
              </label>
              <div className='flex items-center gap-3 flex-wrap'>
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
              <Input
                as='textarea'
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder='Ваши впечатления об игре...'
                disabled={isSubmitting}
                maxLength={200}
                rows={3}
                className='resize-none'
              />
              <div className='text-xs text-[var(--text-tertiary)] mt-1'>
                {review.length}/200 символов
              </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-end gap-3 pt-2'>
              <Button
                type='button'
                variant='secondary'
                onClick={onCancel}
                disabled={isSubmitting}
                className='w-full sm:w-auto'
              >
                Отмена
              </Button>
              <Button
                type='submit'
                disabled={!gameName.trim() || isSubmitting}
                className='w-full sm:w-auto'
              >
                {isSubmitting ? 'Добавляю...' : 'Добавить игру'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  )
}
