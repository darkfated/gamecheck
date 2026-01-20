import { FC } from 'react'
import { GAME_STATUS_CONFIG } from '../../constants'

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

export const StatusBadge: FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
}) => {
  const statusConfig = GAME_STATUS_CONFIG[
    status as keyof typeof GAME_STATUS_CONFIG
  ] || {
    bgClass: 'bg-gray-500/10',
    textClass: 'text-gray-400',
  }

  return (
    <div
      className={`px-3 py-1 rounded-lg text-sm ${statusConfig.bgClass} ${statusConfig.textClass} ${className}`}
    >
      {label}
    </div>
  )
}
