export const timeAgo = (date: string | Date): string => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  )

  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + ' лет назад'
  }

  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' мес. назад'
  }

  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' дн. назад'
  }

  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' ч. назад'
  }

  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' мин. назад'
  }

  return Math.floor(seconds) + ' сек. назад'
}
