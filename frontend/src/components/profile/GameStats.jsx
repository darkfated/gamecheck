import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GAME_STATUS_CONFIG } from "../../constants"

export function GameStats({ games, statusOptions }) {
  const [selectedStatus, setSelectedStatus] = useState(null)
  const totalGames = games.length

  const gamesByStatus = statusOptions.reduce((acc, status) => {
    acc[status.value] = games.filter(game => game.status === status.value)
    return acc
  }, {})

  const gamesWithRating = games.filter(game => game.rating)
  const averageRating =
    gamesWithRating.length > 0
      ? gamesWithRating.reduce((sum, game) => sum + game.rating, 0) /
        gamesWithRating.length
      : 0

  const maxGamesInCategory = Math.max(
    ...Object.values(gamesByStatus).map(games => games.length),
    1
  )

  const getPercentage = count => (count / maxGamesInCategory) * 100

  const getStatusColor = status => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption?.color || "gray"
  }

  const getStatusGradient = status => {
    return GAME_STATUS_CONFIG[status]?.gradient || "from-gray-500 to-slate-500"
  }

  const calculateChartData = () => {
    let total = 0
    let segments = []
    let currentDegree = 0

    statusOptions.forEach(status => {
      const count = gamesByStatus[status.value].length
      total += count
    })

    statusOptions.forEach(status => {
      const count = gamesByStatus[status.value].length
      const percentage = total > 0 ? (count / total) * 100 : 0
      const degrees = percentage * 3.6

      segments.push({
        status: status.value,
        label: status.label,
        count,
        percentage,
        startDegree: currentDegree,
        endDegree: currentDegree + degrees,
        color: getStatusColor(status.value),
        gradient: getStatusGradient(status.value),
      })

      currentDegree += degrees
    })

    return segments
  }

  const chartData = calculateChartData()

  return (
    <motion.div
      className='bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--border-color)] mb-6 relative overflow-hidden'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)" }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
          Статистика коллекции
        </h2>
        <motion.div
          className='text-sm font-medium bg-[var(--bg-tertiary)]/60 backdrop-blur-sm py-1 px-3 rounded-full text-[var(--accent-tertiary)]'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {totalGames}{" "}
          {totalGames === 1
            ? "игра"
            : totalGames >= 2 && totalGames <= 4
            ? "игры"
            : "игр"}
        </motion.div>
      </div>

      {totalGames === 0 ? (
        <div className='text-center py-10 text-[var(--text-secondary)]'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className='flex flex-col items-center'
          >
            <svg
              className='w-16 h-16 text-[var(--text-tertiary)] mb-4 opacity-50'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 17V9m0 0h3m-3 0H6m6-3v12m0 0h3m-3 0h-3'
              />
            </svg>
            <p className='mb-2'>В коллекции пока нет игр</p>
            <p className='text-xs text-[var(--text-tertiary)]'>
              Добавьте игры для просмотра статистики
            </p>
          </motion.div>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-sm font-medium text-[var(--text-secondary)] mb-4'>
              Распределение по статусам
            </h3>

            <div className='relative'>
              <div className='w-52 h-52 mx-auto relative'>
                <svg className='w-full h-full' viewBox='0 0 100 100'>
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    fill='none'
                    stroke='rgba(var(--bg-tertiary-rgb), 0.3)'
                    strokeWidth='12'
                  />

                  {chartData.map((segment, index) => {
                    const startAngle = (segment.startDegree * Math.PI) / 180
                    const endAngle = (segment.endDegree * Math.PI) / 180
                    const x1 = 50 + 40 * Math.cos(startAngle)
                    const y1 = 50 + 40 * Math.sin(startAngle)
                    const x2 = 50 + 40 * Math.cos(endAngle)
                    const y2 = 50 + 40 * Math.sin(endAngle)
                    const largeArcFlag =
                      segment.endDegree - segment.startDegree > 180 ? 1 : 0

                    return segment.percentage > 0 ? (
                      <motion.path
                        key={segment.status}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={`var(--${segment.color}-500, #6366f1)`}
                        opacity={
                          selectedStatus === segment.status ||
                          selectedStatus === null
                            ? 1
                            : 0.3
                        }
                        strokeWidth='0'
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity:
                            selectedStatus === segment.status ||
                            selectedStatus === null
                              ? 1
                              : 0.3,
                        }}
                        transition={{ duration: 0.3 }}
                        onMouseEnter={() => setSelectedStatus(segment.status)}
                        onMouseLeave={() => setSelectedStatus(null)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : null
                  })}

                  <circle cx='50' cy='50' r='30' fill='var(--card-bg)' />
                </svg>

                <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                  <AnimatePresence mode='wait'>
                    {selectedStatus ? (
                      <motion.div
                        key={selectedStatus}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className='flex flex-col items-center'
                      >
                        <p className='text-xs text-[var(--text-secondary)]'>
                          {
                            statusOptions.find(s => s.value === selectedStatus)
                              ?.label
                          }
                        </p>
                        <p className='text-2xl font-bold text-[var(--text-primary)]'>
                          {gamesByStatus[selectedStatus].length}
                        </p>
                        <p className='text-xs text-[var(--text-tertiary)]'>
                          {Math.round(
                            (gamesByStatus[selectedStatus].length /
                              totalGames) *
                              100
                          )}
                          %
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key='total'
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className='flex flex-col items-center'
                      >
                        <p className='text-xs text-[var(--text-secondary)]'>
                          Всего
                        </p>
                        <p className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
                          {totalGames}
                        </p>
                        <p className='text-xs text-[var(--text-tertiary)]'>
                          игр
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-3'>
                {statusOptions.map(status => (
                  <motion.div
                    key={status.value}
                    className='flex items-center gap-2 text-sm cursor-pointer'
                    whileHover={{ x: 3 }}
                    onMouseEnter={() => setSelectedStatus(status.value)}
                    onMouseLeave={() => setSelectedStatus(null)}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-${status.color}-500`}
                    ></div>
                    <div className='flex-grow flex justify-between'>
                      <span className='text-xs text-[var(--text-secondary)]'>
                        {status.label}
                      </span>
                      <span className='text-xs font-medium'>
                        {gamesByStatus[status.value].length}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className='mb-6'>
              <div className='flex justify-between items-end mb-3'>
                <h3 className='text-sm font-medium text-[var(--text-secondary)]'>
                  Средний рейтинг
                </h3>
                <motion.div
                  className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {averageRating.toFixed(1)}
                  <span className='text-xs text-[var(--text-tertiary)] ml-1'>
                    / 10
                  </span>
                </motion.div>
              </div>

              <div className='h-3 bg-[var(--bg-tertiary)]/50 rounded-full overflow-hidden'>
                <motion.div
                  className='h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full'
                  initial={{ width: 0 }}
                  animate={{ width: `${(averageRating / 10) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>

              <p className='text-xs text-[var(--text-tertiary)] mt-1 text-right'>
                {gamesWithRating.length} из {totalGames} игр с рейтингом
              </p>
            </div>

            <div className='mt-8'>
              <motion.div
                className='bg-[var(--bg-tertiary)]/30 rounded-xl p-4 flex items-center justify-between border border-[var(--divider-color)]'
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
              >
                <p className='text-sm text-[var(--text-secondary)]'>
                  Наивысшая оценка
                </p>
                <p className='text-2xl font-bold text-[var(--text-primary)]'>
                  {Math.max(...games.map(g => g.rating || 0), 0)}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
