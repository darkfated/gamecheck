import { motion } from 'framer-motion'
import { FC } from 'react'

interface QuizResultsProps {
  score: number
  total: number
  onPlayAgain: () => void
  onReturnToList: () => void
}

export const QuizResults: FC<QuizResultsProps> = ({
  score,
  total,
  onPlayAgain,
  onReturnToList,
}) => {
  const percentage = Math.round((score / total) * 100)

  const getResultMessage = () => {
    if (percentage === 100) return 'Идеально! Вы эксперт!'
    if (percentage >= 80) return 'Отлично! Очень хороший результат!'
    if (percentage >= 60) return 'Хорошо! Неплохо получилось!'
    if (percentage >= 40) return 'Так себе. Надо подучить материал.'
    return 'Нужно больше практики!'
  }

  const getColor = () => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500'
    if (percentage >= 60) return 'from-blue-500 to-indigo-500'
    if (percentage >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-8 text-center'
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className='text-3xl font-bold text-[var(--text-primary)] mb-4'>
            Результаты
          </h2>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
            className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${getColor()} p-1 shadow-lg`}
          >
            <div className='w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center'>
              <div className='text-center'>
                <div className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500'>
                  {percentage}%
                </div>
                <div className='text-sm text-[var(--text-secondary)]'>
                  {score}/{total}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='text-xl font-semibold text-[var(--text-primary)] mb-2'
          >
            {getResultMessage()}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='text-[var(--text-secondary)] mb-8'
          >
            Вы ответили правильно на {score} из {total} вопросов
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className='flex flex-col sm:flex-row gap-4'
        >
          <motion.button
            onClick={onPlayAgain}
            className='flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Пройти ещё раз
          </motion.button>
          <motion.button
            onClick={onReturnToList}
            className='flex-1 py-3 border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg font-medium transition-all'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            К другим квизам
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
