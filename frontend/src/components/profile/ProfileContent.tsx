import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import { ActivityFeed } from '../feed/ActivityFeed'
import GameProgressSection from '../games/GameProgressSection'
import { GameStats } from './GameStats'
import { ProfileInfo } from './ProfileInfo'
import { ProfileSettings } from './ProfileSettings'

interface ProgressSummary {
  total: number
  avgRating: number
  ratingCount: number
  byStatus: Record<string, number>
}

interface ProfileData {
  id: string
  displayName: string
  avatarUrl: string
  profileUrl: string
  steamId?: string
  discordTag?: string
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
  gamesCount?: number
  totalPlaytime?: number
  averageRating?: number
}

interface Tab {
  id: string
  label: string
}

interface ProfileContentProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: Tab[]
  progressSummary?: ProgressSummary | null
  isOwnProfile: boolean
  profile: ProfileData | null
  profileId?: string
  updateProfile?: (updates: any) => Promise<void>
  statusOptions?: any[]
  followers?: any[]
  following?: any[]
  onShowFollowersModal: () => void
  onShowFollowingModal: () => void
}

const tabVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const ProfileContent: FC<ProfileContentProps> = ({
  activeTab,
  onTabChange,
  tabs,
  progressSummary,
  isOwnProfile,
  profile,
  profileId,
  updateProfile,
  statusOptions = [],
  followers = [],
  following = [],
  onShowFollowersModal,
  onShowFollowingModal,
}) => {
  return (
    <div className='mt-0 w-full'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          layout
        >
          <div>
            {activeTab === 'progress' && profileId && (
              <div className='min-h-[100vh]'>
                <GameProgressSection
                  userId={profileId}
                  isOwner={isOwnProfile}
                />
              </div>
            )}

            {activeTab === 'activity' && profileId && (
              <ActivityFeed userId={profileId} />
            )}

            {activeTab === 'info' && profile && (
              <div className='space-y-8'>
                <ProfileInfo profile={profile} isOwnProfile={isOwnProfile} />
                <GameStats
                  summary={progressSummary || undefined}
                  statusOptions={statusOptions}
                />
              </div>
            )}

            {activeTab === 'settings' &&
              isOwnProfile &&
              profile &&
              updateProfile && (
                <ProfileSettings
                  profile={profile}
                  updateProfile={updateProfile}
                />
              )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
