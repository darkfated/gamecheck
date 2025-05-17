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
    <div className='flex flex-col items-center pt-20 min-h-screen'>
      <div className='bg-[var(--bg-secondary)] rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4'>
          <h2 className='text-xl font-bold text-white'>
            Добро пожаловать в GameCheck!
          </h2>
        </div>

        <div className='px-6 py-4'>
          <div className='flex items-center justify-center mb-6'>
            <div className='w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-14 w-14 text-white'
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

          <h3 className='text-[var(--text-primary)] text-center text-lg font-semibold mb-4'>
            Отслеживайте свой игровой прогресс
          </h3>

          <p className='text-[var(--text-secondary)] mb-6 text-center'>
            GameCheck — это сервис для отслеживания прогресса в видеоиграх. Вы
            можете добавлять игры в свою коллекцию, отмечать их статус,
            оценивать, следить за активностью друзей и многое другое.
          </p>

          <div className='flex flex-col space-y-4'>
            <div className='flex items-center'>
              <div className='bg-[var(--accent-primary)]/20 rounded-full p-1 mr-3'>
                <svg
                  className='w-5 h-5 text-[var(--accent-secondary)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <span className='text-[var(--text-secondary)]'>
                Отслеживайте прогресс в играх
              </span>
            </div>

            <div className='flex items-center'>
              <div className='bg-[var(--accent-primary)]/20 rounded-full p-1 mr-3'>
                <svg
                  className='w-5 h-5 text-[var(--accent-secondary)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <span className='text-[var(--text-secondary)]'>
                Следите за активностью друзей
              </span>
            </div>

            <div className='flex items-center'>
              <div className='bg-[var(--accent-primary)]/20 rounded-full p-1 mr-3'>
                <svg
                  className='w-5 h-5 text-[var(--accent-secondary)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <span className='text-[var(--text-secondary)]'>
                Делитесь своими впечатлениями
              </span>
            </div>
          </div>

          <div className='flex justify-center mt-8'>
            <button
              onClick={handleContinue}
              className='px-8 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-lg rounded-lg transition-colors transform hover:scale-105 transition duration-200'
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
