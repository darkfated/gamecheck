import React from "react"
import { GAME_STATUS_CONFIG } from "../../constants"

export function StatusBadge({ status, label, className = "" }) {
  const statusConfig = GAME_STATUS_CONFIG[status] || {
    bgClass: "bg-gray-500/10",
    textClass: "text-gray-400",
  }

  return (
    <div
      className={`px-3 py-1 rounded-lg text-sm ${statusConfig.bgClass} ${statusConfig.textClass} ${className}`}
    >
      {label}
    </div>
  )
}
