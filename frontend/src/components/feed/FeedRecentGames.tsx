import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { RatingBadge } from '../games/RatingBadge'
import { ArcadeGlyph } from '../icons/ArcadeGlyph'
import { Card } from '../ui/Card'

interface LibraryGame {
  id: string
  name: string
  headerImage?: string
  capsuleImage?: string
  primaryGenre?: string
  genres?: string[]
  averageRating?: number
  ratingsCount?: number
  reviewsCount?: number
  storeUrl?: string
}

interface FeedRecentGamesProps {
  userId: string
}

export const FeedRecentGames: FC<FeedRecentGamesProps> = ({ userId }) => {
  const [recentGames, setRecentGames] = useState<LibraryGame[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    const loadLibraryHighlights = async () => {
      setIsLoading(true)
      try {
        const recentRes = await api.library.list(
          20,
          0,
          'createdAt',
          'desc',
          '',
          ''
        )
        setRecentGames((recentRes.data.data || []).slice(0, 20))
      } catch (error) {
        console.error('Error loading library highlights:', error)
        setRecentGames([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLibraryHighlights()
  }, [userId])

  return (
    <Card variant='glass' className='p-5'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
            Недавно добавленные игры
          </h3>
          <p className='text-sm text-[var(--text-secondary)]'>
            Пополнения библиотеки за последние дни.
          </p>
        </div>
        <Link
          to='/library'
          className='text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]'
        >
          Вся библиотека →
        </Link>
      </div>

      <div className='flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory'>
        {isLoading && recentGames.length === 0 ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`recent-skel-${index}`}
              className='min-w-[280px] h-[200px] rounded-2xl bg-[rgba(var(--bg-tertiary-rgb),0.6)] animate-pulse'
            />
          ))
        ) : recentGames.length === 0 ? (
          <div className='min-w-[280px] rounded-2xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] p-4 flex items-center gap-3'>
            <ArcadeGlyph className='w-8 h-8 text-[var(--accent-primary)]' />
            <div>
              <p className='text-sm font-medium text-[var(--text-primary)]'>
                Пока нет новинок
              </p>
              <p className='text-xs text-[var(--text-secondary)]'>
                Добавьте игру в прогресс и библиотека обновится.
              </p>
            </div>
          </div>
        ) : (
          recentGames.map(game => {
            const ratingValue =
              game.averageRating && game.averageRating > 0
                ? Math.round(game.averageRating * 10) / 10
                : undefined
            return (
              <div
                key={game.id}
                className='min-w-[280px] max-w-[280px] snap-start'
              >
                <Link to={`/library/${game.id}`}>
                  <Card className='p-0 overflow-hidden group h-full'>
                    <div className='relative h-28'>
                      {game.headerImage || game.capsuleImage ? (
                        <img
                          src={game.headerImage || game.capsuleImage}
                          alt={game.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='h-full w-full flex items-center justify-center bg-[rgba(var(--bg-tertiary-rgb),0.6)]'>
                          <ArcadeGlyph className='w-8 h-8 text-[var(--accent-primary)]' />
                        </div>
                      )}
                      <div className='absolute inset-0 bg-gradient-to-t from-[rgba(5,7,12,0.85)] via-transparent to-transparent' />
                    </div>
                    <div className='p-2.5 space-y-1'>
                      <h4 className='text-sm font-semibold text-[var(--text-primary)] line-clamp-2'>
                        {game.name}
                      </h4>
                      <p className='text-xs text-[var(--text-tertiary)]'>
                        {game.primaryGenre || game.genres?.[0] || 'Без жанра'}
                      </p>
                      <div className='flex items-center gap-2'>
                        <RatingBadge rating={ratingValue} />
                        <span className='text-[0.65rem] text-[var(--text-tertiary)]'>
                          {game.reviewsCount || 0} комментариев
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
