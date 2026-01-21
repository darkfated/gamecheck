import { motion } from 'framer-motion'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Modal from '../components/common/Modal'
import { ActivityFeed } from '../components/feed/ActivityFeed'
import GameProgressSection from '../components/games/GameProgressSection'
import { GameStats } from '../components/profile/GameStats'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileInfo } from '../components/profile/ProfileInfo'
import { ProfileSettings } from '../components/profile/ProfileSettings'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { getStatusOptions } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

interface ProfileData {
  id: string
  displayName: string
  avatarUrl: string
  verified?: boolean
  isOnline?: boolean
  discordTag?: string
  lastLoginAt?: string
  memberSince?: string
  profileUrl?: string
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
}

interface Game {
  id: string
  name: string
  status: string
  rating?: number | null
  review?: string
  description?: string
}

interface Tab {
  id: string
  label: string
}

interface UserProfile {
  id: string
  displayName: string
  avatarUrl: string
}

const safeFetch = async <T,>(fn: () => Promise<{ data: T }>, fallback: T) => {
  try {
    const res = await fn()
    return res.data
  } catch (err) {
    console.error(err)
    return fallback
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const Profile: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [followers, setFollowers] = useState<UserProfile[]>([])
  const [following, setFollowing] = useState<UserProfile[]>([])
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [activeTab, setActiveTab] = useState('progress')
  const [followLoading, setFollowLoading] = useState(false)
  const [listsLoaded, setListsLoaded] = useState(false)

  const statusOptions = useMemo(() => getStatusOptions(), [])

  const isOwnProfile: boolean = Boolean(
    currentUser && profile && currentUser.id === profile.id,
  )

  const profileTabs: Tab[] = useMemo(
    () => [
      { id: 'progress', label: `Прогресс (${games.length})` },
      { id: 'activity', label: 'Активность' },
      { id: 'info', label: 'Информация' },
    ],
    [games.length],
  )

  const tabs: Tab[] = useMemo(
    () =>
      isOwnProfile
        ? [...profileTabs, { id: 'settings', label: 'Настройки' }]
        : profileTabs,
    [profileTabs, isOwnProfile],
  )

  const fetchProfile = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    setListsLoaded(false)

    try {
      const profileResponse = await api.users.getProfile(id)
      const currentProfile = profileResponse.data
      setProfile(currentProfile)

      const [gamesData, followersData, followingData] = await Promise.all([
        safeFetch(() => api.games.getUserGames(id), [] as Game[]),
        safeFetch(
          () => api.subscriptions.getFollowers(id),
          [] as UserProfile[],
        ),
        safeFetch(
          () => api.subscriptions.getFollowing(id),
          [] as UserProfile[],
        ),
      ])

      setGames(gamesData)
      setFollowers(followersData)
      setFollowing(followingData)
      setListsLoaded(true)

      if (currentUser && currentUser.id !== id) {
        const myFollowingResponse = await safeFetch(
          () => api.subscriptions.getFollowing(currentUser.id),
          [] as UserProfile[],
        )
        const isFollowing = myFollowingResponse.some(
          (u: UserProfile) => u.id === id,
        )
        setProfile(prev =>
          prev ? ({ ...prev, isFollowing } as ProfileData) : prev,
        )
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.response?.data?.message || 'Не удалось загрузить профиль')
    } finally {
      setLoading(false)
    }
  }, [id, currentUser])

  useEffect(() => {
    if (id) fetchProfile()
  }, [id, fetchProfile])

  const refreshFollowers = useCallback(async () => {
    if (!id) return
    const followersData = await safeFetch(
      () => api.subscriptions.getFollowers(id),
      [] as UserProfile[],
    )
    setFollowers(followersData)
  }, [id])

  const refreshFollowing = useCallback(async () => {
    if (!id) return
    const followingData = await safeFetch(
      () => api.subscriptions.getFollowing(id),
      [] as UserProfile[],
    )
    setFollowing(followingData)
  }, [id])

  const handleFollow = async () => {
    if (!profile || !id) return
    setFollowLoading(true)
    const isCurrentlyFollowing = Boolean(profile.isFollowing)

    setProfile(prev =>
      prev
        ? {
            ...prev,
            isFollowing: !isCurrentlyFollowing,
            followersCount: isCurrentlyFollowing
              ? Math.max(0, (prev.followersCount || 0) - 1)
              : (prev.followersCount || 0) + 1,
          }
        : prev,
    )

    try {
      if (isCurrentlyFollowing) {
        await api.subscriptions.unfollow(id)
      } else {
        await api.subscriptions.follow(id)
      }
      await refreshFollowers()
    } catch (err) {
      console.error('Error following/unfollowing:', err)
      await fetchProfile()
    } finally {
      setFollowLoading(false)
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      await api.users.updateProfile(updates)
      setProfile(prev => (prev ? { ...prev, ...updates } : prev))
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err)
      alert('Не удалось обновить профиль')
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
        <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-b-transparent border-indigo-500'></div>
        <p className='text-[var(--text-secondary)]'>Загрузка профиля...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-6 shadow-xl'>
          <p className='text-red-400 text-center text-xl font-bold mb-2'>
            {error}
          </p>
          <p className='text-[var(--text-secondary)] text-center mb-6'>
            Произошла ошибка при загрузке профиля
          </p>
          <div className='mt-4 text-center'>
            <button
              onClick={() => navigate('/')}
              className='text-[var(--accent-primary)] hover:underline px-6 py-2 rounded-lg bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-all duration-300'
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-6 shadow-xl'>
          <p className='text-yellow-400 text-center text-xl font-bold mb-2'>
            Профиль не найден
          </p>
          <p className='text-[var(--text-secondary)] text-center mb-6'>
            Пользователь не существует или был удален
          </p>
          <div className='mt-4 text-center'>
            <button
              onClick={() => navigate('/')}
              className='text-[var(--accent-primary)] hover:underline px-6 py-2 rounded-lg bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-all duration-300'
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        followers={followers}
        following={following}
        onFollow={handleFollow}
        showFollowersModal={() => setShowFollowersModal(true)}
        showFollowingModal={() => setShowFollowingModal(true)}
        gamesCount={games.length}
        updateProfile={updateProfile}
      />

      <div className='container mx-auto px-4 pb-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          <motion.div
            className='flex-1'
            initial='hidden'
            animate='show'
            variants={sectionVariants}
            key={activeTab}
          >
            {activeTab === 'progress' && profile && (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameProgressSection userId={id!} isOwner={isOwnProfile} />
                </motion.div>
              </div>
            )}

            {activeTab === 'activity' && profile && (
              <div>
                <ActivityFeed userId={id!} />
              </div>
            )}

            {activeTab === 'info' && profile && (
              <div>
                <ProfileInfo profile={profile} isOwnProfile={isOwnProfile} />
                <GameStats games={games} statusOptions={statusOptions} />
              </div>
            )}

            {activeTab === 'settings' && isOwnProfile && (
              <ProfileSettings
                profile={profile}
                updateProfile={updateProfile}
              />
            )}
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title='Подписчики'
      >
        <div className='space-y-3'>
          {!listsLoaded ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-b-transparent border-indigo-500' />
            </div>
          ) : followers.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 backdrop-blur-sm flex items-center justify-center'>
                <svg
                  className='w-10 h-10 text-[var(--accent-primary)]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <p className='text-[var(--text-primary)] text-xl font-medium bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent'>
                Нет подписчиков
              </p>
              <p className='text-[var(--text-secondary)]/70 mt-2 max-w-sm'>
                Когда у вас появятся подписчики, они будут отображаться здесь
              </p>
            </div>
          ) : (
            followers.map(follower => (
              <div
                key={follower.id}
                className='group relative flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 transition-all duration-300'
              >
                <div className='relative'>
                  <div className='absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 blur-sm'></div>
                  <img
                    src={follower.avatarUrl}
                    alt={follower.displayName}
                    className='relative w-12 h-12 rounded-full ring-2 ring-[var(--border-color)] group-hover:ring-[var(--accent-primary)]/30 transition-all duration-300'
                  />
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-[var(--card-bg)]'></div>
                </div>
                <Link
                  to={`/profile/${follower.id}`}
                  onClick={() => setShowFollowersModal(false)}
                  className='flex-1 min-w-0 group-hover:translate-x-1 transition-transform duration-300'
                >
                  <p className='font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate'>
                    {follower.displayName}
                  </p>
                </Link>
              </div>
            ))
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title='Подписки'
      >
        <div className='space-y-3'>
          {!listsLoaded ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-b-transparent border-indigo-500' />
            </div>
          ) : following.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 backdrop-blur-sm flex items-center justify-center'>
                <svg
                  className='w-10 h-10 text-[var(--accent-primary)]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
              </div>
              <p className='text-[var(--text-primary)] text-xl font-medium bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent'>
                Нет подписок
              </p>
              <p className='text-[var(--text-secondary)]/70 mt-2 max-w-sm'>
                Начните следить за другими пользователями, чтобы видеть их
                активность
              </p>
            </div>
          ) : (
            following.map(followedUser => (
              <div
                key={followedUser.id}
                className='group relative flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 transition-all duration-300'
              >
                <div className='relative'>
                  <div className='absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 blur-sm'></div>
                  <img
                    src={followedUser.avatarUrl}
                    alt={followedUser.displayName}
                    className='relative w-12 h-12 rounded-full ring-2 ring-[var(--border-color)] group-hover:ring-[var(--accent-primary)]/30 transition-all duration-300'
                  />
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-[var(--card-bg)]'></div>
                </div>
                <Link
                  to={`/profile/${followedUser.id}`}
                  onClick={() => setShowFollowingModal(false)}
                  className='flex-1 min-w-0 group-hover:translate-x-1 transition-transform duration-300'
                >
                  <p className='font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate'>
                    {followedUser.displayName}
                  </p>
                </Link>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Profile
