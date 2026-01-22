import { motion } from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'
import { ProfileStats } from './ProfileStats'

interface Profile {
  id: string
  displayName: string
  avatarUrl: string
  profileUrl: string
  steamId?: string
  discordTag?: string
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
  gamesCount?: number
  totalPlaytime?: number
  averageRating?: number
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
  followersCount?: number
  followingCount?: number
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
  followersCount = 0,
  followingCount = 0,
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
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600'
          animate={{ opacity: [0.7, 0.85, 0.7] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        ></motion.div>

        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f')] bg-cover bg-center"
          animate={{ opacity: [0.25, 0.35, 0.25] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        ></motion.div>

        <motion.div className='absolute inset-0 overflow-hidden'>
          <motion.div
            className='absolute top-1/3 left-20 w-72 h-72 bg-pink-600 opacity-15 rounded-full filter blur-3xl'
            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror' }}
          ></motion.div>
          <motion.div
            className='absolute top-10 right-20 w-48 h-48 bg-indigo-700 opacity-15 rounded-full filter blur-3xl'
            animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror' }}
          ></motion.div>
          <motion.div
            className='absolute bottom-10 right-1/3 w-64 h-64 bg-purple-600 opacity-15 rounded-full filter blur-3xl'
            animate={{ scale: [1, 1.07, 1], opacity: [0.15, 0.26, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror' }}
          ></motion.div>
        </motion.div>

        <motion.div
          className='absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent'
          animate={{ opacity: [0.7, 0.85, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror' }}
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
          </motion.div>

          <div className='flex-1'>
            <motion.div
              variants={itemVariants}
              className='flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4'
            >
              <div>
                <h1 className='text-2xl md:text-3xl font-bold text-[var(--text-primary)]'>
                  {profile.displayName}
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

                  {isOwnProfile && (
                    <span className='py-1 px-2 text-xs bg-[var(--accent-primary)]/20 rounded-full text-[var(--accent-tertiary)] select-none'>
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
              className='mt-8 flex flex-wrap gap-6 sm:gap-8 md:gap-12'
            >
              <ProfileStats
                followersCount={followersCount}
                followingCount={followingCount}
                gamesCount={gamesCount}
                followers={followers}
                following={following}
                onShowFollowersModal={showFollowersModal}
                onShowFollowingModal={showFollowingModal}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
