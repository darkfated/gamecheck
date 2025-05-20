import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StatusBadge } from "./StatusBadge"
import { RatingBadge } from "./RatingBadge"

export function GameCard({
  game,
  statusOptions,
  editable,
  onDelete,
  onUpdate,
  listMode = false,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedGame, setEditedGame] = useState({})

  useEffect(() => {
    if (isEditing) {
      setEditedGame({
        status: game.status,
        rating: game.rating || "",
        review: game.review || "",
      })
    }
  }, [isEditing, game])

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    const updatedGame = {
      ...editedGame,
      rating: editedGame.rating === "" ? null : 
              typeof editedGame.rating === 'string' ? 
              parseInt(editedGame.rating) : editedGame.rating
    }
    
    onUpdate(game.id, updatedGame)
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setEditedGame(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const showEditControls = editable && isEditing
  const showViewControls = !isEditing || !editable

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group relative ${
        listMode ? 'flex items-start gap-4' : ''
      }`}
    >
      <div className={`relative ${
        listMode 
          ? 'flex-1 bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl hover:border-[var(--border-color-hover)] transition-all duration-300 shadow-md hover:shadow-lg' 
          : 'bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl hover:border-[var(--border-color-hover)] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1'
      }`}>
        <div className={`p-4 ${listMode ? '' : 'space-y-4'}`}>
          <div className={`flex justify-between items-start gap-3 ${listMode ? 'flex-1' : ''}`}>
            <div className={`${listMode ? 'flex-1' : ''}`}>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] line-clamp-2 flex-grow'>
                {game.name}
              </h3>
              {listMode && showViewControls && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  <StatusBadge
                    status={game.status}
                    label={
                      statusOptions.find(option => option.value === game.status)
                        ?.label || game.status
                    }
                  />
                  {game.rating && <RatingBadge rating={game.rating} />}
                </div>
              )}
            </div>
            {editable && (
              <div className='flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100'>
                <button
                  onClick={toggleEdit}
                  className='text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-all duration-200 hover:scale-110'
                  title={isEditing ? "Сохранить изменения" : "Редактировать"}
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
                          ? "M5 13l4 4L19 7"
                          : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      }
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(game.id)}
                  className='text-[var(--error)] hover:text-[var(--error-hover)] p-1.5 rounded-lg hover:bg-[var(--error)]/10 transition-all duration-200 hover:scale-110'
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

          {!listMode && (
            <div className='space-y-4'>
              <AnimatePresence mode='wait'>
                {showEditControls ? (
                  <motion.div
                    key='edit-controls'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className='flex flex-col gap-4 bg-[var(--card-bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg p-4'
                  >
                    <div className='relative'>
                      <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1.5'>
                        Статус
                      </label>
                      <select
                        value={editedGame.status}
                        onChange={e => handleChange("status", e.target.value)}
                        className='w-full p-2.5 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm appearance-none pl-3 pr-10'
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className='absolute right-3 top-[38px] pointer-events-none'>
                        <svg className='w-4 h-4 text-[var(--text-secondary)]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                      </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                      <label className='text-sm font-medium text-[var(--text-secondary)]'>
                        Оценка
                      </label>
                      <div className='relative'>
                        <select
                          value={editedGame.rating}
                          onChange={e =>
                            handleChange(
                              "rating",
                              e.target.value ? parseInt(e.target.value) : ""
                            )
                          }
                          className='w-full p-2.5 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm appearance-none pl-3 pr-10'
                        >
                          <option value=''>Без оценки</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                          <svg className='w-4 h-4 text-[var(--text-secondary)]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                      <label className='text-sm font-medium text-[var(--text-secondary)]'>
                        Заметки (опционально)
                      </label>
                      <textarea
                        value={editedGame.review || ""}
                        onChange={e => handleChange("review", e.target.value)}
                        placeholder='Ваши впечатления об игре'
                        rows={3}
                        className='w-full p-2.5 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm resize-none'
                      />
                    </div>

                    <div className='flex justify-end gap-2 mt-2'>
                      <button
                        onClick={() => setIsEditing(false)}
                        className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary-hover)] transition-all duration-200 hover:scale-105'
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleSave}
                        className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-[var(--accent-primary)]/20'
                      >
                        Сохранить
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key='view-controls'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className='flex flex-wrap gap-2'>
                      <StatusBadge
                        status={game.status}
                        label={
                          statusOptions.find(option => option.value === game.status)
                            ?.label || game.status
                        }
                      />
                      {game.rating && <RatingBadge rating={game.rating} />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {listMode && showEditControls && (
            <motion.div
              key='edit-controls'
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className='flex-1'
            >
              <div className='flex flex-col gap-4 bg-[var(--card-bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg p-4'>
                <div className='relative'>
                  <label className='block text-sm font-medium text-[var(--text-secondary)] mb-1.5'>
                    Статус
                  </label>
                  <select
                    value={editedGame.status}
                    onChange={e => handleChange("status", e.target.value)}
                    className='w-full p-2.5 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm appearance-none pl-3 pr-10'
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className='absolute right-3 top-[38px] pointer-events-none'>
                    <svg className='w-4 h-4 text-[var(--text-secondary)]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-[var(--text-secondary)]'>
                    Оценка
                  </label>
                  <div className='relative'>
                    <select
                      value={editedGame.rating}
                      onChange={e =>
                        handleChange(
                          "rating",
                          e.target.value ? parseInt(e.target.value) : ""
                        )
                      }
                      className='w-full p-2.5 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm appearance-none pl-3 pr-10'
                    >
                      <option value=''>Без оценки</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                      <svg className='w-4 h-4 text-[var(--text-secondary)]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-[var(--text-secondary)]'>
                    Заметки (опционально)
                  </label>
                  <textarea
                    value={editedGame.review || ""}
                    onChange={e => handleChange("review", e.target.value)}
                    placeholder='Ваши впечатления об игре'
                    rows={3}
                    className='w-full p-2.5 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm resize-none'
                  />
                </div>

                <div className='flex justify-end gap-2 mt-2'>
                  <button
                    onClick={() => setIsEditing(false)}
                    className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary-hover)] transition-all duration-200 hover:scale-105'
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-[var(--accent-primary)]/20'
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {game.review && !isEditing && (
            <div className={`${listMode ? 'mt-2' : 'mt-4 pt-4 border-t border-[var(--border-color)]/30'}`}>
              <p className='text-sm text-[var(--text-secondary)] line-clamp-3 italic'>
                {game.review}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
