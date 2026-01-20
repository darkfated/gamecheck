export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  timeLimit?: number
}

export interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'true_false'
  options: Option[]
  correctAnswer: string
  explanation?: string
}

export interface Option {
  id: string
  text: string
}

export const quizzes: Quiz[] = [
  {
    id: 'gaming-basics',
    title: 'Основы игровой индустрии',
    description: 'Проверьте свои знания об истории и разработке видеоигр',
    difficulty: 'easy',
    category: 'История',
    timeLimit: 600,
    questions: [
      {
        id: 'q1',
        text: 'В каком году была выпущена первая консоль Nintendo?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: '1983 (Famicom)' },
          { id: 'o2', text: '1985 (NES)' },
          { id: 'o3', text: '1990 (SNES)' },
          { id: 'o4', text: '1996 (N64)' },
        ],
        correctAnswer: 'o1',
        explanation:
          'Famicom была выпущена в Японии в 1983 году, а NES (Nintendo Entertainment System) вышла в Америке в 1985.',
      },
      {
        id: 'q2',
        text: "Какой жанр игр часто называют 'душой' индустрии?",
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'RPG (Role-Playing Games)' },
          { id: 'o2', text: 'FPS (First-Person Shooters)' },
          { id: 'o3', text: 'Strategy' },
          { id: 'o4', text: 'Puzzle' },
        ],
        correctAnswer: 'o1',
        explanation:
          'RPG часто рассматривают как жанр, определивший много аспектов игровой индустрии.',
      },
      {
        id: 'q3',
        text: 'Steam была создана компанией Valve в 2003 году. Это правда?',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
        explanation:
          'Да, Steam была запущена в 2003 году и изменила цифровое распределение игр.',
      },
    ],
  },
  {
    id: 'game-design',
    title: 'Дизайн видеоигр',
    description: 'Углубленный тест о принципах дизайна и разработки игр',
    difficulty: 'medium',
    category: 'Дизайн',
    timeLimit: 900,
    questions: [
      {
        id: 'q1',
        text: 'Что такое game loop в разработке игр?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Основной цикл обновления игры, обрабатывающий ввод, логику и рендеринг',
          },
          { id: 'o2', text: 'Цикл чтения файлов конфигурации' },
          { id: 'o3', text: 'Пользовательский интерфейс меню игры' },
          { id: 'o4', text: 'Система сохранения прогресса' },
        ],
        correctAnswer: 'o1',
        explanation:
          'Game loop - это фундаментальная архитектурная концепция, где каждый кадр обрабатывается: ввод → логика → вывод.',
      },
      {
        id: 'q2',
        text: 'Какой из этих игровых движков наиболее популярен для инди-разработки?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Unreal Engine' },
          { id: 'o2', text: 'Unity' },
          { id: 'o3', text: 'Godot' },
          { id: 'o4', text: 'GameMaker' },
        ],
        correctAnswer: 'o2',
        explanation:
          'Unity и Godot очень популярны для инди-разработки, но Unity имеет самую большую экосистему.',
      },
      {
        id: 'q3',
        text: 'Главной целью game balance является обеспечение веселья для игроков. Это правда?',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
        explanation:
          'Правильно! Balance нужен для того, чтобы игра была интересной и захватывающей для всех типов игроков.',
      },
    ],
  },
  {
    id: 'esports-101',
    title: 'Киберспорт 101',
    description: 'Базовые знания о профессиональном киберспорте',
    difficulty: 'easy',
    category: 'Киберспорт',
    timeLimit: 480,
    questions: [
      {
        id: 'q1',
        text: 'Какая игра является одной из самых популярных в киберспорте?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'League of Legends' },
          { id: 'o2', text: 'Counter-Strike' },
          { id: 'o3', text: 'Dota 2' },
          { id: 'o4', text: 'Все вышеперечисленные' },
        ],
        correctAnswer: 'o4',
        explanation:
          'Все эти игры имеют мировые турниры и профессиональные сцены.',
      },
      {
        id: 'q2',
        text: 'Во сколько лет молодой игрок может начать профессиональную карьеру?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: '14-15 лет' },
          { id: 'o2', text: '16-17 лет' },
          { id: 'o3', text: '18+ лет' },
          { id: 'o4', text: 'Нет ограничений' },
        ],
        correctAnswer: 'o2',
        explanation:
          'В большинстве турниров требуется возраст 16-18 лет из-за контрактов и правил.',
      },
    ],
  },
]

export const getQuizById = (id: string): Quiz | undefined => {
  return quizzes.find(q => q.id === id)
}

export const getQuizzesByCategory = (category: string): Quiz[] => {
  return quizzes.filter(q => q.category === category)
}

export const getCategories = (): string[] => {
  return [...new Set(quizzes.map(q => q.category))]
}
