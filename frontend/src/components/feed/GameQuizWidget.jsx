import React, { useEffect, useRef, useState } from "react"

const GameQuizWidget = () => {
  const iframeRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleMessage = (event) => {
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        const { data } = event
        
        if (data.type === 'VUE_WIDGET_LOADED') {
          setIsLoaded(true)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    const checkIframeLoaded = () => {
      if (iframeRef.current) {
        try {
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
        } catch (e) {
          setError('Не удалось загрузить компонент викторины: ' + e.message)
        }
      }
    }

    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        checkIframeLoaded()
      }
    }, 2000)

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
          src="/widgets/game-quiz.html"
          title="Game Quiz Widget"
          style={{
            width: '100%',
            height: '480px',
            border: 'none',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'block'
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

export default GameQuizWidget 