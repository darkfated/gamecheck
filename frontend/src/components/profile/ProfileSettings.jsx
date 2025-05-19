import React, { useState } from "react"
import { motion } from "framer-motion"
import { ThemeToggle } from "../common/ThemeToggle"

export function ProfileSettings({ profile, updateProfile }) {
  const [discordTag, setDiscordTag] = useState(profile?.discordTag || "")
  const [discordError, setDiscordError] = useState("")
  const [isEditingDiscord, setIsEditingDiscord] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleDiscordTagChange = e => {
    const value = e.target.value.toLowerCase()
    if (value.length > 20) return
    if (!/^[a-z]*$/.test(value) && value !== "") {
      setDiscordError("Только английские буквы в нижнем регистре")
      return
    }
    setDiscordError("")
    setDiscordTag(value)
  }

  const handleDiscordTagSave = async () => {
    if (discordTag.length < 4 && discordTag !== "") {
      setDiscordError("Минимум 4 символа")
      return
    }
    try {
      await updateProfile({ discordTag })
      setIsEditingDiscord(false)
      setDiscordError("")
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    } catch (err) {
      console.error("Error updating discord tag:", err)
      setDiscordError(
        err.response?.data?.message || "Ошибка при обновлении тега"
      )
    }
  }

  return (
    <motion.div initial='hidden' animate='visible' variants={containerVariants}>
      {/* Настройки темы */}
      <motion.div
        variants={itemVariants}
        className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)] overflow-hidden mb-6 relative'
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)" }}
      >
        {/* Декоративные элементы */}
        <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl'></div>
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

        <div className='flex items-center gap-3 mb-6'>
          <svg
            className='w-6 h-6 text-[var(--accent-tertiary)]'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
            />
          </svg>
          <h2 className='text-xl font-bold text-[var(--text-primary)]'>
            Настройки интерфейса
          </h2>
        </div>

        <div className='space-y-6'>
          <div className='p-4 bg-[var(--bg-tertiary)]/50 rounded-xl border border-[var(--border-color)]'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium text-[var(--text-primary)] mb-1'>
                  Тема приложения
                </h3>
                <p className='text-sm text-[var(--text-tertiary)]'>
                  Переключение между светлой и тёмной темой
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Профиль и социальные сети */}
      <motion.div
        variants={itemVariants}
        className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)] overflow-hidden mb-6 relative'
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)" }}
      >
        <div className='flex items-center gap-3 mb-6'>
          <svg
            className='w-6 h-6 text-[var(--accent-tertiary)]'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            />
          </svg>
          <h2 className='text-xl font-bold text-[var(--text-primary)]'>
            Настройки профиля
          </h2>
        </div>

        <div className='space-y-6'>
          {/* Discord тег */}
          <div className='p-4 bg-[var(--bg-tertiary)]/50 rounded-xl border border-[var(--border-color)]'>
            <h3 className='font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2'>
              <svg
                className='w-5 h-5 opacity-70'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.127 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z' />
              </svg>
              Discord тег
            </h3>
            <div className='flex items-start flex-col gap-3'>
              {isEditingDiscord ? (
                <div className='w-full'>
                  <input
                    type='text'
                    value={discordTag}
                    onChange={handleDiscordTagChange}
                    className='w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded text-[var(--text-primary)]'
                    placeholder='Введите ваш Discord тег'
                    autoFocus
                  />
                  {discordError && (
                    <p className='text-xs text-red-500 mt-1'>{discordError}</p>
                  )}
                  <div className='flex gap-2 mt-3'>
                    <button
                      onClick={handleDiscordTagSave}
                      disabled={!!discordError}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                        discordError
                          ? "bg-gray-500/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      } text-white`}
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDiscord(false)
                        setDiscordTag(profile?.discordTag || "")
                        setDiscordError("")
                      }}
                      className='px-4 py-2 text-sm bg-[var(--bg-tertiary)]/80 hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg'
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex justify-between w-full items-center'>
                  <div>
                    <p className='text-[var(--text-primary)]'>
                      {profile?.discordTag || "Не указан"}
                    </p>
                    <p className='text-xs text-[var(--text-tertiary)]'>
                      Ваш Discord тег будет виден другим пользователям
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {showSaved && (
                      <span className='text-xs text-green-500'>Сохранено!</span>
                    )}
                    <button
                      onClick={() => setIsEditingDiscord(true)}
                      className='p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)] transition-colors'
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
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
