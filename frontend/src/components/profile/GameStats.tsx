import { motion } from 'framer-motion'
import { FC, useEffect, useMemo, useRef } from 'react'

interface Game {
  id: string
  status: string
  rating?: number | null
}

interface StatusOption {
  value: string
  label: string
}

interface GameStatsProps {
  games?: Game[]
  statusOptions: StatusOption[]
}

interface Stats {
  total: number
  byStatus: Record<string, number>
  avgRating: number | string
  ratingCount: number
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'playing':
      return 'bg-green-500'
    case 'completed':
      return 'bg-blue-500'
    case 'plan_to_play':
      return 'bg-amber-500'
    case 'dropped':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getProgressColor = (status: string): string => {
  switch (status) {
    case 'playing':
      return 'bg-green-500'
    case 'completed':
      return 'bg-blue-500'
    case 'plan_to_play':
      return 'bg-amber-500'
    case 'dropped':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

export const GameStats: FC<GameStatsProps> = ({
  games = [],
  statusOptions,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stats: Stats = useMemo(() => {
    if (!Array.isArray(games) || games.length === 0) {
      return {
        total: 0,
        byStatus: statusOptions.reduce(
          (acc, status) => {
            acc[status.value] = 0
            return acc
          },
          {} as Record<string, number>
        ),
        avgRating: 0,
        ratingCount: 0,
      }
    }

    const byStatus = games.reduce(
      (acc, game) => {
        acc[game.status] = (acc[game.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const gamesWithRating = games.filter(
      game => game.rating !== null && game.rating !== undefined
    )
    const sumRatings = gamesWithRating.reduce(
      (sum, game) => sum + (game.rating || 0),
      0
    )
    const avgRating =
      gamesWithRating.length > 0
        ? (sumRatings / gamesWithRating.length).toFixed(1)
        : 0

    return {
      total: games.length,
      byStatus,
      avgRating,
      ratingCount: gamesWithRating.length,
    }
  }, [games, statusOptions])

  useEffect(() => {
    if (!canvasRef.current || stats.total === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let startAngle = 0
    let total = 0

    statusOptions.forEach(status => {
      total += stats.byStatus[status.value] || 0
    })

    if (total === 0) return

    statusOptions.forEach(status => {
      const value = stats.byStatus[status.value] || 0
      if (value === 0) return

      const sliceAngle = (2 * Math.PI * value) / total

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      let color: string
      switch (status.value) {
        case 'playing':
          color = '#10b981'
          break
        case 'completed':
          color = '#22d3ee'
          break
        case 'plan_to_play':
          color = '#f59e0b'
          break
        case 'dropped':
          color = '#ef4444'
          break
        default:
          color = '#6b7280'
      }

      ctx.fillStyle = color
      ctx.fill()

      startAngle += sliceAngle
    })

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fillStyle = 'var(--card-bg)'
    ctx.fill()

    ctx.font = 'bold 16px sans-serif'
    ctx.fillStyle = 'var(--text-primary)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(stats.total.toString(), centerX, centerY - 10)

    ctx.font = '12px sans-serif'
    ctx.fillStyle = 'var(--text-secondary)'
    ctx.fillText('игр', centerX, centerY + 10)
  }, [stats, statusOptions])

  if (stats.total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mt-6 bg-gradient-to-br from-[var(--card-bg)] to-[rgba(var(--bg-tertiary-rgb),0.8)] backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)] overflow-hidden relative'
      >
        <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-cyan-500/10 to-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl'></div>
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

        <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-amber-400 mb-6'>
          Статистика игр
        </h2>
        <p className='text-[var(--text-secondary)] italic text-center py-4'>
          Нет данных для отображения статистики.
        </p>
      </motion.div>
    )
  }

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

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='mt-6 bg-gradient-to-br from-[var(--card-bg)] to-[rgba(var(--bg-tertiary-rgb),0.8)] backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[var(--border-color)] overflow-hidden relative'
    >
      <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-cyan-500/10 to-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl'></div>
      <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl'></div>

      <motion.h2
        variants={itemVariants}
        className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-amber-400 mb-6'
      >
        Статистика игр
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
      >
        <div className='md:col-span-1 flex justify-center items-center'>
          <canvas
            ref={canvasRef}
            width='200'
            height='200'
            className='max-w-full'
          ></canvas>
        </div>

        <div className='md:col-span-2'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <motion.div variants={itemVariants}>
              <h4 className='text-sm font-medium text-[var(--text-secondary)] mb-4'>
                По статусам
              </h4>
              <div className='space-y-3'>
                {statusOptions.map(status => {
                  const count = stats.byStatus[status.value] || 0
                  const percentage =
                    stats.total > 0
                      ? Math.round((count / stats.total) * 100)
                      : 0

                  return (
                    <div key={status.value}>
                      <div className='flex justify-between items-center mb-1'>
                        <div className='flex items-center'>
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(
                              status.value
                            )}`}
                          ></div>
                          <span className='text-sm text-[var(--text-primary)]'>
                            {status.label}
                          </span>
                        </div>
                        <span className='text-sm font-medium text-[var(--text-primary)]'>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className='w-full bg-[var(--bg-secondary)] rounded-full h-2'>
                        <div
                          className={`${getProgressColor(
                            status.value
                          )} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className='text-sm font-medium text-[var(--text-secondary)] mb-4'>
                Общая статистика
              </h4>
              <div className='bg-gradient-to-br from-[rgba(var(--accent-primary-rgb),0.05)] to-[rgba(var(--accent-secondary-rgb),0.05)] rounded-lg p-4 space-y-4 border border-[var(--divider-color)]'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-[var(--text-primary)]'>
                    Всего игр
                  </span>
                  <span className='text-lg font-semibold text-[var(--accent-primary)]'>
                    {stats.total}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-[var(--text-primary)]'>
                    Средняя оценка
                  </span>
                  <span className='text-lg font-semibold text-[var(--accent-primary)]'>
                    {Number(stats.avgRating) > 0 ? (
                      <span className='flex items-center'>
                        {stats.avgRating}
                        <svg
                          className='w-5 h-5 text-yellow-400 ml-1'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                      </span>
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-[var(--text-primary)]'>
                    Оценено игр
                  </span>
                  <span className='text-lg font-semibold text-[var(--accent-primary)]'>
                    {stats.ratingCount}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-[var(--text-primary)]'>
                    Процент оцененных
                  </span>
                  <span className='text-lg font-semibold text-[var(--accent-primary)]'>
                    {stats.total > 0
                      ? `${Math.round((stats.ratingCount / stats.total) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
