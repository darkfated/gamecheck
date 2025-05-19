import { useMemo } from "react"
import { useAuth } from "../contexts/AuthContext"
import { AnimatePresence } from "framer-motion"
import api from "../services/api"
import { useGameManagement } from "../hooks/useGameManagement"
import { GameCard } from "./GameCard"
import { AddGameForm } from "./AddGameForm"

export default function GameList({ games, onUpdate, editable, isOwner }) {
  const { isAuthenticated, authInitialized } = useAuth()
  const { isSubmitting, authError, addGame, updateGame, deleteGame } =
    useGameManagement(onUpdate)

  const statusOptions = [
    { value: "playing", label: "Играю", color: "emerald" },
    { value: "completed", label: "Пройдено", color: "blue" },
    { value: "plan_to_play", label: "Планирую", color: "purple" },
    { value: "dropped", label: "Брошено", color: "red" },
  ]

  const groupedGames = useMemo(() => {
    // Проверка, есть ли игры для группировки
    if (!Array.isArray(games) || games.length === 0) {
      return statusOptions.reduce((acc, status) => {
        acc[status.value] = []
        return acc
      }, {})
    }

    const grouped = {}
    statusOptions.forEach(status => {
      grouped[status.value] = games.filter(game => game.status === status.value)
    })

    return grouped
  }, [games])

  // Отображаем предупреждение, если пользователь не авторизован, но страница редактируемая
  if (editable && !isAuthenticated && authInitialized) {
    return (
      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center text-red-400'>
        <h2 className='text-xl font-semibold mb-2'>Требуется авторизация</h2>
        <p>Для управления списком игр необходимо выполнить вход через Steam.</p>
        <button
          onClick={() => api.auth.steamLogin()}
          className='mt-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white px-4 py-2 rounded-lg'
        >
          Войти через Steam
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-8 text-[var(--text-primary)]'>
      {/* Форма добавления игры */}
      {editable && isAuthenticated && (
        <AddGameForm
          onSubmit={addGame}
          statusOptions={statusOptions}
          isSubmitting={isSubmitting}
          authError={authError}
        />
      )}

      {/* Отображение сообщения об отсутствии игр */}
      {Array.isArray(games) && games.length === 0 && (
        <div className='bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6 text-center'>
          <p className='text-[var(--text-secondary)]'>
            {isOwner
              ? "У вас пока нет игр в списке. Добавьте первую игру!"
              : "У пользователя пока нет игр в списке."}
          </p>
          {isOwner && !editable && isAuthenticated && (
            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("gamecheck:edit-mode", {
                    detail: { enable: true },
                  })
                )
              }
              className='mt-4 px-4 py-2 bg-[var(--accent-primary)]/20 text-[var(--accent-secondary)] rounded-lg hover:bg-[var(--accent-primary)]/30 transition-all duration-200 text-sm font-medium'
            >
              Добавить первую игру
            </button>
          )}
        </div>
      )}

      {/* Отображение списка игр по категориям статусов */}
      <AnimatePresence>
        {statusOptions.map(status => (
          <div key={status.value} className='space-y-4'>
            {groupedGames[status.value] &&
              groupedGames[status.value].length > 0 && (
                <>
                  <h2 className='text-lg xs:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 px-1'>
                    <div
                      className={`w-2 h-2 rounded-full bg-${status.color}-500`}
                    />
                    {status.label} ({groupedGames[status.value].length})
                  </h2>
                  <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                    {groupedGames[status.value].map(game => (
                      <GameCard
                        key={game.id}
                        game={game}
                        statusOptions={statusOptions}
                        editable={editable}
                        onDelete={deleteGame}
                        onUpdate={updateGame}
                      />
                    ))}
                  </div>
                </>
              )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
