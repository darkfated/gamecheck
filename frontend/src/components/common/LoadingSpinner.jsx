import React from "react"

export const LoadingSpinner = ({ size = "medium", fullScreen = false }) => {
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
  }

  const spinner = (
    <div
      className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClasses[size]}`}
    />
  )

  if (fullScreen) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-[#151b27] bg-opacity-75 z-50'>
        {spinner}
      </div>
    )
  }

  return <div className='flex justify-center py-4'>{spinner}</div>
}
