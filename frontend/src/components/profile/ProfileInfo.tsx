import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { FC, useState } from 'react'

interface Profile {
  discordTag?: string
  lastLoginAt?: string
  memberSince?: string
  createdAt?: string
  profileUrl?: string
  displayName: string
}

interface ProfileInfoProps {
  profile: Profile
  isOwnProfile: boolean
}

export const ProfileInfo: FC<ProfileInfoProps> = ({
  profile,
  isOwnProfile,
}) => {
  const [showCopiedDiscord, setShowCopiedDiscord] = useState(false)

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

  const copyDiscordTag = async () => {
    try {
      await navigator.clipboard.writeText(profile.discordTag || '')
      setShowCopiedDiscord(true)
      setTimeout(() => setShowCopiedDiscord(false), 2000)
    } catch (err) {
      console.error('Error copying discord tag:', err)
    }
  }

  return (
    <motion.div initial='hidden' animate='visible' variants={containerVariants}>
      <motion.div
        variants={itemVariants}
        className='bg-gradient-to-br from-[var(--card-bg)] to-[rgba(var(--bg-tertiary-rgb),0.8)] backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)] overflow-hidden mb-6 relative'
        whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)' }}
      >
        <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-cyan-500/10 to-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl'></div>
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

        <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-amber-400 mb-6'>
          Профиль
        </h2>

        <div className='space-y-6'>
          <div className='flex flex-wrap md:flex-nowrap gap-4 items-start'>
            <div className='w-16 h-16 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/15 to-amber-500/10 flex items-center justify-center text-[var(--accent-tertiary)]'>
              <svg
                className='w-8 h-8 md:w-7 md:h-7'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z' />
              </svg>
            </div>

            <div className='flex-1'>
              <h3 className='text-md font-semibold text-[var(--text-primary)] mb-1.5'>
                Steam профиль
              </h3>
              <div className='flex items-center gap-2'>
                <a
                  href={profile.profileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)] transition-colors flex items-center gap-2 group'
                >
                  <span>{profile.displayName}</span>
                  <svg
                    className='w-4 h-4 opacity-70 group-hover:opacity-100 transition-all group-hover:translate-x-0.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                    />
                  </svg>
                </a>
              </div>
              <p className='text-xs text-[var(--text-secondary)] mt-1'>
                Профиль Steam пользователя
              </p>
            </div>
          </div>

          {profile.discordTag && (
            <div className='flex flex-wrap md:flex-nowrap gap-4 items-start'>
            <div className='w-16 h-16 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/15 to-amber-500/10 flex items-center justify-center text-[var(--accent-tertiary)]'>
                <svg
                  className='w-8 h-8 md:w-7 md:h-7'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.127 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z' />
                </svg>
              </div>

              <div className='flex-1'>
                <h3 className='text-md font-semibold text-[var(--text-primary)] mb-1.5'>
                  Discord
                </h3>
                <div className='flex items-center gap-2'>
                  <span
                    className='relative cursor-pointer group text-[var(--accent-tertiary)] hover:text-[var(--accent-secondary)] transition-colors'
                    onClick={copyDiscordTag}
                  >
                    {profile.discordTag}
                    {showCopiedDiscord && (
                      <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--bg-secondary)] text-xs rounded shadow-md'>
                        Скопировано!
                      </span>
                    )}
                    <span className='hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--bg-secondary)] text-xs rounded shadow-md'>
                      Нажмите чтобы скопировать
                    </span>
                  </span>
                </div>
                <p className='text-xs text-[var(--text-secondary)] mt-1'>
                  Discord пользователя
                </p>
              </div>
            </div>
          )}

          {profile.lastLoginAt && !isOwnProfile && (
            <div className='flex flex-wrap md:flex-nowrap gap-4 items-start'>
            <div className='w-16 h-16 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/15 to-amber-500/10 flex items-center justify-center text-[var(--accent-tertiary)]'>
                <svg
                  className='w-8 h-8 md:w-7 md:h-7'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>

              <div className='flex-1'>
                <h3 className='text-md font-semibold text-[var(--text-primary)] mb-1.5'>
                  Последняя активность
                </h3>
                <div className='text-[var(--text-primary)]'>
                  {format(
                    new Date(profile.lastLoginAt),
                    "d MMMM yyyy 'в' HH:mm",
                    {
                      locale: ru,
                    }
                  )}
                </div>
                <p className='text-xs text-[var(--text-secondary)] mt-1'>
                  Был в сети
                </p>
              </div>
            </div>
          )}

          {profile.memberSince && (
            <div className='flex flex-wrap md:flex-nowrap gap-4 items-start'>
            <div className='w-16 h-16 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/15 to-amber-500/10 flex items-center justify-center text-[var(--accent-tertiary)]'>
                <svg
                  className='w-8 h-8 md:w-7 md:h-7'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>

              <div className='flex-1'>
                <h3 className='text-md font-semibold text-[var(--text-primary)] mb-1.5'>
                  На GameCheck с
                </h3>
                <div className='text-[var(--text-primary)]'>
                  {format(
                    new Date(profile.memberSince || profile.createdAt || ''),
                    'd MMMM yyyy',
                    { locale: ru }
                  )}
                </div>
                <p className='text-xs text-[var(--text-secondary)] mt-1'>
                  Дата присоединения
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
