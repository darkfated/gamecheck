import React, { useState } from "react"
import { motion } from "framer-motion"

export function AddGameForm({
  onSubmit,
  statusOptions,
  isSubmitting,
  authError,
}) {
  const [newGame, setNewGame] = useState({
    name: "",
    status: "plan_to_play",
    review: "",
    rating: null,
    steamAppId: null,
    imageUrl: "https://via.placeholder.com/150",
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (isSubmitting) return
    onSubmit(newGame)

    setNewGame({
      name: "",
      status: "plan_to_play",
      review: "",
      rating: null,
      steamAppId: null,
      imageUrl: "https://via.placeholder.com/150",
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className='space-y-3 xs:space-y-4 p-4 xs:p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] shadow-lg'
    >
      {authError && (
        <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-3'>
          Ошибка авторизации. Пожалуйста, перезайдите в систему.
        </div>
      )}

      <input
        type='text'
        value={newGame.name}
        onChange={e => setNewGame({ ...newGame, name: e.target.value })}
        placeholder='Название игры'
        className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all'
        required
      />

      <select
        value={newGame.status}
        onChange={e => setNewGame({ ...newGame, status: e.target.value })}
        className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all'
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <textarea
        value={newGame.review}
        onChange={e => setNewGame({ ...newGame, review: e.target.value })}
        placeholder='Заметки'
        className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all'
        rows={3}
      />

      <select
        value={newGame.rating || ""}
        onChange={e =>
          setNewGame({
            ...newGame,
            rating: e.target.value ? Number(e.target.value) : null,
          })
        }
        className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all'
      >
        <option value=''>Без оценки</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type='submit'
        className='w-full p-2 xs:p-3 text-sm xs:text-base bg-[var(--accent-primary)] text-white rounded-lg font-medium hover:bg-[var(--accent-secondary)] disabled:bg-[var(--accent-primary)]/50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        disabled={isSubmitting}
      >
        {isSubmitting ? "Добавление..." : "Добавить игру"}
      </motion.button>
    </motion.form>
  )
}
