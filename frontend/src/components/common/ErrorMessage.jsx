import React from "react"

export const ErrorMessage = ({ message, onRetry = null }) => {
  return (
    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
      <p className='text-red-600 text-center'>{message}</p>
      {onRetry && (
        <div className='mt-4 text-center'>
          <button
            onClick={onRetry}
            className='text-blue-500 hover:text-blue-700 underline'
          >
            Попробовать снова
          </button>
        </div>
      )}
    </div>
  )
}
