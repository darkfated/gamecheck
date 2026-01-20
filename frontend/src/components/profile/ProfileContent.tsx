import { FC } from 'react'
import { ActivityFeed } from '../feed/ActivityFeed'
import GameProgressSection from '../games/GameProgressSection'
import { GameStats } from './GameStats'
import { ProfileInfo } from './ProfileInfo'
import { ProfileSettings } from './ProfileSettings'

interface Game {
  id: string
  name: string
  status: string
  rating?: number | null
  review?: string
  description?: string
}

interface ProfileData {
  id: string
  displayName: string
  avatarUrl: string
  verified?: boolean
  isOnline?: boolean
  discordTag?: string
  lastLoginAt?: string
  memberSince?: string
  profileUrl?: string
}

interface ProfileContentProps {
  activeTab: string
  games: Game[]
  isOwnProfile: boolean
  profile: ProfileData | null
  profileId?: string
  updateProfile?: (updates: any) => Promise<void>
  onAddGame?: () => void
  statusOptions?: any[]
}

export const ProfileContent: FC<ProfileContentProps> = ({
  activeTab,
  games,
  isOwnProfile,
  profile,
  profileId,
  updateProfile,
  onAddGame,
  statusOptions = [],
}) => {
  return (
    <div className='mt-8'>
      {activeTab === 'progress' && profileId && (
        <GameProgressSection userId={profileId} isOwner={isOwnProfile} />
      )}

      {activeTab === 'activity' && profileId && (
        <ActivityFeed userId={profileId} />
      )}

      {activeTab === 'info' && profile && (
        <>
          <ProfileInfo profile={profile} isOwnProfile={isOwnProfile} />
          <GameStats games={games} statusOptions={statusOptions} />
        </>
      )}

      {activeTab === 'settings' && isOwnProfile && profile && updateProfile && (
        <ProfileSettings profile={profile} updateProfile={updateProfile} />
      )}
    </div>
  )
}
