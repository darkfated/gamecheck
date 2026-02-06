import { AnimatePresence, motion } from 'framer-motion'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FeedGame, FeedGames } from '../components/feed/FeedGames'
import { RatingBadge } from '../components/games/RatingBadge'
import { ArcadeGlyph } from '../components/icons/ArcadeGlyph'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Tabs } from '../components/ui/Tabs'
import api from '../services/api'

interface LibraryGameDetail {
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
  comments: LibraryComment[]
}

interface LibraryComment {
  id: string
  review: string
  rating?: number | null
  createdAt: string
  user: {
    id: string
    displayName: string
    avatarUrl: string
  }
}

const COMMENTS_LIMIT = 10
const SIMILAR_LIMIT = 20
const SIMILAR_SOURCE_LIMIT = 80

const LibraryGame: FC = () => {
  const params = useParams<{ id?: string; appId?: string }>()
  const [game, setGame] = useState<LibraryGameDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)
  const [commentsOffset, setCommentsOffset] = useState(0)
  const [hasMoreComments, setHasMoreComments] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'info' | 'comments'>('info')
  const [similarGames, setSimilarGames] = useState<FeedGame[]>([])
  const [isSimilarLoading, setIsSimilarLoading] = useState(false)

  const activeId = params.id
  const activeAppId = params.appId

  const loadGame = useCallback(
    async (offset: number, append: boolean) => {
      if (!activeAppId && !activeId) {
        setErrorMessage('Некорректный идентификатор игры.')
        setHasMoreComments(false)
        return
      }
      try {
        const response = activeAppId
          ? await api.library.getGameByAppId(
              activeAppId,
              COMMENTS_LIMIT,
              offset
            )
          : await api.library.getGame(activeId || '', COMMENTS_LIMIT, offset)

        const payload = response.data
        setGame(prev => {
          if (!append || !prev) {
            return payload
          }

          const existing = new Set(prev.comments.map(comment => comment.id))
          const mergedComments = [
            ...prev.comments,
            ...payload.comments.filter(comment => !existing.has(comment.id)),
          ]

          return { ...payload, comments: mergedComments }
        })

        const totalComments = payload.reviewsCount || 0
        setHasMoreComments(offset + payload.comments.length < totalComments)
        setErrorMessage('')
      } catch (error) {
        setErrorMessage('Не удалось загрузить игру.')
        setHasMoreComments(false)
      }
    },
    [activeAppId, activeId]
  )

  useEffect(() => {
    setIsLoading(true)
    setCommentsOffset(0)
    setHasMoreComments(true)

    loadGame(0, false).finally(() => setIsLoading(false))
  }, [loadGame])

  const handleLoadMoreComments = async () => {
    if (!hasMoreComments || isCommentsLoading) return
    const nextOffset = commentsOffset + COMMENTS_LIMIT
    setIsCommentsLoading(true)
    await loadGame(nextOffset, true)
    setCommentsOffset(nextOffset)
    setIsCommentsLoading(false)
  }

  const ratingValue = useMemo(() => {
    if (!game?.averageRating || game.averageRating <= 0) return undefined
    return Math.round(game.averageRating * 10) / 10
  }, [game])
  const tags = useMemo(() => {
    if (!game) return []
    return Array.from(
      new Set([
        ...(game.genres || []),
        ...(game.categories || []),
        ...(game.tags || []),
      ])
    )
  }, [game])
  const tabs = useMemo(
    () => [
      {
        id: 'info',
        label: 'Информация',
        icon: (
          <svg
            className='w-5 h-5'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z'
            />
          </svg>
        ),
      },
      {
        id: 'comments',
        label: `Комментарии · ${game?.reviewsCount || 0}`,
        icon: (
          <svg className='w-5 h-5' viewBox='0 -0.5 25 25' fill='currentColor'>
            <path d='M9.0001 8.517C8.58589 8.517 8.2501 8.85279 8.2501 9.267C8.2501 9.68121 8.58589 10.017 9.0001 10.017V8.517ZM16.0001 10.017C16.4143 10.017 16.7501 9.68121 16.7501 9.267C16.7501 8.85279 16.4143 8.517 16.0001 8.517V10.017ZM9.8751 11.076C9.46089 11.076 9.1251 11.4118 9.1251 11.826C9.1251 12.2402 9.46089 12.576 9.8751 12.576V11.076ZM15.1251 12.576C15.5393 12.576 15.8751 12.2402 15.8751 11.826C15.8751 11.4118 15.5393 11.076 15.1251 11.076V12.576ZM9.1631 5V4.24998L9.15763 4.25002L9.1631 5ZM15.8381 5L15.8438 4.25H15.8381V5ZM19.5001 8.717L18.7501 8.71149V8.717H19.5001ZM19.5001 13.23H18.7501L18.7501 13.2355L19.5001 13.23ZM18.4384 15.8472L17.9042 15.3207L17.9042 15.3207L18.4384 15.8472ZM15.8371 16.947V17.697L15.8426 17.697L15.8371 16.947ZM9.1631 16.947V16.197C9.03469 16.197 8.90843 16.23 8.79641 16.2928L9.1631 16.947ZM5.5001 19H4.7501C4.7501 19.2662 4.89125 19.5125 5.12097 19.6471C5.35068 19.7817 5.63454 19.7844 5.86679 19.6542L5.5001 19ZM5.5001 8.717H6.25012L6.25008 8.71149L5.5001 8.717ZM6.56175 6.09984L6.02756 5.5734H6.02756L6.56175 6.09984ZM9.0001 10.017H16.0001V8.517H9.0001V10.017ZM9.8751 12.576H15.1251V11.076H9.8751V12.576ZM9.1631 5.75H15.8381V4.25H9.1631V5.75ZM15.8324 5.74998C17.4559 5.76225 18.762 7.08806 18.7501 8.71149L20.2501 8.72251C20.2681 6.2708 18.2955 4.26856 15.8438 4.25002L15.8324 5.74998ZM18.7501 8.717V13.23H20.2501V8.717H18.7501ZM18.7501 13.2355C18.7558 14.0153 18.4516 14.7653 17.9042 15.3207L18.9726 16.3736C19.7992 15.5348 20.2587 14.4021 20.2501 13.2245L18.7501 13.2355ZM17.9042 15.3207C17.3569 15.8761 16.6114 16.1913 15.8316 16.197L15.8426 17.697C17.0201 17.6884 18.1461 17.2124 18.9726 16.3736L17.9042 15.3207ZM15.8371 16.197H9.1631V17.697H15.8371V16.197ZM8.79641 16.2928L5.13341 18.3458L5.86679 19.6542L9.52979 17.6012L8.79641 16.2928ZM6.2501 19V8.717H4.7501V19H6.2501ZM6.25008 8.71149C6.24435 7.93175 6.54862 7.18167 7.09595 6.62627L6.02756 5.5734C5.20098 6.41216 4.74147 7.54494 4.75012 8.72251L6.25008 8.71149ZM7.09595 6.62627C7.64328 6.07088 8.38882 5.75566 9.16857 5.74998L9.15763 4.25002C7.98006 4.2586 6.85413 4.73464 6.02756 5.5734L7.09595 6.62627Z' />
          </svg>
        ),
      },
    ],
    [game?.reviewsCount]
  )

  const normalizedTags = useMemo(
    () => tags.map(tag => tag.trim().toLowerCase()).filter(Boolean),
    [tags]
  )
  const tagKey = useMemo(() => normalizedTags.join('|'), [normalizedTags])

  useEffect(() => {
    if (!game) return
    const baseTags = new Set(normalizedTags)
    if (game.primaryGenre) {
      baseTags.add(game.primaryGenre.trim().toLowerCase())
    }
    if (baseTags.size === 0) {
      setSimilarGames([])
      setIsSimilarLoading(false)
      return
    }

    let active = true

    const loadSimilarGames = async () => {
      setIsSimilarLoading(true)
      try {
        const [progressRes, ratingRes] = await Promise.all([
          api.library.list(SIMILAR_SOURCE_LIMIT, 0, 'progress', 'desc', '', ''),
          api.library.list(SIMILAR_SOURCE_LIMIT, 0, 'rating', 'desc', '', ''),
        ])

        const progressList = progressRes.data.data || []
        const ratingList = ratingRes.data.data || []

        const combinedMap = new Map<string, FeedGame>()
        progressList.forEach(item => combinedMap.set(item.id, item))
        ratingList.forEach(item => combinedMap.set(item.id, item))

        const candidates = Array.from(combinedMap.values()).filter(
          item => item.id !== game.id
        )

        const scored = candidates
          .map(item => {
            const tagSet = new Set(
              [
                ...(item.genres || []),
                ...(item.categories || []),
                ...(item.tags || []),
                item.primaryGenre,
              ]
                .filter((tag): tag is string => Boolean(tag))
                .map(tag => tag.trim().toLowerCase())
            )
            let matchCount = 0
            tagSet.forEach(tag => {
              if (baseTags.has(tag)) matchCount += 1
            })
            return { ...item, matchCount }
          })
          .filter(item => (item.matchCount || 0) > 0)
          .sort((a, b) => {
            if ((b.matchCount || 0) !== (a.matchCount || 0)) {
              return (b.matchCount || 0) - (a.matchCount || 0)
            }
            if ((b.averageRating || 0) !== (a.averageRating || 0)) {
              return (b.averageRating || 0) - (a.averageRating || 0)
            }
            return (b.progressCount || 0) - (a.progressCount || 0)
          })

        if (!active) return
        setSimilarGames(scored.slice(0, SIMILAR_LIMIT))
      } catch (error) {
        if (!active) return
        console.error('Error loading similar games:', error)
        setSimilarGames([])
      } finally {
        if (active) setIsSimilarLoading(false)
      }
    }

    loadSimilarGames()

    return () => {
      active = false
    }
  }, [game?.id, game?.primaryGenre, tagKey])

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <Card className='animate-pulse h-[320px]'>
          <div />
        </Card>
      </div>
    )
  }

  if (!game) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <Card className='text-center py-12'>
          <ArcadeGlyph className='w-12 h-12 text-[var(--accent-primary)] mx-auto' />
          <h2 className='mt-4 text-lg font-semibold text-[var(--text-primary)]'>
            Игра не найдена
          </h2>
          <p className='mt-2 text-sm text-[var(--text-secondary)]'>
            {errorMessage || 'Попробуйте открыть другую игру из библиотеки.'}
          </p>
          <div className='mt-4 flex justify-center'>
            <Link to='/library'>
              <Button variant='secondary'>К библиотеке</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const heroIcon = game.capsuleImage || game.headerImage || game.backgroundImage

  return (
    <motion.div
      className='container mx-auto px-4 py-6 sm:py-8'
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <SectionHeader
        title={game.name}
        subtitle='Страница игры в библиотеке сообщества GameCheck.'
        action={
          <Link to='/library'>
            <Button variant='secondary' size='sm'>
              Назад в библиотеку
            </Button>
          </Link>
        }
      />

      <Card className='p-0 overflow-hidden mt-6 shadow-none'>
        <div className='relative h-48 sm:h-56 md:h-64'>
          {game.headerImage || game.backgroundImage || game.capsuleImage ? (
            <img
              src={
                game.headerImage || game.backgroundImage || game.capsuleImage
              }
              alt={game.name}
              className='h-full w-full object-cover blur-[16px] scale-110'
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center bg-[rgba(var(--bg-tertiary-rgb),0.6)]'>
              <ArcadeGlyph className='w-14 h-14 text-[var(--accent-primary)]' />
            </div>
          )}
          <div className='absolute top-4 right-4 flex items-center gap-3'>
            {game.storeUrl && (
              <a href={game.storeUrl} target='_blank' rel='noreferrer'>
                <Button
                  variant='secondary'
                  size='sm'
                  className='bg-black/50 text-white border border-white/20 hover:bg-black/70'
                >
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.62 20.51 6.504 24 11.979 24c6.624 0 11.999-5.375 11.999-12S18.603.001 11.979.001z' />
                  </svg>
                  Открыть в Steam
                </Button>
              </a>
            )}
          </div>
          <div className='absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6'>
            <div className='flex items-center gap-3'>
              <div className='h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden border border-white/15 bg-[rgba(var(--bg-secondary-rgb),0.6)] flex items-center justify-center'>
                {heroIcon ? (
                  <img
                    src={heroIcon}
                    alt=''
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <ArcadeGlyph className='w-7 h-7 text-white' />
                )}
              </div>
              <div>
                <p className='text-sm text-[var(--accent-secondary)]'>
                  {game.primaryGenre || game.genres?.[0] || 'Без жанра'}
                </p>
                <h2 className='text-2xl md:text-3xl font-semibold text-white'>
                  {game.name}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className='p-4 sm:p-6 space-y-6'>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={tabId => setActiveTab(tabId as 'info' | 'comments')}
            layoutId='library-game-tabs'
            size='md'
          />

          {activeTab === 'info' ? (
            <div className='grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6'>
              <div className='space-y-5'>
                <div className='flex flex-wrap items-center gap-3'>
                  <RatingBadge rating={ratingValue} />
                  <span className='text-sm text-[var(--text-tertiary)]'>
                    {game.ratingsCount || 0} оценок
                  </span>
                  <span className='text-sm text-[var(--text-tertiary)]'>
                    {game.reviewsCount || 0} комментариев
                  </span>
                  <span className='text-sm text-[var(--text-tertiary)]'>
                    {game.progressCount || 0} игроков в прогрессе
                  </span>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                    Описание
                  </h3>
                  <p className='mt-2 text-sm text-[var(--text-secondary)] leading-relaxed'>
                    {game.shortDescription ||
                      game.description ||
                      'Описание пока недоступно.'}
                  </p>
                </div>

                {tags.length > 0 && (
                  <div>
                    <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                      Жанры и теги
                    </h3>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {tags.filter(Boolean).map(tag => (
                        <Badge
                          key={`${game.id}-${tag as string}`}
                          className='px-2 py-1 text-[0.65rem]'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <Card variant='glass' className='space-y-3'>
                  <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                    Комьюнити-статистика
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                    <div className='min-w-0 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] p-3'>
                      <p className='text-[0.7rem] sm:text-xs text-[var(--text-tertiary)] leading-tight'>
                        Средний рейтинг
                      </p>
                      <p className='text-base sm:text-lg font-semibold text-[var(--accent-tertiary)]'>
                        {ratingValue || '-'}
                      </p>
                    </div>
                    <div className='min-w-0 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] p-3'>
                      <p className='text-[0.7rem] sm:text-xs text-[var(--text-tertiary)] leading-tight'>
                        Комментариев
                      </p>
                      <p className='text-base sm:text-lg font-semibold text-[var(--accent-tertiary)]'>
                        {game.reviewsCount || 0}
                      </p>
                    </div>
                    <div className='min-w-0 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] p-3'>
                      <p className='text-[0.7rem] sm:text-xs text-[var(--text-tertiary)] leading-tight'>
                        Игроков
                      </p>
                      <p className='text-base sm:text-lg font-semibold text-[var(--accent-tertiary)]'>
                        {game.progressCount || 0}
                      </p>
                    </div>
                    <div className='min-w-0 rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] p-3'>
                      <p className='text-[0.7rem] sm:text-xs text-[var(--text-tertiary)] leading-tight'>
                        Steam AppID
                      </p>
                      <p className='text-xs sm:text-sm font-medium text-[var(--accent-tertiary)]'>
                        {game.steamAppId}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card variant='glass' className='p-4 sm:p-6'>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                Комментарии игроков
              </h3>

              <div className='mt-4 space-y-4'>
                <AnimatePresence>
                  {game.comments?.length ? (
                    game.comments.map(comment => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className='rounded-xl border border-[var(--border-color)] bg-[rgba(var(--bg-secondary-rgb),0.6)] p-3 sm:p-4'
                      >
                        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                          <div className='flex items-center gap-3 flex-1 min-w-0'>
                            <Link to={`/profile/${comment.user.id}`}>
                              <img
                                src={comment.user.avatarUrl}
                                alt={comment.user.displayName}
                                className='w-9 h-9 rounded-full object-cover'
                              />
                            </Link>
                            <div className='min-w-0'>
                              <Link
                                to={`/profile/${comment.user.id}`}
                                className='text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-secondary)]'
                              >
                                {comment.user.displayName}
                              </Link>
                              <p className='text-xs text-[var(--text-tertiary)]'>
                                {new Date(comment.createdAt).toLocaleDateString(
                                  'ru-RU'
                                )}
                              </p>
                            </div>
                          </div>
                          {comment.rating ? (
                            <div className='sm:ml-auto'>
                              <RatingBadge rating={comment.rating} />
                            </div>
                          ) : null}
                        </div>
                        <p className='mt-3 text-sm text-[var(--text-secondary)] leading-relaxed break-words'>
                          {comment.review}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className='text-sm text-[var(--text-secondary)]'>
                      Пока нет комментариев. Оставьте отзыв в прогрессе, и он
                      здесь появится.
                    </p>
                  )}
                </AnimatePresence>
              </div>

              {hasMoreComments && (
                <div className='mt-4'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={handleLoadMoreComments}
                    disabled={isCommentsLoading}
                  >
                    {isCommentsLoading ? 'Загрузка...' : 'Показать ещё'}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </Card>

      <div className='mt-8'>
        <FeedGames
          title='Похожие игры'
          subtitle='Подборка по совпадению тегов.'
          items={similarGames}
          isLoading={isSimilarLoading}
          emptyTitle='Пока нет похожих игр'
          emptyDescription='Мы покажем рекомендации, когда появятся подходящие теги.'
          getMetaLabel={item => `${item.matchCount || 0} общих тегов`}
          showRating
        />
      </div>
    </motion.div>
  )
}

export default LibraryGame
