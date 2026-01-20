import { AnimatePresence, motion } from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'
import { RatingBadge } from './RatingBadge'
import { StatusBadge } from './StatusBadge'

interface Game {
  id: string
  name: string
  status: string
  rating?: number
  review?: string
  steamAppId?: string
  steamStoreUrl?: string
  steamIconUrl?: string
  steamPlaytimeForever?: number
}

interface StatusOption {
  value: string
  label: string
}

interface GameCardProps {
  game: Game
  statusOptions: StatusOption[]
  editable?: boolean
  onDelete?: (id: string) => void
  onUpdate?: (id: string, data: any) => void
  onUpdateSteam?: (id: string) => void
  isOwner?: boolean
  listMode?: boolean
}

interface SteamInfoProps {
  game: Game
  compact?: boolean
}

const SteamInfo: FC<SteamInfoProps> = ({ game, compact = false }) => {
  const formatPlaytime = (minutes: number): string => {
    if (!minutes || minutes === 0) return '0ч'
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) return `${remainingMinutes}м`
    if (remainingMinutes === 0) return `${hours}ч`
    return `${hours}ч ${remainingMinutes}м`
  }

  const handleSteamClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (game.steamStoreUrl) {
      window.open(game.steamStoreUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (!game.steamAppId) return null

  return (
    <div
      className={`flex items-center gap-1.5 ${
        compact ? 'text-xs' : 'text-sm'
      } text-[var(--text-secondary)]`}
    >
      <button
        onClick={handleSteamClick}
        className='flex items-center gap-1 hover:text-blue-400 transition-colors'
        title='Открыть в Steam Store'
      >
        <svg
          className='w-4 h-4 text-blue-400'
          fill='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.62 20.51 6.504 24 11.979 24c6.624 0 11.999-5.375 11.999-12S18.603.001 11.979.001zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.393 1.5.993 2.456-.4.957-1.502 1.394-2.458.994l-.002-.01z' />
        </svg>
        {!compact && <span className='text-xs'>Steam</span>}
      </button>

      {game.steamPlaytimeForever !== null &&
        game.steamPlaytimeForever !== undefined && (
          <div className='flex items-center gap-1'>
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className='font-medium'>
              {formatPlaytime(game.steamPlaytimeForever)}
            </span>
          </div>
        )}
    </div>
  )
}

interface GameIconProps {
  game: Game
  size?: 'sm' | 'md' | 'lg'
}

const GameIcon: FC<GameIconProps> = ({ game, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  if (game.steamIconUrl) {
    return (
      <img
        src={game.steamIconUrl}
        alt={`${game.name} icon`}
        className={`${sizeClasses[size]} rounded border border-[var(--border-color)] shadow-sm object-cover`}
        onError={e => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center`}
    >
      <svg
        className='w-4 h-4 text-[var(--text-tertiary)]'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
        />
      </svg>
    </div>
  )
}

export const GameCard: FC<GameCardProps> = ({
  game,
  statusOptions,
  editable,
  onDelete,
  onUpdate,
  onUpdateSteam,
  isOwner = false,
  listMode = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedGame, setEditedGame] = useState<any>({})

  useEffect(() => {
    if (isEditing) {
      setEditedGame({
        status: game.status,
        rating: game.rating || '',
        review: game.review || '',
      })
    }
  }, [isEditing, game])

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    const updatedGame = {
      ...editedGame,
      rating:
        editedGame.rating === ''
          ? null
          : typeof editedGame.rating === 'string'
            ? parseInt(editedGame.rating)
            : editedGame.rating,
    }

    if (onUpdate) {
      onUpdate(game.id, updatedGame)
    }
    setIsEditing(false)
  }

  const handleChange = (field: string, value: any) => {
    setEditedGame((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateSteam = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onUpdateSteam) {
      onUpdateSteam(game.id)
    }
  }

  if (listMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className='group bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl hover:border-[var(--border-color-hover)] transition-all duration-300 shadow-md hover:shadow-lg'
      >
        <div className='p-4'>
          {!isEditing ? (
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3 flex-1 min-w-0'>
                <GameIcon game={game} size='sm' />
                <h3 className='font-semibold text-[var(--text-primary)] truncate flex-1'>
                  {game.name}
                </h3>
              </div>

              <div className='flex items-center gap-2 flex-shrink-0'>
                <StatusBadge
                  status={game.status}
                  label={
                    statusOptions.find(option => option.value === game.status)
                      ?.label || game.status
                  }
                />
                {game.rating && <RatingBadge rating={game.rating} />}
              </div>

              <div className='flex-shrink-0'>
                <SteamInfo game={game} compact={true} />
              </div>

              {editable && (
                <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    onClick={toggleEdit}
                    className='text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-all duration-200'
                    title='Редактировать'
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(game.id)}
                    className='text-[var(--error)] hover:text-[var(--error-hover)] p-1.5 rounded-lg hover:bg-[var(--error)]/10 transition-all duration-200'
                    title='Удалить игру'
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <GameIcon game={game} size='sm' />
                <h3 className='font-semibold text-[var(--text-primary)]'>
                  {game.name}
                </h3>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>
                    Статус
                  </label>
                  <select
                    value={editedGame.status}
                    onChange={e => handleChange('status', e.target.value)}
                    className='w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] text-sm'
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>
                    Оценка
                  </label>
                  <select
                    value={editedGame.rating}
                    onChange={e =>
                      handleChange(
                        'rating',
                        e.target.value ? parseInt(e.target.value) : '',
                      )
                    }
                    className='w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] text-sm'
                  >
                    <option value=''>Без оценки</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {isOwner && onUpdateSteam && (
                  <div className='flex items-end'>
                    <button
                      onClick={handleUpdateSteam}
                      className='w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2'
                      title='Обновить статистику Steam'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                        />
                      </svg>
                      Обновить статистику
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1'>
                  Заметки (опционально)
                </label>
                <textarea
                  value={editedGame.review || ''}
                  onChange={e => handleChange('review', e.target.value)}
                  placeholder='Ваши впечатления об игре'
                  rows={3}
                  className='w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] text-sm resize-none'
                />
              </div>

              <div className='flex justify-end gap-2'>
                <button
                  onClick={() => setIsEditing(false)}
                  className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary-hover)] transition-all duration-200'
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-all duration-200 shadow-lg'
                >
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {game.review && !isEditing && (
            <div className='mt-3 pt-3 border-t border-[var(--border-color)]/30'>
              <p className='text-sm text-[var(--text-secondary)] italic line-clamp-2'>
                {game.review}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className='group bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl hover:border-[var(--border-color-hover)] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1'
    >
      <div className='p-4 h-full flex flex-col'>
        <div className='flex items-start justify-between gap-3 mb-4'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <GameIcon game={game} size='md' />
            <div className='flex-1 min-w-0'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] line-clamp-3 leading-tight'>
                {game.name}
              </h3>
            </div>
          </div>

          {editable && (
            <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <button
                onClick={toggleEdit}
                className='text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-all duration-200'
                title={isEditing ? 'Сохранить изменения' : 'Редактировать'}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d={
                      isEditing
                        ? 'M5 13l4 4L19 7'
                        : 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    }
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete && onDelete(game.id)}
                className='text-[var(--error)] hover:text-[var(--error-hover)] p-1.5 rounded-lg hover:bg-[var(--error)]/10 transition-all duration-200'
                title='Удалить игру'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className='flex-1 flex flex-col'>
          <AnimatePresence mode='wait'>
            {!isEditing ? (
              <motion.div
                key='view-mode'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex-1 flex flex-col'
              >
                <div className='flex items-center justify-between gap-2 mb-2'>
                  <div className='flex flex-wrap gap-2'>
                    <StatusBadge
                      status={game.status}
                      label={
                        statusOptions.find(
                          option => option.value === game.status,
                        )?.label || game.status
                      }
                    />
                    {game.rating && <RatingBadge rating={game.rating} />}
                  </div>
                  <SteamInfo game={game} />
                </div>

                {game.review && (
                  <div className='flex-1'>
                    <p className='text-sm text-[var(--text-secondary)] italic line-clamp-3'>
                      {game.review}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key='edit-mode'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className='flex-1 flex flex-col'
              >
                <div className='space-y-4 flex-1'>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1.5'>
                      Статус
                    </label>
                    <select
                      value={editedGame.status}
                      onChange={e => handleChange('status', e.target.value)}
                      className='w-full p-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] text-sm'
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1.5'>
                      Оценка
                    </label>
                    <select
                      value={editedGame.rating}
                      onChange={e =>
                        handleChange(
                          'rating',
                          e.target.value ? parseInt(e.target.value) : '',
                        )
                      }
                      className='w-full p-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] text-sm'
                    >
                      <option value=''>Без оценки</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1.5'>
                      Заметки (опционально)
                    </label>
                    <textarea
                      value={editedGame.review || ''}
                      onChange={e => handleChange('review', e.target.value)}
                      placeholder='Ваши впечатления об игре'
                      rows={3}
                      className='w-full p-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] text-sm resize-none'
                    />
                  </div>

                  {isOwner && onUpdateSteam && (
                    <div>
                      <button
                        onClick={handleUpdateSteam}
                        className='w-full px-3 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-sm'
                        title='Обновить статистику Steam'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                          />
                        </svg>
                        Обновить статистику
                      </button>
                    </div>
                  )}
                </div>

                <div className='flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]/30'>
                  <button
                    onClick={() => setIsEditing(false)}
                    className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary-hover)] transition-all duration-200'
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-all duration-200 shadow-lg'
                  >
                    Сохранить
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
