import React, { useEffect, useRef, useState } from "react"

// Обертка React для Vue компонента через iframe
const VueGameWidget = () => {
  const iframeRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Обработчик сообщений от iframe
    const handleMessage = (event) => {
      // Безопасная проверка источника сообщения
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        const { data } = event
        
        // Обработка сообщения о загрузке
        if (data.type === 'VUE_WIDGET_LOADED') {
          console.log('Vue widget loaded successfully!')
          setIsLoaded(true)
        }
      }
    }

    // Добавляем слушатель сообщений
    window.addEventListener('message', handleMessage)

    // Функция для проверки загрузки iframe
    const checkIframeLoaded = () => {
      if (iframeRef.current) {
        try {
          // Проверяем доступность iframe
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
          
          if (!iframeDoc) {
            console.warn('Cannot access iframe content - it may be blocked by CORS policy')
          }
        } catch (e) {
          console.error('Error accessing iframe:', e)
          setError('Не удалось загрузить компонент викторины: ' + e.message)
        }
      }
    }

    // Проверяем загрузку через 2 секунды
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        checkIframeLoaded()
      }
    }, 2000)

    // Очищаем обработчики при размонтировании
    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(timeoutId)
    }
  }, [isLoaded])

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <iframe
          ref={iframeRef}
          src="/vue-widget.html"
          title="Game Quiz Widget"
          style={{
            width: '100%',
            height: '480px',
            border: 'none',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'block' // Prevents extra space below iframe
          }}
          loading="eager"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        
        {!isLoaded && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '8px'
            }}
          >
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
              <div className="text-sm text-[var(--text-secondary)]">Загрузка викторины...</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default VueGameWidget 