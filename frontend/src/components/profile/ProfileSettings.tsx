import { motion } from 'framer-motion'
import React, { FC, useState } from 'react'
import { ThemeToggle } from '../common/ThemeToggle'

interface Profile {
  discordTag?: string
}

interface ProfileSettingsProps {
  profile: Profile | null
  updateProfile: (updates: any) => Promise<void>
}

export const ProfileSettings: FC<ProfileSettingsProps> = ({
  profile,
  updateProfile,
}) => {
  const [discordTag, setDiscordTag] = useState(profile?.discordTag || '')
  const [discordError, setDiscordError] = useState('')
  const [isEditingDiscord, setIsEditingDiscord] = useState(false)
  const [, setShowSaved] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren' as const,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleDiscordTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    if (value.length > 20) return
    if (!/^[a-z0-9]*$/.test(value) && value !== '') {
      setDiscordError('Только английские буквы (a-z) и цифры (0-9)')
      return
    }
    setDiscordError('')
    setDiscordTag(value)
  }

  const handleDiscordTagSave = async () => {
    if (!discordTag && !profile?.discordTag) {
      return
    }
    if (discordTag && discordTag.length < 4) {
      setDiscordError('Минимум 4 символа')
      return
    }
    if (discordTag && discordTag.length > 20) {
      setDiscordError('Максимум 20 символов')
      return
    }
    if (discordTag && !/^[a-z0-9]+$/.test(discordTag)) {
      setDiscordError('Только английские буквы (a-z) и цифры (0-9)')
      return
    }
    try {
      await updateProfile({ discordTag })
      setIsEditingDiscord(false)
      setDiscordError('')
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    } catch (err: any) {
      console.error('Error updating discord tag:', err)
      setDiscordError(
        err.response?.data?.message || 'Ошибка при обновлении тега'
      )
    }
  }

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='space-y-8'
    >
      <motion.section
        variants={itemVariants}
        className='relative bg-gradient-to-br from-[var(--card-bg)] to-[rgba(var(--bg-tertiary-rgb),0.8)] backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)]'
      >
        <div className='flex items-center gap-3 mb-4'>
          <svg
            className='w-7 h-7 text-[var(--accent-tertiary)]'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            viewBox='0 0 24 24'
          >
            <circle cx='12' cy='12' r='3' />
            <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' />
          </svg>
          <h2 className='text-2xl font-semibold text-[var(--text-primary)] select-none'>
            Интерфейс
          </h2>
        </div>

        <div className='space-y-5'>
          <div className='p-4 bg-[rgba(var(--bg-tertiary-rgb),0.5)] rounded-xl border border-[var(--border-color)]'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium text-[var(--text-primary)]'>
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
      </motion.section>

      <motion.section
        variants={itemVariants}
        className='bg-gradient-to-br from-[var(--card-bg)] to-[rgba(var(--bg-tertiary-rgb),0.8)] backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)]'
      >
        <div className='flex items-center gap-3 mb-4'>
          <svg
            className='w-7 h-7 text-[var(--accent-tertiary)]'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            viewBox='0 0 24 24'
          >
            <path d='M5.121 17.804A8.966 8.966 0 0112 15c2.485 0 4.73.997 6.364 2.636M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
            <path d='M12 3a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9z' />
          </svg>
          <h2 className='text-2xl font-semibold text-[var(--text-primary)] select-none'>
            Профиль
          </h2>
        </div>

        <div className='space-y-5'>
          <div className='p-4 bg-[rgba(var(--bg-tertiary-rgb),0.5)] rounded-xl border border-[var(--border-color)]'>
            <h3 className='font-medium text-[var(--text-primary)] mb-3'>
              Discord тег
            </h3>

            {isEditingDiscord ? (
              <>
                <input
                  type='text'
                  value={discordTag}
                  onChange={handleDiscordTagChange}
                  className='w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded text-[var(--text-primary)]'
                  placeholder='Введите Discord тег'
                />
                {discordError && (
                  <p className='text-sm text-red-500'>{discordError}</p>
                )}
                <div className='flex gap-2 mt-3'>
                  <button
                    onClick={handleDiscordTagSave}
                    className='px-4 py-2 bg-gradient-to-r from-cyan-500 to-amber-500 text-[var(--button-text-on-accent)] rounded-lg'
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingDiscord(false)
                    }}
                    className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg'
                  >
                    Отмена
                  </button>
                </div>
              </>
            ) : (
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-[var(--text-primary)]'>
                    {profile?.discordTag || 'Не указан'}
                  </p>
                  <p className='text-xs text-[var(--text-tertiary)]'>
                    Отображается другим пользователям
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingDiscord(true)}
                  className='p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)]'
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
