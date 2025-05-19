import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import GameList from "../components/GameList"
import { ActivityFeed } from "../components/ActivityFeed"
import { Modal } from "../components/common/Modal"
import { ThemeToggle } from "../components/common/ThemeToggle"
import api from "../services/api"

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
  const [isEditingDiscord, setIsEditingDiscord] = useState(false)
  const [discordTag, setDiscordTag] = useState("")
  const [discordError, setDiscordError] = useState("")
  const [showCopied, setShowCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("progress")
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [id])

  useEffect(() => {
    const handleEditModeEvent = event => {
      setIsEditMode(event.detail.enable)
    }

    window.addEventListener("gamecheck:edit-mode", handleEditModeEvent)

    return () => {
      window.removeEventListener("gamecheck:edit-mode", handleEditModeEvent)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const profileResponse = await api.users.getProfile(id)
      const currentProfile = profileResponse.data
      setProfile(currentProfile)

      const gamesResponse = await api.games.getUserGames(id)
      setGames(gamesResponse.data)

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

        console.log("Успешно отписался от пользователя")
      } else {
        await api.subscriptions.follow(id)
        setProfile(prev => ({
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1,
        }))

        const followersResponse = await api.subscriptions.getFollowers(id)
        setFollowers(followersResponse.data)

        console.log("Успешно подписался на пользователя")
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
      await api.users.updateProfile({ discordTag })
      setProfile(prev => ({ ...prev, discordTag }))
      setIsEditingDiscord(false)
      setDiscordError("")
    } catch (err) {
      console.error("Error updating discord tag:", err)
      setDiscordError(
        err.response?.data?.message || "Ошибка при обновлении тега"
      )
    }
  }

  const copyDiscordTag = async () => {
    try {
      await navigator.clipboard.writeText(profile.discordTag)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      console.error("Error copying discord tag:", err)
    }
  }

  useEffect(() => {
    if (profile) {
      setDiscordTag(profile.discordTag || "")
    }
  }, [profile])

  // Проверяем, является ли профиль текущего пользователя
  const isOwnProfile = currentUser && profile && currentUser.id === profile.id

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-primary)] border-t-transparent'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600 text-center'>{error}</p>
          <div className='mt-4 text-center'>
            <button
              onClick={() => navigate("/")}
              className='text-[var(--accent-primary)] hover:underline'
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
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <p className='text-yellow-600 text-center'>Профиль не найден</p>
          <div className='mt-4 text-center'>
            <button
              onClick={() => navigate("/")}
              className='text-[var(--accent-primary)] hover:underline'
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getAverageRating = () => {
    const ratedGames = games.filter(game => game.rating)
    if (ratedGames.length === 0) return 0
    const sum = ratedGames.reduce((acc, game) => acc + (game.rating || 0), 0)
    return (sum / ratedGames.length).toFixed(1)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-[var(--card-bg)] shadow rounded-lg p-4 sm:p-6 mb-8'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className='w-16 sm:w-20 h-16 sm:h-20 rounded-full flex-shrink-0'
          />
          <div className='flex-1 w-full'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold'>
                  {profile.displayName}
                </h1>
                {games.length > 0 && (
                  <div className='flex flex-wrap items-center gap-2 mt-1'>
                    <span className='text-[var(--accent-secondary)] font-semibold text-sm sm:text-base'>
                      {getAverageRating()}
                    </span>
                    <span className='text-[var(--text-secondary)] text-sm'>
                      средняя оценка ({games.filter(game => game.rating).length}{" "}
                      {games.filter(game => game.rating).length === 1
                        ? "игра"
                        : "игр"}
                      )
                    </span>
                  </div>
                )}
                {/* Счетчики игр */}
                <div className='flex flex-wrap mt-1 gap-2'>
                  <span className='text-[var(--text-secondary)] text-sm'>
                    {games.length} игр всего
                  </span>
                  <span className='text-[var(--text-secondary)] text-sm px-2'>
                    •
                  </span>
                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className='text-[var(--accent-secondary)] hover:text-[var(--accent-tertiary)] text-sm'
                  >
                    {profile.followersCount} подписчиков
                  </button>
                  <span className='text-[var(--text-secondary)] text-sm px-2'>
                    •
                  </span>
                  <button
                    onClick={() => setShowFollowingModal(true)}
                    className='text-[var(--accent-secondary)] hover:text-[var(--accent-tertiary)] text-sm'
                  >
                    {profile.followingCount} подписок
                  </button>
                </div>
              </div>

              {/* Кнопка подписки */}
              <div className='mt-2 sm:mt-0'>
                {isOwnProfile ? (
                  <span className='text-[var(--text-secondary)] text-sm py-1 px-3 rounded-full bg-[var(--bg-tertiary)]/80 border border-[var(--border-color)]'>
                    Это ваш профиль
                  </span>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 ${
                      profile.isFollowing
                        ? "bg-[var(--bg-tertiary)]/80 hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        : "bg-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/30 text-[var(--accent-secondary)]"
                    } rounded-lg transition-all duration-200 text-sm sm:text-base font-medium`}
                  >
                    {profile.isFollowing ? "Отписаться" : "Подписаться"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Навигационные вкладки */}
      <div className='mb-6 border-b border-[var(--border-color)]'>
        <div className='flex flex-wrap -mb-px'>
          <button
            onClick={() => setActiveTab("progress")}
            className={`inline-block py-3 px-4 font-medium text-sm sm:text-base border-b-2 transition-colors ${
              activeTab === "progress"
                ? "border-[var(--accent-primary)] text-[var(--accent-secondary)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)]"
            }`}
          >
            Прогресс ({games.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`inline-block py-3 px-4 font-medium text-sm sm:text-base border-b-2 transition-colors ${
              activeTab === "activity"
                ? "border-[var(--accent-primary)] text-[var(--accent-secondary)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)]"
            }`}
          >
            Активность
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`inline-block py-3 px-4 font-medium text-sm sm:text-base border-b-2 transition-colors ${
              activeTab === "info"
                ? "border-[var(--accent-primary)] text-[var(--accent-secondary)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)]"
            }`}
          >
            Информация
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`inline-block py-3 px-4 font-medium text-sm sm:text-base border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-[var(--accent-primary)] text-[var(--accent-secondary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)]"
              }`}
            >
              Настройки
            </button>
          )}
        </div>
      </div>

      {/* Содержимое вкладок */}
      <div className='tab-content'>
        {/* Вкладка Прогресс */}
        {activeTab === "progress" && (
          <div>
            {isOwnProfile && (
              <div className='flex justify-end mb-4'>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
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
                  {isEditMode
                    ? "Выйти из режима редактирования"
                    : "Редактировать"}
                </button>
              </div>
            )}
            <GameList
              games={games}
              onUpdate={fetchProfile}
              editable={isOwnProfile && isEditMode}
              isOwner={isOwnProfile}
            />
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
          <div className='bg-[var(--card-bg)] shadow rounded-lg p-6'>
            <h2 className='text-lg font-bold mb-4'>
              Информация о пользователе
            </h2>
            <div className='space-y-4'>
              {/* Steam аккаунт */}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <div className='flex items-center gap-2 min-w-[140px]'>
                  <svg
                    className='w-5 h-5 text-[var(--text-secondary)]'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z' />
                  </svg>
                  <span className='text-[var(--text-secondary)]'>Steam:</span>
                </div>
                <a
                  href={profile.steamProfileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[var(--accent-secondary)] hover:text-[var(--accent-tertiary)] transition-colors'
                >
                  {profile.displayName}
                </a>
              </div>

              {/* Discord тег */}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <div className='flex items-center gap-2 min-w-[140px]'>
                  <svg
                    className='w-5 h-5 text-[var(--text-secondary)]'
                    viewBox='0 0 127.14 96.36'
                    fill='currentColor'
                  >
                    <path d='M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z' />
                  </svg>
                  <span className='text-[var(--text-secondary)]'>Discord:</span>
                </div>
                {isOwnProfile ? (
                  isEditingDiscord ? (
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full'>
                      <input
                        type='text'
                        value={discordTag}
                        onChange={handleDiscordTagChange}
                        placeholder='Введите тег Discord'
                        className='px-3 py-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all text-sm w-full sm:w-48'
                      />
                      <div className='flex gap-2 w-full sm:w-auto'>
                        <button
                          onClick={handleDiscordTagSave}
                          className='flex-1 sm:flex-none px-3 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-secondary)] rounded-lg hover:bg-[var(--accent-primary)]/30 transition-all duration-200 text-sm font-medium'
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingDiscord(false)
                            setDiscordTag(profile.discordTag || "")
                            setDiscordError("")
                          }}
                          className='flex-1 sm:flex-none px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-200 text-sm font-medium'
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingDiscord(true)}
                      className='text-[var(--accent-secondary)] hover:text-[var(--accent-tertiary)] transition-colors flex items-center gap-2'
                    >
                      <span>{profile.discordTag || "не указано"}</span>
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
                          d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                        />
                      </svg>
                    </button>
                  )
                ) : (
                  <button
                    onClick={profile.discordTag ? copyDiscordTag : undefined}
                    className={`text-[var(--accent-secondary)] transition-colors relative ${
                      profile.discordTag
                        ? "hover:text-[var(--accent-tertiary)] cursor-pointer"
                        : "opacity-70"
                    }`}
                  >
                    {profile.discordTag || "не указано"}
                    {profile.discordTag && (
                      <span
                        className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs rounded shadow-lg ${
                          showCopied ? "opacity-100" : "opacity-0"
                        } transition-opacity`}
                      >
                        Скопировано!
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Последний вход */}
              {profile.lastLoginAt && !isOwnProfile && (
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <div className='flex items-center gap-2 min-w-[140px]'>
                    <svg
                      className='w-5 h-5 text-[var(--text-secondary)]'
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
                    <span className='text-[var(--text-secondary)]'>
                      Был в сети:
                    </span>
                  </div>
                  <span className='text-[var(--text-primary)]'>
                    {format(
                      new Date(profile.lastLoginAt),
                      "d MMMM yyyy 'в' HH:mm",
                      { locale: ru }
                    )}
                  </span>
                </div>
              )}

              {discordError && (
                <p className='text-red-400 text-sm mt-2'>{discordError}</p>
              )}
            </div>
          </div>
        )}

        {/* Вкладка Настройки (только для владельца профиля) */}
        {activeTab === "settings" && isOwnProfile && (
          <div className='bg-[var(--card-bg)] shadow rounded-lg p-6'>
            <h2 className='text-lg font-bold mb-4'>Настройки</h2>
            <div className='space-y-6'>
              <div>
                <h3 className='text-md font-semibold mb-2'>Настройки темы</h3>
                <div className='p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]'>
                  <div className='flex items-center justify-between'>
                    <span>Тема приложения</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно подписчиков */}
      <Modal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title='Подписчики'
      >
        <div className='space-y-4'>
          {followers.length === 0 ? (
            <p className='text-[var(--text-secondary)] text-center'>
              Нет подписчиков
            </p>
          ) : (
            followers.map(follower => (
              <div
                key={follower.id}
                className='flex items-center gap-4 p-2 hover:bg-[var(--bg-secondary)]/60 rounded-lg'
              >
                <img
                  src={follower.avatarUrl}
                  alt={follower.displayName}
                  className='w-10 h-10 rounded-full flex-shrink-0 ring-1 ring-[var(--border-color)]'
                />
                <Link
                  to={`/profile/${follower.id}`}
                  onClick={() => setShowFollowersModal(false)}
                  className='font-medium text-[var(--accent-secondary)] hover:text-[var(--accent-tertiary)]'
                >
                  {follower.displayName}
                </Link>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Модальное окно подписок */}
      <Modal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title='Подписки'
      >
        <div className='space-y-4'>
          {following.length === 0 ? (
            <p className='text-[var(--text-secondary)] text-center'>
              Нет подписок
            </p>
          ) : (
            following.map(followedUser => (
              <div
                key={followedUser.id}
                className='flex items-center gap-4 p-2 hover:bg-[var(--bg-secondary)]/60 rounded-lg'
              >
                <img
                  src={followedUser.avatarUrl}
                  alt={followedUser.displayName}
                  className='w-10 h-10 rounded-full flex-shrink-0 ring-1 ring-[var(--border-color)]'
                />
                <Link
                  to={`/profile/${followedUser.id}`}
                  onClick={() => setShowFollowingModal(false)}
                  className='font-medium text-[var(--accent-secondary)] hover:text-[var(--accent-tertiary)]'
                >
                  {followedUser.displayName}
                </Link>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}
