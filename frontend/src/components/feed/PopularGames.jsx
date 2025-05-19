import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../../services/api"

export const PopularGames = () => {
  const [popularGames, setPopularGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mock data for popular games (in a real app, this would come from an API)
  const mockPopularGames = [
    {
      id: 1,
      name: "Cyberpunk 2077",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      steamUrl: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      totalReviews: 487,
      avgRating: 8.4,
      recentReviews: [
        { id: 101, userId: "user1", userName: "NightCity_Fan", avatarUrl: "https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg", rating: 9, text: "После патчей 2.0 игра стала тем, чем должна была быть изначально. Великолепный геймплей и атмосфера." },
        { id: 102, userId: "user2", userName: "V_Samurai", avatarUrl: "https://avatars.steamstatic.com/54a99e29cd69a33218a90bc9fa5292e29824a6fa_full.jpg", rating: 8, text: "Кинематографичный опыт с Киану Ривзом в главной роли. Незабываемое приключение!" }
      ]
    },
    {
      id: 2,
      name: "Baldur's Gate 3",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
      steamUrl: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
      totalReviews: 623,
      avgRating: 9.6,
      recentReviews: [
        { id: 201, userId: "user3", userName: "DnD_Master", avatarUrl: "https://avatars.steamstatic.com/c89ef2e50a8f5ae3bfa0c9d1d64301d45ceca3ec_full.jpg", rating: 10, text: "Лучшая RPG за последние годы. Глубокие персонажи и невероятная свобода выбора." },
        { id: 202, userId: "user4", userName: "Tav_TheHero", avatarUrl: "https://avatars.steamstatic.com/d0f4ae383ba5f05e92a52c8fa5670bc1e74d5b76_full.jpg", rating: 9, text: "Почти идеальная игра, с потрясающими возможностями и хорошо проработанным миром." }
      ]
    },
    {
      id: 3,
      name: "Elden Ring",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
      steamUrl: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      totalReviews: 541,
      avgRating: 9.2,
      recentReviews: [
        { id: 301, userId: "user5", userName: "Tarnished_One", avatarUrl: "https://avatars.steamstatic.com/ff6158731fb236088b31d77ab02bc0156ab97475_full.jpg", rating: 9, text: "Сложно, но справедливо. Открытый мир в стиле FromSoftware - это просто шедевр." },
        { id: 302, userId: "user6", userName: "MaidenlessRun", avatarUrl: "https://avatars.steamstatic.com/57fbd1dfb2c85cd5ea974e746a48f8ea63b328be_full.jpg", rating: 10, text: "Возможно, лучшая игра от FromSoftware. Исследование мира приносит настоящее удовольствие." }
      ]
    },
    {
      id: 4,
      name: "Red Dead Redemption 2",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
      steamUrl: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
      totalReviews: 712,
      avgRating: 9.5,
      recentReviews: [
        { id: 401, userId: "user7", userName: "Arthur_Morgan_Fan", avatarUrl: "https://avatars.steamstatic.com/063db7e2a8cbb3e2fd3261ad5c9f05644a1f423d_full.jpg", rating: 10, text: "Лучший открытый мир и проработка деталей. История Артура Моргана трогает до глубины души." },
        { id: 402, userId: "user8", userName: "WildWest_Cowboy", avatarUrl: "https://avatars.steamstatic.com/270feb1e3a990772d5d6754cb379c7b91a10eeb7_full.jpg", rating: 9, text: "Rockstar создали настоящий шедевр. Атмосфера Дикого Запада передана идеально." }
      ]
    },
    {
      id: 5,
      name: "The Witcher 3: Wild Hunt",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
      steamUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
      totalReviews: 829,
      avgRating: 9.8,
      recentReviews: [
        { id: 501, userId: "user9", userName: "Geralt_of_Rivia", avatarUrl: "https://avatars.steamstatic.com/a7398f6f0bacb730c728e2c60109a30978c6ca02_full.jpg", rating: 10, text: "Даже спустя годы остаётся эталоном RPG с открытым миром. Истории, квесты, персонажи - всё на высшем уровне." },
        { id: 502, userId: "user10", userName: "WitcherFan_1995", avatarUrl: "https://avatars.steamstatic.com/f0e51a4b88419fbc11c427c9c70981fa1d942207_full.jpg", rating: 9, text: "После обновления графики игра выглядит современно. Лучшие побочные квесты в истории RPG." }
      ]
    },
    {
      id: 6,
      name: "Counter-Strike 2",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
      steamUrl: "https://store.steampowered.com/app/730/CounterStrike_2/",
      totalReviews: 1045,
      avgRating: 8.7,
      recentReviews: [
        { id: 601, userId: "user11", userName: "HeadShotPro", avatarUrl: "https://avatars.steamstatic.com/07d4e2d5606e5fdd4607e1f925417bcbdea21f6e_full.jpg", rating: 9, text: "Обновление до CS2 добавило новой жизни классической игре. Улучшенная графика и физика дыма - это именно то, что нужно было." },
        { id: 602, userId: "user12", userName: "AWP_Master", avatarUrl: "https://avatars.steamstatic.com/4c35857ba8c51cb2bc9506c78fcb4765ea69425c_full.jpg", rating: 8, text: "CS всегда будет лучшим соревновательным шутером. Несмотря на некоторые баги, CS2 - это шаг вперёд." }
      ]
    },
    {
      id: 7,
      name: "Hogwarts Legacy",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg",
      steamUrl: "https://store.steampowered.com/app/990080/Hogwarts_Legacy/",
      totalReviews: 384,
      avgRating: 8.2,
      recentReviews: [
        { id: 701, userId: "user13", userName: "WizardWorld_Fan", avatarUrl: "https://avatars.steamstatic.com/8dd14b9c5abc87e3ef5a824c42b4c87e936220db_full.jpg", rating: 8, text: "Лучшая игра по вселенной Гарри Поттера. Исследовать Хогвартс - это настоящее удовольствие." },
        { id: 702, userId: "user14", userName: "Magic_Wand", avatarUrl: "https://avatars.steamstatic.com/11a861e98ef7ed9dbade7afc9a7cfc7f83fdaf0e_full.jpg", rating: 9, text: "Система магии реализована великолепно. Очень атмосферная игра для всех фанатов вселенной." }
      ]
    },
    {
      id: 8,
      name: "Starfield",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg",
      steamUrl: "https://store.steampowered.com/app/1716740/Starfield/",
      totalReviews: 455,
      avgRating: 7.8,
      recentReviews: [
        { id: 801, userId: "user15", userName: "SpaceExplorer", avatarUrl: "https://avatars.steamstatic.com/46a095f138d3f7c6f105bdad9831ce532b391b25_full.jpg", rating: 8, text: "Огромный космический мир с массой контента. Исследование планет затягивает на десятки часов." },
        { id: 802, userId: "user16", userName: "StarshipCaptain", avatarUrl: "https://avatars.steamstatic.com/86985fb7c99734c6a3aec757c6500d5c2370f1b8_full.jpg", rating: 7, text: "Bethesda в своём стиле - масштабный мир, но с техническими проблемами. Всё равно очень увлекательно." }
      ]
    },
    {
      id: 9,
      name: "God of War",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
      steamUrl: "https://store.steampowered.com/app/1593500/God_of_War/",
      totalReviews: 602,
      avgRating: 9.4,
      recentReviews: [
        { id: 901, userId: "user17", userName: "Kratos_Fan", avatarUrl: "https://avatars.steamstatic.com/86274a2e534c478f963d0c88160aea4cd015caee_full.jpg", rating: 10, text: "Идеальный порт на PC. История отношений отца и сына на фоне скандинавской мифологии - это шедевр." },
        { id: 902, userId: "user18", userName: "Atreus_Archer", avatarUrl: "https://avatars.steamstatic.com/c28a71776a012b9b42cd16a808d12e674b439551_full.jpg", rating: 9, text: "Боевая система и головоломки превосходны. Один из лучших экшенов последних лет." }
      ]
    },
    {
      id: 10,
      name: "Palworld",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
      steamUrl: "https://store.steampowered.com/app/1623730/Palworld/",
      totalReviews: 275,
      avgRating: 8.1,
      recentReviews: [
        { id: 1001, userId: "user19", userName: "PalTamer", avatarUrl: "https://avatars.steamstatic.com/f917b39966dbeb6f9c6a557ed86737f8301a8673_full.jpg", rating: 8, text: "Покемоны с оружием - что может быть лучше? Очень интересная механика строительства базы и приручения существ." },
        { id: 1002, userId: "user20", userName: "GunPokemon", avatarUrl: "https://avatars.steamstatic.com/90f0c875b94afbf6a691b7429fba8cbbf4bd7b01_full.jpg", rating: 9, text: "Свежий взгляд на жанр. Сочетание выживания, боёв и коллекционирования существ работает отлично." }
      ]
    }
  ];

  useEffect(() => {
    // In a real app, we would fetch data from an API
    // For now, we'll use a timeout to simulate an API call
    const fetchPopularGames = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Set mock data
        setPopularGames(mockPopularGames)
      } catch (err) {
        setError("Не удалось загрузить популярные игры")
        console.error("Ошибка при загрузке популярных игр:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularGames()
  }, [])

  const openSteamPage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center py-16'>
        <motion.div
          className='w-12 h-12 rounded-full border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)]'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className='mt-4 text-[var(--text-secondary)]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Загрузка популярных игр...
        </motion.p>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        className='bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-400/30 shadow-lg'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className='flex items-center justify-center gap-3 text-red-400 mb-2'>
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
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h3 className='text-lg font-medium'>Ошибка загрузки</h3>
        </div>
        <p className='text-red-400/80 text-center'>{error}</p>
      </motion.div>
    )
  }

  return (
    <div className='space-y-5'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20'>
          <svg
            className='w-5 h-5 text-[var(--accent-secondary)]'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
            />
          </svg>
        </div>
        <h2 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500'>
          Популярные игры
        </h2>
      </div>

      <motion.div
        className='space-y-6'
        initial='hidden'
        animate='visible'
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {popularGames.map(game => (
          <motion.div
            key={game.id}
            className='bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-tertiary)]/50 backdrop-blur-md rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden relative'
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            whileHover={{
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              y: -3,
              borderColor: "rgba(var(--accent-primary-rgb), 0.3)",
            }}
            onClick={() => openSteamPage(game.steamUrl)}
          >
            {/* Game Header */}
            <div className='cursor-pointer'>
              <img 
                src={game.imageUrl} 
                alt={game.name}
                className='w-full h-48 object-cover hover:opacity-90 transition-opacity'
              />
              <div className='p-5'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='text-lg font-bold text-[var(--text-primary)]'>{game.name}</h3>
                  <div className='flex items-center gap-1 bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm font-medium'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    {game.avgRating.toFixed(1)}
                  </div>
                </div>
                <div className='text-xs text-[var(--text-tertiary)]'>
                  На основе {game.totalReviews} {game.totalReviews % 10 === 1 && game.totalReviews % 100 !== 11 ? 'отзыва' : 'отзывов'}
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className='bg-[var(--bg-secondary)]/80 p-5 space-y-3'>
              <h4 className='text-sm font-medium text-[var(--text-secondary)] mb-2'>Последние отзывы</h4>
              {game.recentReviews.map(review => (
                <div key={review.id} className='flex items-start gap-3 border-b border-[var(--divider-color)] pb-3 last:border-b-0 last:pb-0'>
                  <img 
                    src={review.avatarUrl}
                    alt={review.userName}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <div className='flex-1'>
                    <div className='flex justify-between items-center mb-1'>
                      <span className='text-sm font-medium text-[var(--text-primary)]'>{review.userName}</span>
                      <div className='bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-medium'>
                        {review.rating}/10
                      </div>
                    </div>
                    <p className='text-xs text-[var(--text-secondary)]'>{review.text}</p>
                  </div>
                </div>
              ))}

              <div className='pt-2 text-center'>
                <motion.button 
                  className='text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors flex items-center gap-1 mx-auto'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                  </svg>
                  Открыть в Steam
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 