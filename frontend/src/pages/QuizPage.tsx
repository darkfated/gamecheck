import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'framer-motion'
import { useMemo, useState } from 'react'
import { QuizList } from '../components/quiz/QuizList'
import { QuizPlayer } from '../components/quiz/QuizPlayer'
import { QuizResults } from '../components/quiz/QuizResults'
import { Tabs } from '../components/ui/Tabs'
import { getCategories, quizzes } from '../config/quizzes'

type PageView = 'list' | 'playing' | 'results'

interface QuizState {
  quizId: string | null
  score: number | null
  totalQuestions: number | null
}

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 28,
    } as unknown as Transition,
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.18 } as unknown as Transition,
  },
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28 } as unknown as Transition,
  },
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'История':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <circle cx='12' cy='12' r='8' strokeWidth={2} />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4l3 2'
          />
        </svg>
      )
    case 'Хиты':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L12 17l-5.6 3 1.1-6.1L3 9.5l6.2-.9L12 3z'
          />
        </svg>
      )
    case 'Инди игры':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z'
          />
        </svg>
      )
    case 'Киберспорт':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 4h10v3a5 5 0 01-10 0V4z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 7H3a3 3 0 003 3M19 7h2a3 3 0 01-3 3'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 17h6m-4 0v3m2-3v3'
          />
        </svg>
      )
    case 'Разработка':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 9l-3 3 3 3M16 9l3 3-3 3M10 19l4-14'
          />
        </svg>
      )
    case 'Технологии':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <rect x='7' y='7' width='10' height='10' rx='2' strokeWidth={2} />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2'
          />
        </svg>
      )
    case 'Жанры':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3l9 5-9 5-9-5 9-5zM21 13l-9 5-9-5'
          />
        </svg>
      )
    case 'Мемы':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <circle cx='12' cy='12' r='9' strokeWidth={2} />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 10h.01M16 10h.01M8 15c1.5 1.5 6.5 1.5 8 0'
          />
        </svg>
      )
    case 'Механики':
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
          <circle cx='8' cy='6' r='2' strokeWidth={2} />
          <circle cx='16' cy='12' r='2' strokeWidth={2} />
          <circle cx='10' cy='18' r='2' strokeWidth={2} />
        </svg>
      )
    default:
      return (
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      )
  }
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
    [selectedCategory]
  )

  const categoryTabs = useMemo(
    () => [
      {
        id: 'all',
        label: 'Все',
        icon: (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        ),
      },
      ...getCategories().map(category => ({
        id: category,
        label: category,
        icon: getCategoryIcon(category),
      })),
    ],
    []
  )

  const activeCategory = selectedCategory ?? 'all'

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

              <motion.div
                className='mb-6'
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 } as unknown as Transition}
              >
                <Tabs
                  tabs={categoryTabs}
                  activeTab={activeCategory}
                  onChange={tabId =>
                    setSelectedCategory(tabId === 'all' ? null : tabId)
                  }
                  layoutId='quiz-tabs'
                  size='md'
                  className='flex-wrap'
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  { duration: 0.28, delay: 0.04 } as unknown as Transition
                }
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
                transition={
                  {
                    type: 'spring',
                    stiffness: 280,
                    damping: 28,
                  } as unknown as Transition
                }
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
                transition={{ duration: 0.25 } as unknown as Transition}
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
