import { motion } from 'framer-motion'
import { FC, useState } from 'react'
import { getQuizById } from '../../config/quizzes'

interface QuizPlayerProps {
  quizId: string
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

export const QuizPlayer: FC<QuizPlayerProps> = ({
  quizId,
  onComplete,
  onBack,
}) => {
  const quiz = getQuizById(quizId)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [, setShowExplanation] = useState(false)

  if (!quiz) {
    return <div>Квиз не найден</div>
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isAnswered = answers[currentQuestion.id] !== undefined
  const isCorrect =
    answers[currentQuestion.id] === currentQuestion.correctAnswer
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const handleAnswer = (optionId: string) => {
    if (!isAnswered) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }))
      setShowExplanation(true)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      const score = Object.entries(answers).filter(([questionId, answerId]) => {
        const q = quiz.questions.find(q => q.id === questionId)
        return q && answerId === q.correctAnswer
      }).length
      onComplete(score, quiz.questions.length)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowExplanation(false)
    }
  }

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  return (
    <div className='max-w-2xl mx-auto'>
      <motion.button
        onClick={onBack}
        className='mb-6 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
        whileHover={{ x: -4 }}
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
            d='M15 19l-7-7 7-7'
          />
        </svg>
        Назад
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-8'
      >
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>
              {quiz.title}
            </h2>
            <span className='text-sm text-[var(--text-secondary)]'>
              Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </span>
          </div>
          <div className='w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden'>
            <motion.div
              className='h-full bg-gradient-to-r from-cyan-500 to-amber-500'
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className='text-2xl font-semibold text-[var(--text-primary)] mb-6'>
            {currentQuestion.text}
          </h3>

          <div className='space-y-3 mb-6'>
            {currentQuestion.options.map(option => {
              const isSelected = answers[currentQuestion.id] === option.id
              const isCorrectAnswer =
                option.id === currentQuestion.correctAnswer

              let bgClass =
                'bg-[var(--bg-tertiary)] border-[var(--border-color)]'
              let textClass = 'text-[var(--text-primary)]'
              let hoverClass = 'hover:border-[var(--accent-primary)]'

              if (isAnswered) {
                if (isCorrectAnswer) {
                  bgClass = 'bg-green-500/10 border-green-500/50'
                  textClass = 'text-[var(--text-primary)]'
                } else if (isSelected && !isCorrect) {
                  bgClass = 'bg-red-500/10 border-red-500/50'
                  textClass = 'text-[var(--text-primary)]'
                }
              }

              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { x: 4 } : {}}
                  className={`w-full p-4 rounded-lg border transition-all text-left font-medium ${bgClass} ${textClass} ${
                    !isAnswered ? hoverClass : ''
                  } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className='flex items-center justify-between'>
                    <span>{option.text}</span>
                    {isAnswered && isCorrectAnswer && (
                      <svg
                        className='w-5 h-5 text-green-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <svg
                        className='w-5 h-5 text-red-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {isAnswered && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg mb-6 ${
                isCorrect
                  ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                  : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
              }`}
            >
              <p className='font-medium mb-2'>
                {isCorrect ? '✓ Правильно!' : 'Объяснение:'}
              </p>
              <p className='text-sm'>{currentQuestion.explanation}</p>
            </motion.div>
          )}

          {isAnswered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleNext}
              className='w-full py-3 bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-[var(--button-text-on-accent)] rounded-lg font-medium transition-all'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLastQuestion ? 'Завершить' : 'Далее'}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
