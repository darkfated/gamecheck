import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ActivityFeed } from "../components/feed/ActivityFeed"
import Modal from "../components/common/Modal"
import { ProfileHeader } from "../components/profile/ProfileHeader"
import { ProfileSidebar } from "../components/profile/ProfileSidebar"
import { ProfileInfo } from "../components/profile/ProfileInfo"
import { ProfileSettings } from "../components/profile/ProfileSettings"
import { GameStats } from "../components/profile/GameStats"
import GameProgressSection from "../components/games/GameProgressSection"
import { motion } from "framer-motion"
import api from "../services/api"
import { GAME_STATUSES, getStatusOptions } from "../constants"

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [activeTab, setActiveTab] = useState("progress")

  // Новое состояние для модального окна добавления игры
  const [showAddGameModal, setShowAddGameModal] = useState(false)
  const [newGame, setNewGame] = useState({
    name: "",
    status: GAME_STATUSES.PLAN_TO_PLAY,
    rating: null,
    review: "",
    description: "",
  })

  // Статусы для отображения в GameStats
  const statusOptions = getStatusOptions()

  const profileTabs = [
    { id: "progress", label: `Прогресс (${games.length})` },
    { id: "activity", label: "Активность" },
    { id: "info", label: "Информация" },
  ]

  const isOwnProfile = currentUser && profile && currentUser.id === profile.id
  const tabs = isOwnProfile
    ? [...profileTabs, { id: "settings", label: "Настройки" }]
    : profileTabs

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const profileResponse = await api.users.getProfile(id)
      const currentProfile = profileResponse.data
      setProfile(currentProfile)

      try {
        const gamesResponse = await api.games.getUserGames(id)
        setGames(gamesResponse.data)
      } catch (gameError) {
        console.error("Ошибка загрузки игр:", gameError)
        setGames([])
      }

      const followersResponse = await api.subscriptions.getFollowers(id)
      setFollowers(followersResponse.data)

      const followingResponse = await api.subscriptions.getFollowing(id)
      setFollowing(followingResponse.data)

      if (currentUser && currentUser.id !== id) {
        const myFollowingResponse = await api.subscriptions.getFollowing(
          currentUser.id
        )
        const isFollowing = myFollowingResponse.data.some(
          followedUser => followedUser.id === id
        )

        setProfile(prev => ({
          ...prev,
          isFollowing: isFollowing,
        }))
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError(err.response?.data?.message || "Не удалось загрузить профиль")
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      const isCurrentlyFollowing = profile.isFollowing

      if (isCurrentlyFollowing) {
        await api.subscriptions.unfollow(id)
        setProfile(prev => ({
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, prev.followersCount - 1),
        }))

        const followersResponse = await api.subscriptions.getFollowers(id)
        setFollowers(followersResponse.data)
      } else {
        await api.subscriptions.follow(id)
        setProfile(prev => ({
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1,
        }))

        const followersResponse = await api.subscriptions.getFollowers(id)
        setFollowers(followersResponse.data)
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error)
      try {
        const profileResponse = await api.users.getProfile(id)
        const profileData = profileResponse.data

        if (currentUser && currentUser.id !== id) {
          const myFollowingResponse = await api.subscriptions.getFollowing(
            currentUser.id
          )
          const isFollowing = myFollowingResponse.data.some(
            followedUser => followedUser.id === id
          )

          setProfile({
            ...profileData,
            isFollowing: isFollowing,
          })
        } else {
          setProfile(profileData)
        }
      } catch (refreshError) {
        console.error(
          "Error refreshing profile after follow/unfollow error:",
          refreshError
        )
      }
    }
  }

  // Функция для обновления профиля (включая Discord-тег)
  const updateProfile = async updates => {
    try {
      await api.users.updateProfile(updates)
      setProfile(prev => ({ ...prev, ...updates }))
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error)
      alert("Не удалось обновить профиль")
    }
  }

  // Функция для добавления новой игры
  const handleAddGame = async () => {
    try {
      const gameToAdd = {
        ...newGame,
        rating: newGame.rating ? Number(newGame.rating) : null,
      }
      await api.games.addGame(gameToAdd)
      setShowAddGameModal(false)
      setNewGame({
        name: "",
        status: GAME_STATUSES.PLAN_TO_PLAY,
        rating: null,
        review: "",
        description: "",
      })
      fetchProfile()
    } catch (error) {
      console.error("Ошибка при добавлении игры:", error)
      alert("Не удалось добавить игру")
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
              onClick={() => navigate("/")}
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
              onClick={() => navigate("/")}
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
      {/* Профиль пользователя */}
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
          {/* Боковая навигация */}
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
            profile={profile}
          />

          {/* Содержимое */}
          <motion.div
            className='flex-1'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={activeTab}
          >
            {/* Вкладка Прогресс */}
            {activeTab === "progress" && (
              <div>
                {/* Список игр */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameProgressSection
                    userId={id}
                    isOwner={isOwnProfile}
                  />
                </motion.div>
              </div>
            )}

            {/* Вкладка Активность */}
            {activeTab === "activity" && (
              <div>
                <ActivityFeed userId={id} />
              </div>
            )}

            {/* Вкладка Информация */}
            {activeTab === "info" && (
              <div>
                <ProfileInfo profile={profile} isOwnProfile={isOwnProfile} />
                <GameStats games={games} statusOptions={statusOptions} />
              </div>
            )}

            {/* Вкладка Настройки (только для владельца профиля) */}
            {activeTab === "settings" && isOwnProfile && (
              <ProfileSettings
                profile={profile}
                updateProfile={updateProfile}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Модальные окна */}
      <Modal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title='Подписчики'
      >
        <div className='space-y-3'>
          {followers.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 backdrop-blur-sm flex items-center justify-center'>
                <svg className="w-10 h-10 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className='text-[var(--text-primary)] text-xl font-medium bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent'>Нет подписчиков</p>
              <p className='text-[var(--text-secondary)]/70 mt-2 max-w-sm'>Когда у вас появятся подписчики, они будут отображаться здесь</p>
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
          {following.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 backdrop-blur-sm flex items-center justify-center'>
                <svg className="w-10 h-10 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className='text-[var(--text-primary)] text-xl font-medium bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent'>Нет подписок</p>
              <p className='text-[var(--text-secondary)]/70 mt-2 max-w-sm'>Начните следить за другими пользователями, чтобы видеть их активность</p>
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
