import { Routes, Route, useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "./components/Navbar"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import { useTheme } from "./contexts/ThemeContext"

// Компонент приветствия
function AuthCallback() {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate("/")
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] py-10'>
      <div
        className='rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden'
        style={{
          backgroundColor: "rgba(var(--bg-secondary-rgb), 0.8)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(var(--accent-primary-rgb), 0.1)",
        }}
      >
        <div className='bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6'>
          <div className='flex items-center justify-center mb-3'>
            <div className='p-2 rounded-xl bg-white/20 backdrop-blur-sm'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 text-white'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
                />
              </svg>
            </div>
          </div>
          <h2 className='text-2xl md:text-3xl font-bold text-white text-center'>
            Добро пожаловать в GameCheck!
          </h2>
        </div>

        <div className='px-6 py-8 md:px-8'>
          <div className='flex items-center justify-center mb-8'>
            <div className='w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-1 shadow-lg'>
              <div
                className='w-full h-full rounded-full flex items-center justify-center'
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
                  />
                </svg>
              </div>
            </div>
          </div>

          <h3 className='text-[var(--text-primary)] text-center text-xl font-bold mb-4'>
            Отслеживайте свой игровой прогресс
          </h3>

          <p className='text-[var(--text-secondary)] mb-8 text-center leading-relaxed'>
            GameCheck — это современный сервис для отслеживания прогресса в
            видеоиграх. Создавайте коллекции, делитесь впечатлениями и следите
            за активностью друзей.
          </p>

          <div className='space-y-5'>
            <div className='flex items-center transform transition-transform hover:translate-x-1'>
              <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-2 shadow-md mr-4'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
              </div>
              <span className='text-[var(--text-primary)] font-medium'>
                Отслеживайте прогресс в играх
              </span>
            </div>

            <div className='flex items-center transform transition-transform hover:translate-x-1'>
              <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-2 shadow-md mr-4'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <span className='text-[var(--text-primary)] font-medium'>
                Следите за активностью друзей
              </span>
            </div>

            <div className='flex items-center transform transition-transform hover:translate-x-1'>
              <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-2 shadow-md mr-4'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
              </div>
              <span className='text-[var(--text-primary)] font-medium'>
                Делитесь своими впечатлениями
              </span>
            </div>
          </div>

          <div className='flex justify-center mt-10'>
            <button
              onClick={handleContinue}
              className='px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl'
            >
              Начать
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className='min-h-screen bg-[var(--bg-primary)]'>
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
