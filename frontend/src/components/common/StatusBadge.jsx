import React from "react"

const statusStyles = {
  playing: {
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-400",
  },
  completed: {
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-400",
  },
  plan_to_play: {
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-400",
  },
  dropped: {
    bgClass: "bg-red-500/10",
    textClass: "text-red-400",
  },
}

export function StatusBadge({ status, label, className = "" }) {
  const styles = statusStyles[status] || {
    bgClass: "bg-gray-500/10",
    textClass: "text-gray-400",
  }

  return (
    <div
      className={`px-3 py-1 rounded-lg text-sm ${styles.bgClass} ${styles.textClass} ${className}`}
    >
      {label}
    </div>
  )
}
