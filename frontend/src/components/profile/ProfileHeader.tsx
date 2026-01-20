import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { motion } from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'

interface Profile {
  displayName: string
  avatarUrl: string
  verified?: boolean
  isOnline?: boolean
  discordTag?: string
  lastLoginAt?: string
  memberSince?: string
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
}

interface ProfileHeaderProps {
  profile: Profile | null
  isOwnProfile: boolean
  followers: any[]
  following: any[]
  onFollow: () => void
  showFollowersModal: () => void
  showFollowingModal: () => void
  gamesCount: number
  updateProfile: (updates: any) => Promise<void>
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile,
  followers,
  following,
  onFollow,
  showFollowersModal,
  showFollowingModal,
  gamesCount,
  updateProfile,
}) => {
  const [isEditingDiscord, setIsEditingDiscord] = useState(false)
  const [discordTag, setDiscordTag] = useState(profile?.discordTag || '')
  const [discordError, setDiscordError] = useState('')
  const [showCopied, setShowCopied] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren' as const,
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const pulseVariant = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 0.9],
      transition: { repeat: Infinity, duration: 2.5 },
    },
  }

  const handleDiscordTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    if (value.length > 20) return
    if (!/^[a-z]*$/.test(value) && value !== '') {
      setDiscordError('Только английские буквы в нижнем регистре')
      return
    }
    setDiscordError('')
    setDiscordTag(value)
  }

  const handleDiscordTagSave = async () => {
    if (discordTag.length < 4 && discordTag !== '') {
      setDiscordError('Минимум 4 символа')
      return
    }
    try {
      await updateProfile({ discordTag })
      setIsEditingDiscord(false)
      setDiscordError('')
    } catch (err: any) {
      console.error('Error updating discord tag:', err)
      setDiscordError(
        err.response?.data?.message || 'Ошибка при обновлении тега',
      )
    }
  }

  const copyDiscordTag = async () => {
    try {
      if (profile?.discordTag) {
        await navigator.clipboard.writeText(profile.discordTag)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
      }
    } catch (err) {
      console.error('Error copying discord tag:', err)
    }
  }

  useEffect(() => {
    if (profile) {
      setDiscordTag(profile.discordTag || '')
    }
  }, [profile])

  if (!profile) return null

  return (
    <motion.div
      className='relative mb-8 overflow-hidden'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <motion.div
        className='h-48 sm:h-64 md:h-80 rounded-xl shadow-xl relative overflow-hidden'
        variants={itemVariants}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 opacity-85'></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>

        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-1/3 left-20 w-72 h-72 bg-pink-600 opacity-20 rounded-full filter blur-3xl'></div>
          <div className='absolute top-10 right-20 w-48 h-48 bg-indigo-700 opacity-20 rounded-full filter blur-3xl'></div>
          <div className='absolute bottom-10 right-1/3 w-64 h-64 bg-purple-600 opacity-20 rounded-full filter blur-3xl'></div>
        </div>

        <motion.div
          className='absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent'
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </motion.div>

      <div className='container mx-auto px-4 relative'>
        <div className='flex flex-col md:flex-row gap-6 -mt-20 md:-mt-24'>
          <motion.div variants={itemVariants} className='relative z-10'>
            <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--bg-primary)] overflow-hidden shadow-xl bg-[var(--card-bg)] relative group'>
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
              />
            </div>
            {profile.isOnline && (
              <motion.div
                className='absolute bottom-1 right-1 md:bottom-3 md:right-3 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-[var(--bg-primary)]'
                variants={pulseVariant}
                animate='pulse'
              />
            )}
          </motion.div>

          <div className='flex-1'>
            <motion.div
              variants={itemVariants}
              className='flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4'
            >
              <div>
                <h1 className='text-2xl md:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2'>
                  {profile.displayName}
                  {profile.verified && (
                    <span
                      className='text-blue-400'
                      title='Подтверждённый профиль'
                    >
                      <svg
                        className='w-5 h-5 md:w-6 md:h-6'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  )}
                </h1>

                <div className='mt-1 flex flex-wrap items-center gap-3 text-[var(--text-secondary)] text-sm'>
                  <div className='flex items-center gap-1'>
                    <svg
                      className='w-4 h-4 opacity-70'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.127 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z' />
                    </svg>
                    {isOwnProfile && isEditingDiscord ? (
                      <div>
                        <input
                          type='text'
                          value={discordTag}
                          onChange={handleDiscordTagChange}
                          className='px-2 py-1 text-sm bg-[var(--input-bg)] border border-[var(--border-color)] rounded text-[var(--text-primary)]'
                          autoFocus
                          onBlur={() => {
                            if (!discordError) handleDiscordTagSave()
                          }}
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                          ) => {
                            if (e.key === 'Enter' && !discordError) {
                              handleDiscordTagSave()
                            }
                          }}
                        />
                        {discordError && (
                          <p className='text-xs text-red-500 mt-1'>
                            {discordError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className='flex items-center gap-1'>
                        {!isOwnProfile && profile.discordTag && (
                          <span
                            className='relative cursor-pointer group'
                            onClick={copyDiscordTag}
                          >
                            {profile.discordTag}
                            {showCopied && (
                              <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--bg-secondary)] text-xs rounded shadow-md'>
                                Скопировано!
                              </span>
                            )}
                            <span className='hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--bg-secondary)] text-xs rounded shadow-md'>
                              Нажмите чтобы скопировать
                            </span>
                          </span>
                        )}
                        {isOwnProfile && (
                          <span className='flex items-center gap-1'>
                            {profile.discordTag || 'Не указан'}
                            <button
                              onClick={() => setIsEditingDiscord(true)}
                              className='text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)]'
                              title='Редактировать Discord тег'
                            >
                              <svg
                                className='w-3.5 h-3.5'
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
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {profile.lastLoginAt && !isOwnProfile && (
                    <span className='flex items-center gap-1'>
                      <svg
                        className='w-4 h-4 opacity-70'
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
                      Был в сети:{' '}
                      {format(new Date(profile.lastLoginAt), 'd MMMM', {
                        locale: ru,
                      })}
                    </span>
                  )}
                  {profile.memberSince && (
                    <span className='flex items-center gap-1'>
                      <svg
                        className='w-4 h-4 opacity-70'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                      С нами с{' '}
                      {format(new Date(profile.memberSince), 'MMMM yyyy', {
                        locale: ru,
                      })}
                    </span>
                  )}
                  {isOwnProfile && (
                    <span className='py-1 px-2 text-xs bg-[var(--accent-primary)]/20 rounded-full text-[var(--accent-tertiary)]'>
                      Это ваш профиль
                    </span>
                  )}
                </div>
              </div>

              <div className='mt-2 sm:mt-0'>
                {!isOwnProfile && (
                  <motion.button
                    onClick={onFollow}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      profile.isFollowing
                        ? 'bg-[var(--bg-tertiary)]/80 hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-indigo-500/20'
                    }`}
                  >
                    {profile.isFollowing ? 'Отписаться' : 'Подписаться'}
                  </motion.button>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='mt-6 flex flex-wrap gap-6 sm:gap-8 md:gap-12'
            >
              <motion.button
                onClick={() => showFollowersModal()}
                whileHover={{ y: -2 }}
                className='group flex items-center gap-3'
              >
                <div className='h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-300'>
                  <svg
                    className='w-5 h-5 text-blue-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-tertiary)] transition-colors'>
                    {profile.followersCount || followers?.length || 0}
                  </span>
                  <span className='text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'>
                    Подписчиков
                  </span>
                </div>
              </motion.button>

              <motion.button
                onClick={() => showFollowingModal()}
                whileHover={{ y: -2 }}
                className='group flex items-center gap-3'
              >
                <div className='h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/30 group-hover:to-purple-600/30 transition-all duration-300'>
                  <svg
                    className='w-5 h-5 text-purple-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-tertiary)] transition-colors'>
                    {profile.followingCount || following?.length || 0}
                  </span>
                  <span className='text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'>
                    Подписок
                  </span>
                </div>
              </motion.button>

              <div className='group flex items-center gap-3'>
                <div className='h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-600/20 to-red-600/20 group-hover:from-pink-600/30 group-hover:to-red-600/30 transition-all duration-300'>
                  <svg
                    className='w-5 h-5 text-pink-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
                    />
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold text-[var(--text-primary)]'>
                    {gamesCount}
                  </span>
                  <span className='text-sm text-[var(--text-secondary)]'>
                    Игр в коллекции
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
