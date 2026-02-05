import { motion } from 'framer-motion'
import { FC } from 'react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Quiz } from '../../config/quizzes'

interface QuizListProps {
  quizzes: Quiz[]
  onSelectQuiz: (quizId: string) => void
}

export const QuizList: FC<QuizListProps> = ({ quizzes, onSelectQuiz }) => {
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'Легко',
      medium: 'Средне',
      hard: 'Сложно',
    }
    return labels[difficulty] || difficulty
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {quizzes.map((quiz, index) => (
        <motion.div
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          onClick={() => onSelectQuiz(quiz.id)}
          className='group cursor-pointer'
        >
          <Card
            variant='surface'
            className='border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-all duration-300'
          >
            <div className='flex items-start justify-between mb-3'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors'>
                {quiz.title}
              </h3>
              <Badge variant={getDifficultyVariant(quiz.difficulty)}>
                {getDifficultyLabel(quiz.difficulty)}
              </Badge>
            </div>

            <p className='text-sm text-[var(--text-secondary)] mb-4'>
              {quiz.description}
            </p>

            <div className='flex items-center justify-between'>
              <div className='flex gap-4 text-xs text-[var(--text-tertiary)]'>
                <div className='flex items-center gap-1'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M8.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
                    <path
                      fillRule='evenodd'
                      d='M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  {quiz.questions.length} вопросов
                </div>
                <div className='flex items-center gap-1'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414L9 9.414V6z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  {quiz.timeLimit
                    ? `${Math.ceil(quiz.timeLimit / 60)} мин`
                    : 'Без лимита'}
                </div>
              </div>

              <motion.div
                whileHover={{ x: 5 }}
                className='text-[var(--accent-primary)]'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
