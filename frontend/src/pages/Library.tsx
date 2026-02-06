import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RatingBadge } from '../components/games/RatingBadge'
import { ArcadeGlyph } from '../components/icons/ArcadeGlyph'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Select } from '../components/ui/Select'
import api from '../services/api'

interface LibraryGame {
  id: string
  steamAppId: number
  name: string
  shortDescription?: string
  description?: string
  headerImage?: string
  capsuleImage?: string
  backgroundImage?: string
  storeUrl?: string
  primaryGenre?: string
  genres?: string[]
  categories?: string[]
  tags?: string[]
  averageRating?: number
  ratingsCount?: number
  reviewsCount?: number
  progressCount?: number
  createdAt?: string
}

const defaultGenres = [
  'Action',
  'Adventure',
  'RPG',
  'Indie',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
]

const genreLabelMap: Record<string, string> = {
  Action: 'Экшен',
  Adventure: 'Приключения',
  RPG: 'Ролевые',
  Indie: 'Инди',
  Strategy: 'Стратегии',
  Simulation: 'Симуляторы',
  Sports: 'Спорт',
  Racing: 'Гонки',
  Shooter: 'Шутер',
  Puzzle: 'Головоломки',
  Horror: 'Хоррор',
  Platformer: 'Платформер',
  Arcade: 'Аркады',
  Fighting: 'Файтинги',
  MMO: 'MMO',
  Casual: 'Казуальные',
}

const Library: FC = () => {
  const [games, setGames] = useState<LibraryGame[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(12)
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setPage(0)
  }, [search, genre, sort, order, limit])

  useEffect(() => {
    let active = true
    const loadGames = async () => {
      setIsLoading(true)
      try {
        const currentOffset = page * limit
        const response = await api.library.list(
          limit,
          currentOffset,
          sort,
          order,
          search,
          genre
        )
        if (!active) return
        const payload = response.data
        setTotal(payload.total || 0)
        setGames(payload.data || [])
      } catch (error) {
        if (!active) return
        setGames([])
        setTotal(0)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadGames()
    return () => {
      active = false
    }
  }, [limit, page, sort, order, search, genre])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1))
    }
  }, [page, totalPages])

  const genreOptions = useMemo(() => {
    const set = new Set<string>(defaultGenres)
    games.forEach(game => {
      game.genres?.forEach(item => set.add(item))
    })
    return Array.from(set)
      .filter(Boolean)
      .map(value => ({
        value,
        label: genreLabelMap[value] ?? value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'ru'))
  }, [games])

  return (
    <motion.div
      className='container mx-auto px-4 py-8'
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SectionHeader
        title='Библиотека'
        subtitle='Глобальный список игр GameCheck: Steam-данные, фидбэк сообщество в одном месте.'
        action={
          <Link to='/'>
            <Button variant='secondary' size='sm'>
              В ленту
            </Button>
          </Link>
        }
      />

      <div className='mt-6'>
        <Card
          variant='glass'
          className='flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 justify-between'
        >
          <div className='flex flex-wrap gap-3 flex-1'>
            <div className='min-w-[220px] flex-1'>
              <Input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder='Поиск по названию...'
                aria-label='Поиск по библиотеке'
                className='h-12'
              />
            </div>
            <Select
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className='min-w-[170px] h-12'
            >
              <option value=''>Все жанры</option>
              {genreOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className='min-w-[170px] h-12'
            >
              <option value='createdAt'>Сначала новые</option>
              <option value='rating'>По рейтингу</option>
              <option value='reviews'>По комментариям</option>
              <option value='progress'>По игрокам</option>
              <option value='name'>По названию</option>
            </Select>
            <Select
              value={order}
              onChange={e => setOrder(e.target.value)}
              className='min-w-[150px] h-12'
            >
              <option value='desc'>По убыванию</option>
              <option value='asc'>По возрастанию</option>
            </Select>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <span className='text-xs text-[var(--text-secondary)] sm:whitespace-nowrap'>
                На странице
              </span>
              <Select
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value))
                  setPage(0)
                }}
                wrapperClassName='flex-1 sm:w-[140px]'
                className='h-12'
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </Select>
            </div>
          </div>
        </Card>
      </div>
      <AnimatePresence mode='wait'>
        <motion.div
          key={`${page}-${limit}-${sort}-${order}-${search}-${genre}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'
        >
        {isLoading && games.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className='h-[160px] animate-pulse'>
              <div />
            </Card>
          ))
        ) : games.length === 0 ? (
          <Card className='col-span-full flex flex-col items-center justify-center py-12 text-center'>
            <ArcadeGlyph className='w-12 h-12 text-[var(--accent-primary)]' />
            <h3 className='mt-4 text-lg font-semibold text-[var(--text-primary)]'>
              Наша библиотека пока пуста
            </h3>
            <p className='mt-2 text-sm text-[var(--text-secondary)] max-w-md'>
              Добавьте игру в прогресс. Если она есть в Steam, мы подтянем
              данные и пополним библиотеку.
            </p>
          </Card>
        ) : (
          games.map(game => {
            const ratingValue =
              game.averageRating && game.averageRating > 0
                ? Math.round(game.averageRating * 10) / 10
                : undefined
            const iconSrc =
              game.capsuleImage || game.headerImage || game.backgroundImage

            return (
              <Link
                to={`/library/${game.id}`}
                key={game.id}
                className='block h-full'
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  whileHover={{ scale: 1.01 }}
                  className='h-full'
                >
                  <Card className='group relative h-[160px] p-0 overflow-hidden flex items-center cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-[var(--border-color-hover)]'>
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[rgba(var(--accent-primary-rgb),0.08)] via-transparent to-[rgba(var(--accent-secondary-rgb),0.08)]' />

                  <div className='relative flex items-center gap-4 p-4 w-full'>
                    <div className='h-16 w-16 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.8)] flex items-center justify-center'>
                      {iconSrc ? (
                        <img
                          src={iconSrc}
                          alt=''
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <ArcadeGlyph className='w-8 h-8 text-[var(--accent-primary)]' />
                      )}
                    </div>

                    <div className='min-w-0 flex-1'>
                      <h3 className='text-base font-semibold text-[var(--text-primary)] line-clamp-2'>
                        {game.name}
                      </h3>
                      <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]'>
                        <RatingBadge rating={ratingValue} className='text-xs' />
                        <span>{game.reviewsCount || 0} отзывов</span>
                      </div>
                    </div>
                  </div>
                  </Card>
                </motion.div>
              </Link>
            )
          })
        )}
        </motion.div>
      </AnimatePresence>

      <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='text-sm text-[var(--text-secondary)]'>
          Страница <span className='font-medium'>{page + 1}</span> из{' '}
          <span className='font-medium'>{totalPages}</span>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => setPage(0)}
            disabled={page === 0}
            className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            aria-label='Первая страница'
          >
            Первая
          </button>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            aria-label='Предыдущая страница'
          >
            Назад
          </button>

          <div className='hidden sm:flex items-center gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum = 0
              if (totalPages <= 5) pageNum = i
              else {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5))
                pageNum = start + i
              }
              if (pageNum >= totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-md ${pageNum === page ? 'bg-[var(--accent-primary)] text-[var(--button-text-on-accent)]' : 'bg-[var(--bg-secondary)] border border-[var(--border-color)]'}`}
                >
                  {pageNum + 1}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            aria-label='Следующая страница'
          >
            Вперед
          </button>
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
            className='px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-50'
            aria-label='Последняя страница'
          >
            Последняя
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Library
