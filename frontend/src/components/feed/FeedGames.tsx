import { FC } from 'react'
import { Link } from 'react-router-dom'
import { RatingBadge } from '../games/RatingBadge'
import { ArcadeGlyph } from '../icons/ArcadeGlyph'
import { Card } from '../ui/Card'

export interface FeedGame {
  id: string
  name: string
  headerImage?: string
  capsuleImage?: string
  primaryGenre?: string
  genres?: string[]
  categories?: string[]
  tags?: string[]
  averageRating?: number
  ratingsCount?: number
  reviewsCount?: number
  progressCount?: number
  matchCount?: number
  storeUrl?: string
}

interface FeedGamesProps {
  title: string
  subtitle?: string
  linkTo?: string
  linkLabel?: string
  items: FeedGame[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  getMetaLabel?: (game: FeedGame) => string | undefined
  getHref?: (game: FeedGame) => string
  getImageSrc?: (game: FeedGame) => string | undefined
  getGenreLabel?: (game: FeedGame) => string
  showRating?: boolean
}

export const FeedGames: FC<FeedGamesProps> = ({
  title,
  subtitle,
  linkTo,
  linkLabel = 'Вся библиотека →',
  items,
  isLoading = false,
  emptyTitle = 'Пока нет новинок',
  emptyDescription = 'Добавьте игру в прогресс и библиотека обновится.',
  getMetaLabel,
  getHref,
  getImageSrc,
  getGenreLabel,
  showRating = true,
}) => {
  const resolveHref = getHref || ((game: FeedGame) => `/library/${game.id}`)
  const resolveImageSrc =
    getImageSrc || ((game: FeedGame) => game.headerImage || game.capsuleImage)
  const resolveGenreLabel =
    getGenreLabel ||
    ((game: FeedGame) => game.primaryGenre || game.genres?.[0] || 'Без жанра')
  const showLink = linkTo && linkLabel

  return (
    <Card variant='glass' className='p-5'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
            {title}
          </h3>
          {subtitle ? (
            <p className='text-sm text-[var(--text-secondary)]'>{subtitle}</p>
          ) : null}
        </div>
        {showLink ? (
          <Link
            to={linkTo as string}
            className='text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]'
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>

      <div className='flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory'>
        {isLoading && items.length === 0 ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`games-skel-${index}`}
              className='min-w-[280px] h-[200px] rounded-2xl bg-[rgba(var(--bg-tertiary-rgb),0.6)] animate-pulse'
            />
          ))
        ) : items.length === 0 ? (
          <div className='min-w-[280px] rounded-2xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] p-4 flex items-center gap-3'>
            <ArcadeGlyph className='w-8 h-8 text-[var(--accent-primary)]' />
            <div>
              <p className='text-sm font-medium text-[var(--text-primary)]'>
                {emptyTitle}
              </p>
              <p className='text-xs text-[var(--text-secondary)]'>
                {emptyDescription}
              </p>
            </div>
          </div>
        ) : (
          items.map(game => {
            const ratingValue =
              game.averageRating && game.averageRating > 0
                ? Math.round(game.averageRating * 10) / 10
                : undefined
            const metaLabel = getMetaLabel ? getMetaLabel(game) : undefined
            const showMeta = (showRating && ratingValue) || metaLabel
            return (
              <div
                key={game.id}
                className='min-w-[280px] max-w-[280px] snap-start'
              >
                <Link to={resolveHref(game)}>
                  <Card className='p-0 overflow-hidden group h-full'>
                    <div className='relative h-28'>
                      {resolveImageSrc(game) ? (
                        <img
                          src={resolveImageSrc(game)}
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
                        {resolveGenreLabel(game)}
                      </p>
                      {showMeta ? (
                        <div className='flex items-center gap-2'>
                          {showRating ? (
                            <RatingBadge rating={ratingValue} />
                          ) : null}
                          {metaLabel ? (
                            <span className='text-[0.65rem] text-[var(--text-tertiary)]'>
                              {metaLabel}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
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
