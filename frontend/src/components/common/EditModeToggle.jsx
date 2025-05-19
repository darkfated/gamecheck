import React from "react"

export function EditModeToggle({ isEditMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isEditMode
          ? "bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)]"
          : "bg-[var(--accent-primary)]/20 text-[var(--accent-secondary)]"
      }`}
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
          d={
            isEditMode
              ? "M6 18L18 6M6 6l12 12"
              : "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          }
        />
      </svg>
      {isEditMode ? "Выйти из режима редактирования" : "Редактировать"}
    </button>
  )
}
