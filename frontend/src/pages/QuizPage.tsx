import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
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

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 28 },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
}

const headerVariants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
}

const chipsContainer = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
}

const chipItem = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
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

  const filteredQuizzes = useMemo(
    () =>
      selectedCategory
        ? quizzes.filter(q => q.category === selectedCategory)
        : quizzes,
    [selectedCategory],
  )

  return (
    <div className='min-h-screen bg-[var(--bg-primary)] flex flex-col'>
      <div className='flex-1 container mx-auto px-4 py-8'>
        <AnimatePresence mode='wait'>
          {view === 'list' && (
            <motion.div
              key='list'
              initial='hidden'
              animate='enter'
              exit='exit'
              variants={pageVariants}
            >
              <motion.div
                variants={headerVariants}
                initial='hidden'
                animate='show'
                className='mb-6'
              >
                <h1 className='text-4xl font-bold text-[var(--text-primary)] mb-2'>
                  Квизы
                </h1>
                <p className='text-[var(--text-secondary)]'>
                  Проверьте, насколько вы разбираетесь в играх и современных
                  событиях
                </p>
              </motion.div>

              <LayoutGroup>
                <motion.div
                  className='mb-6 flex flex-wrap gap-3'
                  variants={chipsContainer}
                  initial='hidden'
                  animate='show'
                >
                  <div className='relative'>
                    {selectedCategory === null && (
                      <motion.div
                        layoutId='quiz-active-tab'
                        className='absolute rounded-xl pointer-events-none'
                        style={{
                          top: 4,
                          bottom: 4,
                          left: 4,
                          right: 4,
                          borderRadius: 14,
                          background:
                            'linear-gradient(90deg, rgba(99,102,241,0.18), rgba(168,85,247,0.18), rgba(217,70,239,0.18))',
                          boxShadow: '0 10px 28px -12px rgba(99,102,241,0.12)',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 28,
                        }}
                      />
                    )}
                    <motion.button
                      variants={chipItem}
                      onClick={() => setSelectedCategory(null)}
                      className={`relative z-10 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === null
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      aria-pressed={selectedCategory === null}
                    >
                      Все
                    </motion.button>
                  </div>

                  {getCategories().map(category => (
                    <div key={category} className='relative'>
                      {selectedCategory === category && (
                        <motion.div
                          layoutId='quiz-active-tab'
                          className='absolute rounded-xl pointer-events-none'
                          style={{
                            top: 4,
                            bottom: 4,
                            left: 4,
                            right: 4,
                            borderRadius: 14,
                            background:
                              'linear-gradient(90deg, rgba(99,102,241,0.18), rgba(168,85,247,0.18), rgba(217,70,239,0.18))',
                            boxShadow:
                              '0 10px 28px -12px rgba(99,102,241,0.12)',
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 28,
                          }}
                        />
                      )}

                      <motion.button
                        variants={chipItem}
                        onClick={() => setSelectedCategory(category)}
                        className={`relative z-10 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        aria-pressed={selectedCategory === category}
                      >
                        {category}
                      </motion.button>
                    </div>
                  ))}
                </motion.div>
              </LayoutGroup>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.04 }}
              >
                <QuizList
                  quizzes={filteredQuizzes}
                  onSelectQuiz={handleStartQuiz}
                />
              </motion.div>
            </motion.div>
          )}

          {view === 'playing' && quizState.quizId && (
            <motion.div
              key='playing'
              initial='hidden'
              animate='enter'
              exit='exit'
              variants={pageVariants}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.995 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              >
                <QuizPlayer
                  quizId={quizState.quizId}
                  onComplete={handleQuizComplete}
                  onBack={handleReturnToList}
                />
              </motion.div>
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div
              key='results'
              initial='hidden'
              animate='enter'
              exit='exit'
              variants={pageVariants}
            >
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <QuizResults
                  score={quizState.score || 0}
                  total={quizState.totalQuestions || 0}
                  onPlayAgain={handlePlayAgain}
                  onReturnToList={handleReturnToList}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
