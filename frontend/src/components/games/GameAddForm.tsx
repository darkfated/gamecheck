import { motion } from 'framer-motion'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import { GAME_STATUS_CONFIG, getStatusOptions } from '../../constants'
import api from '../../services/api'
import { ArcadeGlyph } from '../icons/ArcadeGlyph'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'

interface GameAddFormProps {
  onSubmit: (gameData: any) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

type SuggestionSource = 'library' | 'steam' | 'none'

interface GameSuggestion {
  source: 'library' | 'steam'
  id?: string
  steamAppId?: number
  name: string
  icon?: string
  storeUrl?: string
}

interface SuggestionResponse {
  source: SuggestionSource
  items: GameSuggestion[]
}

const SUGGESTIONS_LIMIT = 6

export const GameAddForm: FC<GameAddFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [gameName, setGameName] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('playing')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [review, setReview] = useState('')

  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<GameSuggestion | null>(null)
  const [suggestionSource, setSuggestionSource] =
    useState<SuggestionSource>('none')
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const suggestionCache = useRef(new Map<string, SuggestionResponse>())
  const statusOptions = getStatusOptions()

  useEffect(() => {
    const trimmed = gameName.trim()
    if (trimmed.length < 2) {
      setDebouncedQuery('')
      setSuggestions([])
      setSuggestionSource('none')
      setIsSuggestionsLoading(false)
      return
    }
    const handle = setTimeout(() => {
      setDebouncedQuery(trimmed)
    }, 350)
    return () => clearTimeout(handle)
  }, [gameName])
  useEffect(() => {
    if (!debouncedQuery) {
      return
    }
    const cacheKey = debouncedQuery.toLowerCase()
    const cached = suggestionCache.current.get(cacheKey)
    if (cached) {
      setSuggestions(cached.items)
      setSuggestionSource(cached.source)
      setIsSuggestionsLoading(false)
      return
    }
    let active = true
    const controller = new AbortController()
    setIsSuggestionsLoading(true)
    setSuggestions([])
    setSuggestionSource('none')
    api.library
      .suggest(debouncedQuery, SUGGESTIONS_LIMIT, controller.signal)
      .then(response => {
        if (!active) return
        const payload = response.data
        suggestionCache.current.set(cacheKey, payload)
        setSuggestions(payload.items || [])
        setSuggestionSource(payload.source || 'none')
      })
      .catch(err => {
        if (!active) return
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
          return
        }
        console.error('Error fetching suggestions:', err)
        setSuggestions([])
        setSuggestionSource('none')
      })
      .finally(() => {
        if (active) setIsSuggestionsLoading(false)
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [debouncedQuery])

  useEffect(() => {
    if (!selectedSuggestion) {
      return
    }
    const current = gameName.trim().toLowerCase()
    const selected = selectedSuggestion.name.trim().toLowerCase()
    if (current !== selected) {
      setSelectedSuggestion(null)
    }
  }, [gameName, selectedSuggestion])

  const trimmedGameName = gameName.trim()
  const showSuggestions = trimmedGameName.length >= 2 && !selectedSuggestion
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name: gameName,
      status: selectedStatus,
      rating: selectedRating,
      review: review || '',
      steamAppId: selectedSuggestion?.steamAppId,
      steamIconUrl: selectedSuggestion?.icon,
      steamStoreUrl: selectedSuggestion?.storeUrl,
    })

    setGameName('')
    setSelectedStatus('playing')
    setSelectedRating(null)
    setReview('')
    setSelectedSuggestion(null)
  }

  const handleSuggestionSelect = (suggestion: GameSuggestion) => {
    setGameName(suggestion.name)
    setSelectedSuggestion(suggestion)
  }

  const handleClearSuggestion = () => {
    setSelectedSuggestion(null)
  }
  const handleCustomSuggestion = () => {
    const trimmed = gameName.trim()
    if (!trimmed) return
    setGameName(trimmed)
    setSelectedSuggestion(null)
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

              {selectedSuggestion && (
                <div className='mt-3 rounded-2xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.65)] p-3'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <div className='h-12 w-12 rounded-xl overflow-hidden bg-[rgba(var(--bg-tertiary-rgb),0.6)] flex items-center justify-center'>
                      {selectedSuggestion.icon ? (
                        <img
                          src={selectedSuggestion.icon}
                          alt={selectedSuggestion.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <ArcadeGlyph className='w-6 h-6 text-[var(--accent-primary)]' />
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-semibold text-[var(--text-primary)] truncate'>
                        {selectedSuggestion.name}
                      </p>
                      <p className='text-xs text-[var(--text-tertiary)]'>
                        {selectedSuggestion.source === 'library'
                          ? 'Выбрана из библиотеки'
                          : 'Выбрана из Steam'}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleClearSuggestion}
                      disabled={isSubmitting}
                      className='ml-auto'
                    >
                      Сменить
                    </Button>
                  </div>
                </div>
              )}
              {showSuggestions && (
                <div className='mt-3 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.55)] p-3'>
                  <div className='flex items-center justify-between text-xs text-[var(--text-tertiary)]'>
                    <span className='uppercase tracking-wide'>Подсказки</span>
                    {isSuggestionsLoading ? (
                      <span>Поиск...</span>
                    ) : suggestionSource !== 'none' ? (
                      <span>
                        {suggestionSource === 'library'
                          ? 'Библиотека'
                          : 'Steam'}
                      </span>
                    ) : null}
                  </div>
                  <div className='mt-2 space-y-2'>
                    {isSuggestionsLoading && suggestions.length === 0 ? (
                      <div className='text-xs text-[var(--text-tertiary)]'>
                        Ищем игры...
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map(suggestion => (
                        <button
                          key={`${suggestion.source}-${suggestion.steamAppId || suggestion.id || suggestion.name}`}
                          type='button'
                          onClick={() => handleSuggestionSelect(suggestion)}
                          disabled={isSubmitting}
                          className='w-full flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-tertiary-rgb),0.55)] px-3 py-2 text-left transition hover:border-[rgba(var(--accent-primary-rgb),0.4)] disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                          <div className='h-10 w-10 rounded-lg overflow-hidden bg-[rgba(var(--bg-secondary-rgb),0.6)] flex items-center justify-center'>
                            {suggestion.icon ? (
                              <img
                                src={suggestion.icon}
                                alt={suggestion.name}
                                className='h-full w-full object-cover'
                              />
                            ) : (
                              <ArcadeGlyph className='w-5 h-5 text-[var(--accent-primary)]' />
                            )}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
                              {suggestion.name}
                            </p>
                            <p className='text-xs text-[var(--text-tertiary)]'>
                              {suggestion.source === 'library'
                                ? 'В библиотеке'
                                : 'Steam'}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <button
                        type='button'
                        onClick={handleCustomSuggestion}
                        disabled={isSubmitting}
                        className='w-full flex items-center gap-3 rounded-xl border border-dashed border-[var(--border-color)] bg-[rgba(var(--bg-tertiary-rgb),0.4)] px-3 py-2 text-left transition hover:border-[rgba(var(--accent-primary-rgb),0.4)] disabled:opacity-60 disabled:cursor-not-allowed'
                      >
                        <div className='h-10 w-10 rounded-lg bg-[rgba(var(--bg-secondary-rgb),0.6)] flex items-center justify-center'>
                          <ArcadeGlyph className='w-5 h-5 text-[var(--accent-secondary)]' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-medium text-[var(--text-primary)]'>
                            Своя игра
                          </p>
                          <p className='text-xs text-[var(--text-tertiary)] truncate'>
                            Добавить как "{trimmedGameName}"
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
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
