import React from "react"
import { motion } from "framer-motion"
import { StatusBadge } from "./common/StatusBadge"
import { RatingBadge } from "./common/RatingBadge"

export function GameCard({
  game,
  statusOptions,
  editable,
  onDelete,
  onUpdate,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className='group p-4 bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl hover:border-[var(--border-color-hover)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
    >
      <div className='flex justify-between items-start gap-2'>
        <h3 className='text-base font-semibold text-[var(--text-primary)] line-clamp-2 flex-grow'>
          {game.name}
        </h3>
        {editable && (
          <button
            onClick={() => onDelete(game.id)}
            className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity focus:opacity-100 p-1'
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
        )}
      </div>

      <div className='mt-3 space-y-3'>
        {editable ? (
          <div className='flex flex-col gap-2'>
            <select
              value={game.status}
              onChange={e => onUpdate(game.id, { status: e.target.value })}
              className='p-2 w-full bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm'
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className='flex items-center gap-2'>
              <span className='text-[var(--text-secondary)] text-sm'>
                Оценка:
              </span>
              <select
                value={game.rating || ""}
                onChange={e =>
                  onUpdate(game.id, {
                    rating: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className='p-2 flex-1 bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all duration-200 shadow-inner hover:bg-[var(--input-bg)] text-sm'
              >
                <option value=''>Нет оценки</option>
                {[...Array(10)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                    className='bg-[var(--input-bg)] text-[var(--text-primary)]'
                  >
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className='flex flex-wrap items-center gap-2'>
            <StatusBadge
              status={game.status}
              label={
                statusOptions.find(s => s.value === game.status)?.label ||
                "Неизвестно"
              }
            />
            {game.rating && <RatingBadge rating={game.rating} />}
          </div>
        )}

        {game.review && (
          <p className='text-[var(--text-secondary)] text-sm line-clamp-3'>
            {game.review}
          </p>
        )}
      </div>
    </motion.div>
  )
}
