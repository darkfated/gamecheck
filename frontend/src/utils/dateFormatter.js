export const formatDate = date => {
  return new Date(date).toLocaleString("ru", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const timeAgo = date => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + " лет назад"
  }

  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + " месяцев назад"
  }

  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + " дней назад"
  }

  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + " часов назад"
  }

  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + " минут назад"
  }

  return Math.floor(seconds) + " секунд назад"
}
