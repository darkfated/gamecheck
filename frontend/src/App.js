import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import { useTheme } from "./contexts/ThemeContext"

function AuthCallback() {
  return <Navigate to='/' replace={true} />
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
