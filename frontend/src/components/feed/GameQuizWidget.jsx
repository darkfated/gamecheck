import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const GameQuizWidget = () => {
  const iframeRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleMessage = event => {
      if (
        iframeRef.current &&
        event.source === iframeRef.current.contentWindow
      ) {
        const { data } = event

        if (data.type === "WIDGET_LOADED") {
          setIsLoaded(true)
        }
      }
    }

    window.addEventListener("message", handleMessage)

    const checkIframeLoaded = () => {
      if (iframeRef.current) {
        try {
          if (iframeRef.current.contentWindow) {
            if (!isLoaded) {
              setIsLoaded(true)
            }
          }
        } catch (e) {
          setError("Не удалось загрузить компонент викторины: " + e.message)
        }
      }
    }

    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        checkIframeLoaded()
      }
    }, 2000)

    return () => {
      window.removeEventListener("message", handleMessage)
      clearTimeout(timeoutId)
    }
  }, [isLoaded])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--border-color)]'
    >
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
          Игровая викторина
        </h2>
        <motion.div
          className='text-sm font-medium bg-[var(--bg-tertiary)]/60 backdrop-blur-sm py-1 px-3 rounded-full text-[var(--accent-tertiary)]'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ежедневно
        </motion.div>
      </div>

      <p className='text-sm text-[var(--text-secondary)] mb-4'>
        Проверьте свои знания игр в нашей ежедневной викторине.
      </p>

      <AnimatePresence mode='wait'>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4'
          >
            <p className='text-sm'>{error}</p>
          </motion.div>
        ) : (
          <motion.div
            style={{ position: "relative" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <iframe
              ref={iframeRef}
              src='/widgets/game-quiz.html'
              title='Game Quiz Widget'
              className='w-full h-[480px] border-none rounded-lg overflow-hidden bg-transparent shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
              loading='eager'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            />

            {!isLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute inset-0 flex items-center justify-center bg-[var(--bg-tertiary)]/50 backdrop-blur-sm rounded-lg'
              >
                <div className='text-center'>
                  <motion.div
                    className='inline-block h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full mb-2'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className='text-sm text-[var(--text-secondary)]'>
                    Загрузка викторины...
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default GameQuizWidget
