import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { useSubscriptions } from "../hooks/useSubscriptions"

export const SubscriptionsList = ({ userId, type = "followers" }) => {
  const {
    followers,
    following,
    loading,
    error,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
  } = useSubscriptions()

  useEffect(() => {
    if (type === "followers") {
      getFollowers(userId)
    } else {
      getFollowing(userId)
    }
  }, [userId, type, getFollowers, getFollowing])

  const users = type === "followers" ? followers : following

  if (loading) return <div className='text-center'>Загрузка...</div>
  if (error) return <div className='text-red-500'>Ошибка: {error}</div>

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>
        {type === "followers" ? "Подписчики" : "Подписки"}
      </h2>
      {users.length === 0 ? (
        <p className='text-gray-500'>
          {type === "followers" ? "Нет подписчиков" : "Нет подписок"}
        </p>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {users.map(user => (
            <div
              key={user.id}
              className='flex items-center p-4 bg-[#1a1f2e] rounded-lg shadow'
            >
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className='w-12 h-12 rounded-full'
              />
              <div className='ml-4 flex-grow'>
                <Link
                  to={`/profile/${user.id}`}
                  className='font-medium text-blue-600 hover:text-blue-800'
                >
                  {user.displayName}
                </Link>
                <a
                  href={`https://steamcommunity.com/profiles/${user.steamId}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-gray-500 hover:text-gray-700 block'
                >
                  Профиль Steam
                </a>
              </div>
              {type === "following" && (
                <button
                  onClick={() => unfollowUser(user.id)}
                  className='px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50'
                >
                  Отписаться
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
