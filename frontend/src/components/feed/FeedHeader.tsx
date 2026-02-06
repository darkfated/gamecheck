import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Button } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'
import { StatPill } from '../ui/StatPill'

interface FeedHeaderProps {
  userId: string
  displayName: string
  activityCount: number
}

export const FeedHeader: FC<FeedHeaderProps> = ({
  userId,
  displayName,
  activityCount,
}) => {
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [gamesCount, setGamesCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    const loadStats = async () => {
      try {
        const [profileRes, gamesRes] = await Promise.all([
          api.users.getProfile(userId),
          api.progress.getUserGames(userId),
        ])
        setFollowersCount(profileRes.data.followersCount || 0)
        setFollowingCount(profileRes.data.followingCount || 0)
        setGamesCount(gamesRes.data.length || 0)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [userId])

  return (
    <>
      <SectionHeader
        title={
          <>
            С возвращением,{' '}
            <span className='bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 bg-clip-text text-transparent'>
              {displayName}
            </span>
          </>
        }
        subtitle='Свежая активность, подписки и новые игры в одном месте.'
        action={
          <Link to='/users'>
            <Button variant='secondary' size='sm'>
              Найти игроков
            </Button>
          </Link>
        }
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatPill
          label='подписки'
          value={followingCount}
          icon={
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
              />
            </svg>
          }
        />
        <StatPill
          label='подписчики'
          value={followersCount}
          icon={
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          }
        />
        <StatPill
          label='игр в коллекции'
          value={gamesCount}
          icon={
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
              />
            </svg>
          }
        />
        <StatPill
          label='активностей'
          value={activityCount}
          icon={
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M3 12h4l2 5 4-10 2 5h6'
              />
            </svg>
          }
        />
      </div>
    </>
  )
}
