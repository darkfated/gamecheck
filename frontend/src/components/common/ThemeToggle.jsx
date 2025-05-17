import React from "react"
import { useTheme } from "../../contexts/ThemeContext"

export const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span className='mr-3 text-sm font-medium'>
        {theme === "dark" ? "Тёмная тема" : "Светлая тема"}
      </span>
      <label className='relative inline-flex items-center cursor-pointer'>
        <input
          type='checkbox'
          className='sr-only peer'
          checked={theme === "light"}
          onChange={toggleTheme}
        />
        <div
          className={`
          w-11 h-6 peer-focus:outline-none rounded-full 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:rounded-full after:h-5 after:w-5 
          after:transition-all peer-checked:after:translate-x-full 
          ${
            theme === "dark"
              ? "bg-gray-700 after:border-gray-600"
              : "bg-blue-500 after:border-blue-300"
          }
        `}
        ></div>
        <span className='ml-3 text-sm font-medium opacity-0 w-0'>Toggle</span>
      </label>
    </div>
  )
}
