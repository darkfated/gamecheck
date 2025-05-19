import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ActivityFeed } from "../components/feed/ActivityFeed"
import { FeedTabs } from "../components/feed/FeedTabs"
import { UserSearch } from "../components/feed/UserSearch"
import api from "../services/api"
import { motion, AnimatePresence } from "framer-motion"
import VueGameWidget from "../components/VueGameWidget"

export default function Feed() {
  const { user, login } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState(user ? "following" : "all")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".animate-on-load")
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("animate-fadeIn")
        }, index * 100)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = async e => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const response = await api.users.searchUsers(searchQuery)
      setSearchResults(response.data)
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setIsSearching(false)
    }
  }

  if (!user) {
    return (
      <motion.div
        className='container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-color)]'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
          style={{
            background:
              "linear-gradient(to bottom right, rgba(var(--bg-secondary-rgb), 0.9), rgba(var(--bg-tertiary-rgb), 0.9))",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-6 py-8'>
            <motion.div
              className='flex justify-center mb-4'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: 0.4,
              }}
            >
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center p-1 shadow-lg'>
                <div
                  className='w-full h-full rounded-full flex items-center justify-center'
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
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
                      d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.h2
              className='text-2xl md:text-3xl font-bold text-white text-center'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Добро пожаловать в GameCheck!
            </motion.h2>
          </div>

          <div className='px-6 py-8'>
            <motion.p
              className='text-[var(--text-secondary)] mb-8 text-center leading-relaxed'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Войдите через Steam, чтобы отслеживать свои игры и следить за
              активностью друзей в игровом сообществе.
            </motion.p>

            <motion.div
              className='flex justify-center'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={login}
                className='px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                  />
                </svg>
                Войти через Steam
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {user && <FeedTabs activeTab={activeTab} setActiveTab={setActiveTab} />}
          <ActivityFeed
            showFollowingOnly={activeTab === "following"}
            userId={activeTab === "user" ? user?.id : null}
          />
        </div>

        <div className="space-y-6">
          <UserSearch />
          
          {/* Интеграция Vue компонента */}
          <div className="modern-card">
            <VueGameWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
