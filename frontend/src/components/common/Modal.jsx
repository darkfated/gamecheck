import React from "react"
import { motion, AnimatePresence } from "framer-motion"

export const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 transition-opacity'
              onClick={onClose}
            >
              <div className='absolute inset-0 bg-black/70' />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
                transition: { duration: 0.2 },
              }}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.3,
              }}
              className='relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1f2e] border border-[#2563eb]/20 rounded-xl shadow-2xl'
            >
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-semibold leading-6 text-gray-100'>
                  {title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-300 transition-colors'
                >
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </motion.button>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='space-y-4'
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
