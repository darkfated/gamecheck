import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { QuizList } from '../components/quiz/QuizList'
import { QuizPlayer } from '../components/quiz/QuizPlayer'
import { QuizResults } from '../components/quiz/QuizResults'
import { getCategories, quizzes } from '../config/quizzes'

type PageView = 'list' | 'playing' | 'results'

interface QuizState {
  quizId: string | null
  score: number | null
  totalQuestions: number | null
}

export default function QuizPage() {
  const [view, setView] = useState<PageView>('list')
  const [quizState, setQuizState] = useState<QuizState>({
    quizId: null,
    score: null,
    totalQuestions: null,
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleStartQuiz = (quizId: string) => {
    setQuizState({ quizId, score: null, totalQuestions: null })
    setView('playing')
  }

  const handleQuizComplete = (score: number, total: number) => {
    setQuizState(prev => ({
      ...prev,
      score,
      totalQuestions: total,
    }))
    setView('results')
  }

  const handleReturnToList = () => {
    setView('list')
    setSelectedCategory(null)
    setQuizState({ quizId: null, score: null, totalQuestions: null })
  }

  const handlePlayAgain = () => {
    setView('playing')
    setQuizState(prev => ({
      ...prev,
      score: null,
      totalQuestions: null,
    }))
  }

  const filteredQuizzes = selectedCategory
    ? quizzes.filter(q => q.category === selectedCategory)
    : quizzes

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] flex flex-col'>
      <div className='flex-1 container mx-auto px-4 py-8'>
        <AnimatePresence mode='wait'>
          {view === 'list' && (
            <motion.div
              key='list'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='mb-8'
              >
                <h1 className='text-4xl font-bold text-[var(--text-primary)] mb-2'>
                  Квизы
                </h1>
                <p className='text-[var(--text-secondary)]'>
                  Проверьте свои знания об играх и киберспорте
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className='mb-8 flex flex-wrap gap-2'
              >
                <motion.button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Все
                </motion.button>
                {getCategories().map(category => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>

              <QuizList
                quizzes={filteredQuizzes}
                onSelectQuiz={handleStartQuiz}
              />
            </motion.div>
          )}

          {view === 'playing' && quizState.quizId && (
            <motion.div
              key='playing'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuizPlayer
                quizId={quizState.quizId}
                onComplete={handleQuizComplete}
                onBack={handleReturnToList}
              />
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div
              key='results'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuizResults
                score={quizState.score || 0}
                total={quizState.totalQuestions || 0}
                onPlayAgain={handlePlayAgain}
                onReturnToList={handleReturnToList}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
