import { FC } from 'react'

interface ProgressErrorFallbackProps {
  onRetry?: () => void
}

const ProgressErrorFallback: FC<ProgressErrorFallbackProps> = ({ onRetry }) => {
  return (
    <div className='rounded-lg border border-amber-200 bg-amber-50 p-6 my-4'>
      <div className='flex flex-col items-center'>
        <svg
          className='w-16 h-16 text-amber-400 mb-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>

        <h3 className='text-lg font-semibold text-amber-800 mb-2'>
          Сервис прогресса временно недоступен
        </h3>

        <p className='text-amber-700 mb-4 text-center'>
          Не удалось загрузить данные о прогрессе. Остальная функциональность
          работает нормально.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className='px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-lg transition-colors'
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  )
}

export default ProgressErrorFallback
