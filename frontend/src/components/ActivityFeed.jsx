import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { ACTIVITY_TYPES } from "../constants"
import { timeAgo } from "../utils/dateFormatter"

export const ActivityFeed = ({ userId = null }) => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = userId
          ? await api.activities.getUserActivity(userId)
          : await api.activities.getFeed()

        console.log("Полученные активности:", response.data)
        setActivities(response.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
        console.error("Ошибка при загрузке активности:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId])

  // Функция для получения соответствующего текста статуса
  const getStatusLabel = status => {
    switch (status) {
      case "playing":
        return "Играю"
      case "completed":
        return "Пройдено"
      case "plan_to_play":
        return "Планирую"
      case "dropped":
        return "Брошено"
      default:
        return status
    }
  }

  const renderActivityContent = activity => {
    const { type, user, progress, targetUser } = activity

    switch (type) {
      case "add_game":
        if (!progress) return <span>добавил(а) игру</span>
        return (
          <span>
            добавил(а) игру{" "}
            <span className='font-medium text-blue-400'>{progress.name}</span> в
            список "{getStatusLabel(progress.status)}"
          </span>
        )
      case "update_game":
      case "update_status":
        if (!progress) return <span>изменил(а) статус игры</span>
        return (
          <span>
            изменил(а) статус игры{" "}
            <span className='font-medium text-blue-400'>{progress.name}</span>{" "}
            на "{getStatusLabel(progress.status)}"
          </span>
        )
      case "rate_game":
        if (!progress) return <span>оценил(а) игру</span>
        return (
          <span>
            оценил(а) игру{" "}
            <span className='font-medium text-blue-400'>{progress.name}</span>{" "}
            на {progress.rating}/10
          </span>
        )
      case "follow":
        if (!targetUser) return <span>подписался(ась) на пользователя</span>
        return (
          <span>
            подписался(ась) на{" "}
            <Link
              to={`/profile/${targetUser.id}`}
              className='font-medium text-blue-400 hover:text-blue-300'
            >
              {targetUser.displayName}
            </Link>
          </span>
        )
      default:
        return <span>{type}</span>
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-[#1a1f2e] border border-red-400/30 rounded-lg p-4'>
        <p className='text-red-400 text-center'>
          Ошибка загрузки ленты: {error}
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold mb-4 text-white'>
        Лента активности
      </h2>
      {activities.length === 0 ? (
        <div className='bg-[#1a1f2e] border border-[#2563eb]/10 rounded-lg p-6 text-center'>
          <p className='text-gray-400'>
            {userId
              ? "У пользователя пока нет активности"
              : "Нет новых обновлений"}
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {activities.map(activity => (
            <div
              key={activity.id}
              className='flex items-start p-4 bg-[#1a1f2e] rounded-lg shadow-md border border-[#2563eb]/10 hover:border-[#2563eb]/20 transition-all'
            >
              <Link
                to={`/profile/${activity.user.id}`}
                className='flex-shrink-0'
              >
                <img
                  src={activity.user.avatarUrl}
                  alt={activity.user.displayName}
                  className='w-10 h-10 rounded-full ring-1 ring-[#2563eb]/20'
                />
              </Link>
              <div className='ml-3 flex-grow'>
                <div>
                  <Link
                    to={`/profile/${activity.user.id}`}
                    className='font-medium text-[#2563eb]'
                  >
                    {activity.user.displayName}
                  </Link>{" "}
                  <span className='text-gray-300'>
                    {renderActivityContent(activity)}
                  </span>
                </div>
                <div className='text-sm text-gray-400 mt-1'>
                  {new Date(activity.createdAt).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
