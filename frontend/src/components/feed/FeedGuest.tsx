import { motion } from 'framer-motion'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../common/ThemeToggle'
import { ArcadeGlyph } from '../icons/ArcadeGlyph'
import { Button } from '../ui/Button'

interface FeedGuestProps {
  onLogin: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren' as const,
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export const FeedGuest: FC<FeedGuestProps> = ({ onLogin }) => {
  return (
    <motion.div
      className='relative overflow-hidden px-4 py-12'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='absolute inset-0'>
        <div className='absolute top-10 left-8 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-8 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl'></div>
      </div>

      <motion.div
        className='relative max-w-5xl mx-auto'
        variants={itemVariants}
      >
        <div className='relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[rgba(var(--bg-secondary-rgb),0.72)] shadow-[var(--shadow-card)]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-primary-rgb),0.12)] via-transparent to-[rgba(var(--accent-secondary-rgb),0.12)]'></div>

          <div className='relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8 lg:p-12'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-3 rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.4)] px-4 py-2 text-sm text-[var(--text-secondary)]'>
                <ArcadeGlyph className='w-5 h-5 text-[var(--accent-primary)]' />
                Стартовая страница
              </div>

              <div>
                <h2 className='text-3xl md:text-4xl font-bold text-[var(--text-primary)]'>
                  Добро пожаловать в GameCheck
                </h2>
                <p className='mt-3 text-[var(--text-secondary)] leading-relaxed'>
                  Подключитесь сейчас и управляйте коллекцией игр, следите за
                  активностями друзей и вступите в геймерское сообщество.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  onClick={onLogin}
                  size='lg'
                  className='w-full sm:w-auto'
                >
                  Войти через Steam
                </Button>
                <Link to='/users' className='w-full sm:w-auto'>
                  <Button variant='secondary' size='lg' className='w-full'>
                    Смотреть игроков
                  </Button>
                </Link>
              </div>

              <div className='flex flex-wrap gap-2 text-xs text-[var(--text-tertiary)]'>
                <span className='rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.5)] px-3 py-1'>
                  Коллекции и рейтинги
                </span>
                <span className='rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.5)] px-3 py-1'>
                  Без навязчивых уведомлений
                </span>
                <span className='rounded-full border border-[var(--divider-color)] bg-[rgba(var(--bg-tertiary-rgb),0.5)] px-3 py-1'>
                  Простота
                </span>
              </div>

              <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-[var(--text-secondary)]'>
                <span>Вы также можете сменить тему интерфейса:</span>
                <ThemeToggle />
              </div>
            </div>

            <div className='grid gap-4'>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  to='/users'
                  className='group block rounded-2xl border border-[var(--card-border)] bg-[rgba(var(--bg-tertiary-rgb),0.55)] p-4 transition-all hover:border-[var(--border-color-hover)] hover:bg-[rgba(var(--bg-tertiary-rgb),0.7)]'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='text-sm text-[var(--text-tertiary)]'>
                        Исследуйте
                      </p>
                      <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                        Топ игроков и коллекций
                      </h3>
                    </div>
                    <span className='rounded-full bg-[rgba(var(--accent-primary-rgb),0.18)] px-3 py-1 text-xs text-[var(--accent-primary)]'>
                      Открыть
                    </span>
                  </div>
                  <p className='mt-3 text-sm text-[var(--text-secondary)]'>
                    Подглядывайте, во что играют друзья, и что сейчас популярно.
                  </p>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  to='/quizzes'
                  className='group block rounded-2xl border border-[var(--card-border)] bg-[rgba(var(--bg-tertiary-rgb),0.55)] p-4 transition-all hover:border-[var(--border-color-hover)] hover:bg-[rgba(var(--bg-tertiary-rgb),0.7)]'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='text-sm text-[var(--text-tertiary)]'>
                        Прокачайте знания
                      </p>
                      <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                        Игровые квизы
                      </h3>
                    </div>
                    <span className='rounded-full bg-[rgba(var(--accent-secondary-rgb),0.2)] px-3 py-1 text-xs text-[var(--accent-secondary)]'>
                      Играть
                    </span>
                  </div>
                  <p className='mt-3 text-sm text-[var(--text-secondary)]'>
                    Разбавьте игровой процесс викторинами.
                  </p>
                </Link>
              </motion.div>

              <motion.button
                type='button'
                onClick={onLogin}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className='text-left rounded-2xl border border-[var(--card-border)] bg-[rgba(var(--bg-tertiary-rgb),0.55)] p-4 transition-all hover:border-[var(--border-color-hover)] hover:bg-[rgba(var(--bg-tertiary-rgb),0.7)]'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-sm text-[var(--text-tertiary)]'>
                      Начните сейчас
                    </p>
                    <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                      Синхронизация со Steam
                    </h3>
                  </div>
                  <span className='rounded-full bg-[rgba(var(--accent-primary-rgb),0.18)] px-3 py-1 text-xs text-[var(--accent-primary)]'>
                    Войти
                  </span>
                </div>
                <p className='mt-3 text-sm text-[var(--text-secondary)]'>
                  Данные из вашего профиля подтянутся и дополнят нашу библиотеку
                  сайта.
                </p>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
