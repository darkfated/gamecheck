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
      className={`group p-4 bg-[var(--card-bg)] backdrop-blur-sm border ${
        isEditing
          ? "border-[var(--accent-secondary)]/50 ring-2 ring-[var(--accent-secondary)]/20"
          : "border-[var(--border-color)]"
      } rounded-xl hover:border-[var(--border-color-hover)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
    >
      <div className='flex justify-between items-start gap-2'>
        <h3 className='text-base font-semibold text-[var(--text-primary)] line-clamp-2 flex-grow'>
          {game.name}
        </h3>
        {editable && (
          <div className='flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100'>
            <button
              onClick={toggleEdit}
              className='text-indigo-500 hover:text-indigo-400 p-1'
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
              className='text-red-500 hover:text-red-400 p-1'
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

      <div className='mt-3 space-y-3'>
        <AnimatePresence mode='wait'>
          {showEditControls ? (
            <motion.div
              key='edit-controls'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex flex-col gap-2'
            >
              <select
                value={editedGame.status}
                onChange={e => handleChange("status", e.target.value)}
                className='p-2 w-full bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm'
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className='flex flex-col gap-1'>
                <label className='text-xs text-[var(--text-secondary)]'>
                  Оценка
                </label>
                <select
                  value={editedGame.rating}
                  onChange={e =>
                    handleChange(
                      "rating",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className='p-2 w-full bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm'
                >
                  <option value=''>Без оценки</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-xs text-[var(--text-secondary)]'>
                  Заметки (опционально)
                </label>
                <textarea
                  value={editedGame.review || ""}
                  onChange={e => handleChange("review", e.target.value)}
                  placeholder='Ваши впечатления об игре'
                  rows={3}
                  className='p-2 w-full bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm'
                />
              </div>

              <div className='flex justify-end mt-2'>
                <button
                  onClick={() => setIsEditing(false)}
                  className='px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm mr-2'
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className='px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm'
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {game.review && !isEditing && (
        <div className='mt-4 pt-4 border-t border-[var(--border-color)]/30'>
          <p className='text-sm text-[var(--text-secondary)] line-clamp-3'>
            {game.review}
          </p>
        </div>
      )}
    </motion.div>
  )
}
