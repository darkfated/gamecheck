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
    id: 'gaming-history-expanded',
    title: 'История видеоигр',
    description: 'От Pong до современных игр — факты и события индустрии.',
    category: 'История',
    difficulty: 'medium',
    timeLimit: 1200,
    questions: [
      {
        id: 'q1',
        text: 'В каком году вышел Pong — одна из первых коммерчески успешных видеоигр?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: '1972' },
          { id: 'o2', text: '1980' },
          { id: 'o3', text: '1978' },
          { id: 'o4', text: '1975' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Spacewar! вышла раньше чем Pong.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Какая аркадная игра впервые попала на обложку крупного журнала и стала культурным феноменом?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Pac-Man' },
          { id: 'o2', text: 'Space Invaders' },
          { id: 'o3', text: 'Donkey Kong' },
          { id: 'o4', text: 'Tetris' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: Doom считается одним из первых коммерчески успешных 3D FPS.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какая компания выпустила NES (Nintendo Entertainment System)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Sega' },
          { id: 'o2', text: 'Nintendo' },
          { id: 'o3', text: 'Atari' },
          { id: 'o4', text: 'Sony' },
        ],
        correctAnswer: 'o2',
      },
      {
        id: 'q6',
        text: 'True or False: Tamagotchi породил массовый интерес к виртуальным питомцам.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Кто обычно считается создателем аркад и ранних игровых коммерческих платформ (основатель Atari)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Нолан Бушнелл' },
          { id: 'o2', text: 'Шигеру Миямото' },
          { id: 'o3', text: 'Ральф Бер' },
          { id: 'o4', text: 'Уильям Хигинботам' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'general-gaming-10',
    title: 'Общие вопросы о видеоиграх',
    description: 'Широкая подборка тривии по разным темам из игровой культуры.',
    category: 'Хиты',
    difficulty: 'medium',
    timeLimit: 1000,
    questions: [
      {
        id: 'q1',
        text: "Какой персонаж произносит “It's-a me, Mario!”?",
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Mario' },
          { id: 'o2', text: 'Luigi' },
          { id: 'o3', text: 'Toad' },
          { id: 'o4', text: 'Bowser' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Minecraft — одна из самых продаваемых игр в истории.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Что означает NPC?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Неигровой персонаж' },
          { id: 'o2', text: 'Новый персонаж' },
          { id: 'o3', text: 'Национальный игрок' },
          { id: 'o4', text: 'Нет в игре' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'Какая серия известна как “Elder Scrolls”?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Skyrim' },
          { id: 'o2', text: 'Fallout' },
          { id: 'o3', text: 'The Witcher' },
          { id: 'o4', text: 'Dark Souls' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'True or False: Fortnite впервые вышел в 2017 году.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'Какой персонаж собирает кольца в классической Sega-игре?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Sonic' },
          { id: 'o2', text: 'Tails' },
          { id: 'o3', text: 'Knuckles' },
          { id: 'o4', text: 'Dr. Robotnik' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Что такое “open world”?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Свободная для исследования игровая карта' },
          { id: 'o2', text: 'Многопользовательский режим' },
          { id: 'o3', text: 'Тип интерфейса' },
          { id: 'o4', text: 'Уровневая система' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q8',
        text: 'True or False: Tetris был создан в СССР.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q9',
        text: 'Какая игра сделала революцию в жанре королевской битвы (battle royale)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: "PlayerUnknown's Battlegrounds (PUBG)" },
          { id: 'o2', text: 'H1Z1' },
          { id: 'o3', text: 'Fortnite' },
          { id: 'o4', text: 'Apex Legends' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q10',
        text: 'True or False: Серия “Metal Gear” известна своей стелс-механикой.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'indie-mega-10',
    title: 'Инди: большой квиз',
    description: '10 вопросов про культовые инди-игры, студии и их механики.',
    category: 'Инди игры',
    difficulty: 'medium',
    timeLimit: 1000,
    questions: [
      {
        id: 'q1',
        text: 'Какой жанр у Undertale?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'RPG' },
          { id: 'o2', text: 'Платформер' },
          { id: 'o3', text: 'Пазл' },
          { id: 'o4', text: 'Шутер' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Hades разработала Supergiant Games.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Кто развивал Stardew Valley в одиночку (основной разработчик)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Eric Barone (ConcernedApe)' },
          { id: 'o2', text: 'Notch' },
          { id: 'o3', text: 'Tommy Refenes' },
          { id: 'o4', text: 'Jonathan Blow' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: Celeste — это сложный платформер с фокусом на историю и проходные испытания.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какая инди-игра сочетает ритм и roguelike-механику?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Crypt of the NecroDancer' },
          { id: 'o2', text: 'Hollow Knight' },
          { id: 'o3', text: 'Braid' },
          { id: 'o4', text: 'Fez' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Многие инди-игры выпускаются сначала в раннем доступе (early access).',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Какая инди-игра известна своей минималистичной арт-стилистикой и эмоциональным сюжетом — Celeste, Inside или Braid? (выбери лучший ответ)',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Braid' },
          { id: 'o2', text: 'Inside' },
          { id: 'o3', text: 'Celeste' },
          { id: 'o4', text: 'Hades' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q8',
        text: 'True or False: Minecraft начинался как инди-проект Маркуса Перссона (Notch).',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q9',
        text: 'Какой инди-проект использовал процедурную генерацию и стал хитом — Rogue-like игра?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'The Binding of Isaac' },
          { id: 'o2', text: 'Cuphead' },
          { id: 'o3', text: 'Journey' },
          { id: 'o4', text: 'Inside' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q10',
        text: 'True or False: Инди-игры никогда не попадают в премии и крупные чарты.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o2',
      },
    ],
  },

  {
    id: 'esports-mega-10',
    title: 'Киберспорт: глубокий квиз',
    description:
      '10 вопросов про историю, турнирные форматы и предметы киберспорта.',
    category: 'Киберспорт',
    difficulty: 'medium',
    timeLimit: 1000,
    questions: [
      {
        id: 'q1',
        text: 'Какие игры традиционно считаются основами киберспорта?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'League of Legends, Counter-Strike, Dota 2' },
          { id: 'o2', text: 'Tetris, Solitaire' },
          { id: 'o3', text: 'The Sims, SimCity' },
          { id: 'o4', text: 'Minecraft, Roblox' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Многие профессиональные команды имеют спонсоров и зарплаты.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Какой жанр особенно популярен на киберспортивных сценах?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'MOBA' },
          { id: 'o2', text: 'Симуляторы' },
          { id: 'o3', text: 'Пазлы' },
          { id: 'o4', text: 'Point-and-click' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: Турниры бывают онлайн и офлайн (LAN).',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какой формат матчей часто используется в CS:GO на профессиональном уровне?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: '5 на 5' },
          { id: 'o2', text: '1 на 1' },
          { id: 'o3', text: '3 на 3' },
          { id: 'o4', text: 'Командный режим' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Множество киберспортивных событий имеют призовые фонды в миллионах долларов.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Что означает “LAN” в контексте турниров?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Local Area Network' },
          { id: 'o2', text: 'League and Network' },
          { id: 'o3', text: 'Local Action Night' },
          { id: 'o4', text: 'Live Arena Night' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q8',
        text: 'True or False: Некоторые киберспортсмены переходят в тренерскую или аналитическую работу.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q9',
        text: 'Какая игра известна своими “мейджор” турнирами с большими призами?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Dota 2' },
          { id: 'o2', text: 'Zelda' },
          { id: 'o3', text: 'Tetris' },
          { id: 'o4', text: 'Animal Crossing' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q10',
        text: 'True or False: Возрастные ограничения турниров и контрактов могут влиять на начало карьеры игрока.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'game-dev-basics-expanded',
    title: 'Game Dev: основы (расширенный)',
    description:
      'Больше вопросов по практикам, терминологии и процессам разработки игр.',
    category: 'Разработка',
    difficulty: 'easy',
    timeLimit: 900,
    questions: [
      {
        id: 'q1',
        text: 'Что такое game loop?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Цикл ввода → логика → рендеринг' },
          { id: 'o2', text: 'Система меню' },
          { id: 'o3', text: 'Процедура установки' },
          { id: 'o4', text: 'Механика сохранения' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Unity — это игровой движок.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Что такое “build” в контексте разработки игр?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Сборка игры для платформы' },
          { id: 'o2', text: 'Персонаж снаряжения' },
          { id: 'o3', text: 'Графический баг' },
          { id: 'o4', text: 'Тестовая команда' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: CI/CD практики применимы и для разработки игр.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Что такое “asset pipeline”?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Процесс подготовки и импорта ресурсов (модели, текстуры, звук)',
          },
          { id: 'o2', text: 'Система сетевого кода' },
          { id: 'o3', text: 'Алгоритм AI' },
          { id: 'o4', text: 'Процедура рендера' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'Какой из паттернов часто применяют в геймдеве для обработки сущностей и компонентов?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'ECS (Entity Component System)' },
          { id: 'o2', text: 'MVC' },
          { id: 'o3', text: 'Singleton только' },
          { id: 'o4', text: 'Observer исключительно' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'game-dev-terms-advanced',
    title: 'Термины геймдева — продвинутый',
    description:
      'Термины, паттерны и инженерные концепции для разработчиков игр.',
    category: 'Разработка',
    difficulty: 'hard',
    timeLimit: 1100,
    questions: [
      {
        id: 'q1',
        text: 'Что означает аббревиатура FPS в контексте частоты кадров?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Frames Per Second' },
          { id: 'o2', text: 'First Person Shooter' },
          { id: 'o3', text: 'Frames Per Game' },
          { id: 'o4', text: 'Fast Packet Sync' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Deterministic lockstep — подход к синхронизации сетевой игры.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Что такое “hitbox”?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Скрытая область для столкновений/ударов' },
          { id: 'o2', text: 'Видимый спрайт' },
          { id: 'o3', text: 'Текстура' },
          { id: 'o4', text: 'Сетевой пакет' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: LOD (level of detail) — метод снижения детализации для производительности.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Что такое “baked lighting”?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Освещение, предрасчитываемое на этапе сборки' },
          { id: 'o2', text: 'Динамическое освещение в реальном времени' },
          { id: 'o3', text: 'Только для 2D' },
          { id: 'o4', text: 'Звук' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'Что такое “physics engine”?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Система, моделирующая физику (коллизии, гравитация)',
          },
          { id: 'o2', text: 'Инструмент анимации' },
          { id: 'o3', text: 'UI-фреймворк' },
          { id: 'o4', text: 'Рендер-движок' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'True or False: Оверлейная отладка (profiling) помогает находить узкие места в CPU/GPU.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q8',
        text: 'Что такое “deterministic playback” в тестировании игр?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Воспроизведение действий с одинаковым результатом при тех же входных данных',
          },
          { id: 'o2', text: 'Случайная генерация контента' },
          { id: 'o3', text: 'Только для аудио' },
          { id: 'o4', text: 'Тип AI' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'technology-and-future',
    title: 'Технологии и будущее игр',
    description: 'VR/AR, трассировка лучей, движки и тренды индустрии.',
    category: 'Технологии',
    difficulty: 'hard',
    timeLimit: 1200,
    questions: [
      {
        id: 'q1',
        text: 'Что такое ray tracing (трассировка лучей)?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Метод симуляции поведения света для реалистичного освещения',
          },
          { id: 'o2', text: 'Система сетевого кода' },
          { id: 'o3', text: 'AI-алгоритм' },
          { id: 'o4', text: 'Тип текстурирования' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: AR — это дополненная реальность.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Какой движок с открытым исходным кодом популярен у инди-разработчиков?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Godot' },
          { id: 'o2', text: 'Unreal Engine' },
          { id: 'o3', text: 'Frostbite' },
          { id: 'o4', text: 'Rage' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: VR игры требуют рендеринга с высокой частотой кадров для комфорта пользователя.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Что такое “cloud gaming”?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Запуск игры на удалённом сервере и стриминг видео игроку',
          },
          { id: 'o2', text: 'Игры только для облаков' },
          { id: 'o3', text: 'Проектирование облаков в играх' },
          { id: 'o4', text: 'Сервис покупки внутриигровых товаров' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Machine Learning применяется в играх для генерации контента и поведения NPC.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Какая технология помогает уменьшить нагрузку на GPU за счёт реконструкции изображения (example: DLSS)?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Апскейлинг с помощью нейросетей (DLSS/FidelityFX)',
          },
          { id: 'o2', text: 'Ray tracing' },
          { id: 'o3', text: 'Physics engine' },
          { id: 'o4', text: 'LOD' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q8',
        text: 'True or False: Edge computing близок к cloud gaming и может помочь снизить задержки.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'genre-master-expanded',
    title: 'Жанровый мастер — продвинутый',
    description: 'Глубокие вопросы о жанрах, поджанрах и отличиях механик.',
    category: 'Жанры',
    difficulty: 'hard',
    timeLimit: 1000,
    questions: [
      {
        id: 'q1',
        text: 'Что такое MOBA в игровом жанре?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Мультиплеерная командная игра с линиями и базами (например, LoL, Dota)',
          },
          { id: 'o2', text: 'Одиночный платформер' },
          { id: 'o3', text: 'Гоночная игра' },
          { id: 'o4', text: 'Пазл игра' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Roguelike игры часто имеют процедурную генерацию и permadeath.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Какой жанр характерен для игр с ресурсами, строительством и управлением экономикой (пример: Cities: Skylines)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Симулятор/Стратегия' },
          { id: 'o2', text: 'Файтинг' },
          { id: 'o3', text: 'Шутер' },
          { id: 'o4', text: 'RPG' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: “Metroidvania” — гибрид платформера и action-RPG с исследованием карты.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Что выделяет “soulslike” игры как поджанр?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Сложные сражения, наказание за смерть, исследования мира',
          },
          { id: 'o2', text: 'Казуальный геймплей' },
          { id: 'o3', text: 'Симуляция вождения' },
          { id: 'o4', text: 'Ритм-механики' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: VR-экспириенс чаще относится к жанру, а не к платформе.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Ложь' },
          { id: 'o2', text: 'Правда' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Какой жанр чаще всего использует permadeath как ключевую механику?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Roguelike' },
          { id: 'o2', text: 'MMO' },
          { id: 'o3', text: 'Sports' },
          { id: 'o4', text: 'Simulator' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q8',
        text: 'True or False: “Open-world” и “sandbox” — синонимы.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Ложь' },
          { id: 'o2', text: 'Правда' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'retro-classics-5',
    title: 'Ретро-классика',
    description: 'Классические игры, аркады и пионеры жанров.',
    category: 'История',
    difficulty: 'medium',
    timeLimit: 900,
    questions: [
      {
        id: 'q1',
        text: 'Какая игра дала начало массовой популярности аркад в 80-х?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Space Invaders' },
          { id: 'o2', text: 'Pong' },
          { id: 'o3', text: 'Tetris' },
          { id: 'o4', text: 'Pac-Man' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Donkey Kong представил Марио как игрового персонажа.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Какая компания стояла за Atari?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Atari' },
          { id: 'o2', text: 'Nintendo' },
          { id: 'o3', text: 'Sega' },
          { id: 'o4', text: 'Sony' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: Tetris изначально был разработан одним человеком в СССР.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какая ретро-серия дала основу для современных платформеров?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Super Mario Bros.' },
          { id: 'o2', text: 'The Legend of Zelda' },
          { id: 'o3', text: 'Metroid' },
          { id: 'o4', text: 'Sonic' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'arcade-and-arcade-history-6',
    title: 'Аркады и пионеры игр',
    description:
      'Короткий, но насыщенный набор вопросов про золотой век аркад.',
    category: 'История',
    difficulty: 'hard',
    timeLimit: 900,
    questions: [
      {
        id: 'q1',
        text: 'Какая аркадная игра ввела концепцию «волн врагов»?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Space Invaders' },
          { id: 'o2', text: 'Pac-Man' },
          { id: 'o3', text: 'Pong' },
          { id: 'o4', text: 'Asteroids' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Golden age of arcade video games пришёлся на конец 70-х — начало 80-х.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Какая игра принесла популярность лабиринтам и преследованиям (чёрные привидения)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Pac-Man' },
          { id: 'o2', text: 'Donkey Kong' },
          { id: 'o3', text: 'Frogger' },
          { id: 'o4', text: 'Galaga' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: Аркадные автоматы повлияли на дизайн уровней и сложность многих современных игр.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какой жанр стал массовым благодаря аркадам: shoot ’em up, puzzle или sim?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Shoot ’em up' },
          { id: 'o2', text: 'Sim' },
          { id: 'o3', text: 'Visual novel' },
          { id: 'o4', text: 'MMO' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Многие аркадные игры были портированы на домашние консоли и ПК.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'hit-games-facts-8',
    title: 'Факты о популярных играх',
    description: 'Подборка фактов о хитах индустрии и значимых релизах.',
    category: 'Хиты',
    difficulty: 'medium',
    timeLimit: 900,
    questions: [
      {
        id: 'q1',
        text: 'Какая игра часто считается самой продаваемой в истории (по экземплярам)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Minecraft' },
          { id: 'o2', text: 'GTA V' },
          { id: 'o3', text: 'Tetris' },
          { id: 'o4', text: 'Wii Sports' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: GTA V заработала несколько миллиардов долларов с релиза.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'В какой игре главный герой — Натан Дрейк?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Uncharted' },
          { id: 'o2', text: 'Tomb Raider' },
          { id: 'o3', text: "Assassin's Creed" },
          { id: 'o4', text: 'GTA' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: The Witcher 3 получил долгое признание за сюжет и открытый мир.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какая серия известна своими пазловыми механиками и порталами?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Portal' },
          { id: 'o2', text: 'Half-Life' },
          { id: 'o3', text: 'BioShock' },
          { id: 'o4', text: 'Dishonored' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Metal Gear Solid ввёл стелс как ключевой элемент в AAA-проекте.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Какая игра популяризировала концепцию soulslike?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Dark Souls' },
          { id: 'o2', text: "Demon's Souls" },
          { id: 'o3', text: 'Sekiro' },
          { id: 'o4', text: 'Bloodborne' },
        ],
        correctAnswer: 'o2',
      },
      {
        id: 'q8',
        text: 'True or False: Многие крупные хиты поддерживают мод-сообщество и пользовательский контент.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'gaming-memes-6',
    title: 'Геймерские мемы и культура',
    description: 'Лёгкие, шуточные вопросы про мемы, сленг и игровую культуру.',
    category: 'Мемы',
    difficulty: 'easy',
    timeLimit: 600,
    questions: [
      {
        id: 'q1',
        text: 'Что значит “git gud” в геймерском жаргоне?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Стань лучше' },
          { id: 'o2', text: 'Сдайся' },
          { id: 'o3', text: 'Купи DLC' },
          { id: 'o4', text: 'Обнови драйверы' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: “Noob” — это комплимент опытному игроку.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o2',
      },
      {
        id: 'q3',
        text: 'Что обычно означает “EZ” после матча?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Легко' },
          { id: 'o2', text: 'Тяжело' },
          { id: 'o3', text: 'Невероятно' },
          { id: 'o4', text: 'Опять' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: “TFW” означает “that feel when” и часто используется в мемах.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Что такое “ragequit”?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Покинуть игру в ярости' },
          { id: 'o2', text: 'Начать матч заново' },
          { id: 'o3', text: 'Купон на скидку' },
          { id: 'o4', text: 'Файл сохранения' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Мем “Press F to pay respects” пришёл из видеоигры.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'game-mechanics-8',
    title: 'Геймплей и механики — разбираемся',
    description: 'Тест по механикам, системам и игровому балансу.',
    category: 'Механики',
    difficulty: 'hard',
    timeLimit: 1100,
    questions: [
      {
        id: 'q1',
        text: 'Что такое RNG в играх?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Генератор случайных чисел (randomness)' },
          { id: 'o2', text: 'Тип контроллера' },
          { id: 'o3', text: 'Инвентарь' },
          { id: 'o4', text: 'Система уровней' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: “Balance” в игре означает последовательное усложнение без учёта весов предметов.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Ложь' },
          { id: 'o2', text: 'Правда' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Что обычно отвечает за взаимодействие физики в игре (коллизии, гравитация)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Physics engine' },
          { id: 'o2', text: 'AI' },
          { id: 'o3', text: 'UI' },
          { id: 'o4', text: 'Shader' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: Hitbox — это область, используемая для расчёта попаданий.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Как называется система, где игроки постепенно улучшают персонажа (уровни, скиллы)?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Progression' },
          { id: 'o2', text: 'Sandbox' },
          { id: 'o3', text: 'PvP' },
          { id: 'o4', text: 'Matchmaking' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Permadeath — это механика постоянной смерти без возрождения.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q7',
        text: 'Что такое “sandbox” в геймдизайне?',
        type: 'multiple_choice',
        options: [
          {
            id: 'o1',
            text: 'Игровая среда с высокой степенью свободы и инструментами для действий',
          },
          { id: 'o2', text: 'Линейный сюжет' },
          { id: 'o3', text: 'Только PvP' },
          { id: 'o4', text: 'Тип меню' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q8',
        text: 'True or False: Dynamic difficulty — адаптация сложности под игрока.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'fun-facts-gaming-6',
    title: 'Интересные факты о видеоиграх',
    description: 'Короткие курьёзные факты и необычные истории из мира игр.',
    category: 'Мемы',
    difficulty: 'easy',
    timeLimit: 700,
    questions: [
      {
        id: 'q1',
        text: 'Какие игры Microsoft включала в поставку Windows для обучения пользованию мышью?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Косынка, Сапёр, Свободная ячейка' },
          { id: 'o2', text: 'GTA, Minecraft' },
          { id: 'o3', text: 'The Sims' },
          { id: 'o4', text: 'Tetris' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: В Minecraft энтузиасты собирали вычислительные устройства внутри игры.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Как называется знаменитая баг-серия “Konami code”?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: '↑↑↓↓←→←→BA' },
          { id: 'o2', text: 'ABABAB' },
          { id: 'o3', text: 'Start+Select' },
          { id: 'o4', text: 'Ctrl+Alt+Del' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: “Easter egg” — скрытое содержимое, оставленное разработчиком.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какая игра использовала пермамодель (permadeath) в классическом понимании?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Rogue' },
          { id: 'o2', text: 'Super Mario' },
          { id: 'o3', text: 'Sonic' },
          { id: 'o4', text: 'Tetris' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: Многие современные игры используют внутренние торты и награды для удержания игроков.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
    ],
  },

  {
    id: 'video-game-origins-6',
    title: 'Истоки видеоигр — кратко',
    description:
      'Короткий набор вопросов о первых экспериментах и разработчиках.',
    category: 'История',
    difficulty: 'medium',
    timeLimit: 900,
    questions: [
      {
        id: 'q1',
        text: 'Кто создал экспериментальную “Brown Box” — одну из первых игровых платформ?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Ральф Бер' },
          { id: 'o2', text: 'Нолан Бушнелл' },
          { id: 'o3', text: 'Уильям Хигинботам' },
          { id: 'o4', text: 'Стив Рассел' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q2',
        text: 'True or False: Первые игры создавались на университетских компьютерах ещё в 1950-60-х.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q3',
        text: 'Что такое “arcade cabinet”?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Игровой автомат в корпусе' },
          { id: 'o2', text: 'Портативная консоль' },
          { id: 'o3', text: 'Тип джойстика' },
          { id: 'o4', text: 'Клавиатурный режим' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q4',
        text: 'True or False: Spacewar! была одной из ранних компьютерных игр, созданных на PDP-1.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q5',
        text: 'Какая из этих игр появилась раньше?',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Spacewar!' },
          { id: 'o2', text: 'Pong' },
          { id: 'o3', text: 'Tetris' },
          { id: 'o4', text: 'Pac-Man' },
        ],
        correctAnswer: 'o1',
      },
      {
        id: 'q6',
        text: 'True or False: “Brown Box” впоследствии стала первой консолью Atari.',
        type: 'true_false',
        options: [
          { id: 'o1', text: 'Правда' },
          { id: 'o2', text: 'Ложь' },
        ],
        correctAnswer: 'o1',
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
