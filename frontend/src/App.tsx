import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Footer } from './components/Footer'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import QuizPage from './pages/QuizPage'
import Users from './pages/Users'
import api from './services/api'

function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (error) {
      console.error('Auth error:', error)
      navigate('/', { replace: true })
      return
    }

    if (token) {
      api.auth.handleAuthToken(token)
      navigate('/', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [location, navigate])

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-b-transparent border-indigo-500'></div>
    </div>
  )
}

function App() {
  return (
    <div className='min-h-screen bg-[var(--bg-primary)] flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/users' element={<Users />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/quizzes' element={<QuizPage />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
