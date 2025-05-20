<template>
  <div class="game-quiz-container">
    <h2 class="quiz-title">Игровые тесты</h2>

    <!-- Test Selection UI -->
    <div v-if="!categorySelected && !quizStarted" class="category-selection">
      <h3>Выберите категорию</h3>
      <div class="categories-grid">
        <div v-for="(category, index) in categories" :key="index" @click="selectCategory(category.id)"
          class="category-card">
          <h4>{{ category.name }}</h4>
          <p>{{ category.description }}</p>
        </div>
      </div>
    </div>

    <!-- Quiz Start UI -->
    <div v-else-if="categorySelected && !quizStarted" class="quiz-start">
      <h3>{{ selectedCategory.name }}</h3>
      <p>{{ selectedCategory.description }}</p>
      <p>Тест состоит из {{ selectedCategory.questions.length }} вопросов.</p>
      <div class="start-actions">
        <button @click="startQuiz" class="start-button">Начать тест</button>
        <button @click="backToCategories" class="back-button">← Назад к категориям</button>
      </div>
    </div>

    <!-- Quiz Question UI -->
    <div v-else-if="quizStarted && !quizFinished" class="quiz-question">
      <h3>Вопрос {{ currentQuestionIndex + 1 }} из {{ currentQuestions.length }}</h3>
      <div class="question-text">{{ currentQuestion.question }}</div>

      <div class="answers-container">
        <button v-for="(answer, index) in currentQuestion.answers" :key="index" @click="selectAnswer(index)"
          :class="['answer-button', { 'selected': selectedAnswer === index }]">
          {{ answer }}
        </button>
      </div>

      <div class="navigation-buttons">
        <button @click="nextQuestion" :disabled="selectedAnswer === null" class="next-button">
          Далее
        </button>
      </div>
    </div>

    <!-- Quiz Results UI -->
    <div v-else-if="quizFinished" class="quiz-results">
      <h3>Результаты теста "{{ selectedCategory.name }}"</h3>
      <p>Вы правильно ответили на {{ correctAnswers }} из {{ currentQuestions.length }} вопросов!</p>
      <div class="result-score">
        {{ Math.round((correctAnswers / currentQuestions.length) * 100) }}%
      </div>
      <div class="results-actions">
        <button @click="restartQuiz" class="restart-button">Пройти заново</button>
        <button @click="backToCategories" class="back-button">← Другие тесты</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameQuiz',
  data() {
    return {
      categorySelected: false,
      quizStarted: false,
      quizFinished: false,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      correctAnswers: 0,
      selectedCategoryId: null,
      categories: [
        {
          id: 'general',
          name: 'Общие знания об играх',
          description: 'Проверьте свои общие знания о видеоиграх, истории и индустрии в целом.',
          questions: [
            {
              question: 'Какая игра считается первой коммерчески успешной видеоигрой?',
              answers: ['Pong', 'Space Invaders', 'Pac-Man', 'Tetris'],
              correctAnswer: 0
            },
            {
              question: 'Кто является главным героем серии The Legend of Zelda?',
              answers: ['Зельда', 'Линк', 'Ганон', 'Нави'],
              correctAnswer: 1
            },
            {
              question: 'Какая компания выпустила первую PlayStation?',
              answers: ['Microsoft', 'Nintendo', 'Sony', 'Sega'],
              correctAnswer: 2
            },
            {
              question: 'В каком году вышла игра Minecraft?',
              answers: ['2007', '2009', '2011', '2013'],
              correctAnswer: 1
            },
            {
              question: 'Какая игра НЕ принадлежит Nintendo?',
              answers: ['Super Mario Bros', 'The Last of Us', 'Animal Crossing', 'Metroid'],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 'genres',
          name: 'Жанры игр',
          description: 'Тест на знание различных игровых жанров и их особенностей.',
          questions: [
            {
              question: 'Какой из этих жанров характеризуется открытым миром и нелинейным геймплеем?',
              answers: ['Платформер', 'Файтинг', 'Песочница', 'Beat\'em up'],
              correctAnswer: 2
            },
            {
              question: 'Какой жанр лучше всего описывает игры серии Dark Souls?',
              answers: ['Action RPG', 'Шутер от первого лица', 'MMORPG', 'Стратегия в реальном времени'],
              correctAnswer: 0
            },
            {
              question: 'Что НЕ является поджанром RPG?',
              answers: ['JRPG', 'MOBA', 'Action RPG', 'Тактическая RPG'],
              correctAnswer: 1
            },
            {
              question: 'Какой жанр характеризуется управлением ресурсами и строительством баз?',
              answers: ['Экшен', 'Стратегия', 'Симулятор', 'Roguelike'],
              correctAnswer: 1
            },
            {
              question: 'К какому жанру относится игра Among Us?',
              answers: ['Battle Royale', 'Песочница', 'Симулятор свиданий', 'Социальная дедукция'],
              correctAnswer: 3
            }
          ]
        },
        {
          id: 'minecraft',
          name: 'Minecraft',
          description: 'Вопросы об одной из самых популярных игр всех времен — Minecraft.',
          questions: [
            {
              question: 'Кто создал игру Minecraft?',
              answers: ['Тодд Говард', 'Маркус Перссон (Notch)', 'Хидэо Кодзима', 'Сигэру Миямото'],
              correctAnswer: 1
            },
            {
              question: 'В каком году Microsoft приобрела Minecraft?',
              answers: ['2010', '2012', '2014', '2016'],
              correctAnswer: 2
            },
            {
              question: 'Что НЕ является биомом в Minecraft?',
              answers: ['Тайга', 'Пустыня', 'Джунгли', 'Тундра'],
              correctAnswer: 3
            },
            {
              question: 'Какой материал нужен для создания портала в Нижний мир (Nether)?',
              answers: ['Алмазы', 'Обсидиан', 'Незерит', 'Красный камень'],
              correctAnswer: 1
            },
            {
              question: 'Как называется финальный босс в Minecraft?',
              answers: ['Визер', 'Дракон Края', 'Древний Страж', 'Голем Края'],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 'fortnite',
          name: 'Fortnite',
          description: 'Проверьте свои знания о популярной игре Fortnite от Epic Games.',
          questions: [
            {
              question: 'В каком году вышла игра Fortnite?',
              answers: ['2015', '2016', '2017', '2018'],
              correctAnswer: 2
            },
            {
              question: 'Какой режим сделал Fortnite популярным?',
              answers: ['Save the World', 'Battle Royale', 'Creative', 'Zero Build'],
              correctAnswer: 1
            },
            {
              question: 'Сколько игроков участвует в стандартном матче Battle Royale?',
              answers: ['50', '100', '150', '200'],
              correctAnswer: 1
            },
            {
              question: 'Что НЕ является игровой механикой Fortnite?',
              answers: ['Строительство', 'Сбор ресурсов', 'Прокачка персонажа', 'Крафтинг оружия'],
              correctAnswer: 3
            },
            {
              question: 'Как часто обновляется сезон в Fortnite?',
              answers: ['Каждый месяц', 'Каждые 2 месяца', 'Каждые 3 месяца', 'Каждые 6 месяцев'],
              correctAnswer: 2
            }
          ]
        },
        {
          id: 'rpg',
          name: 'RPG игры',
          description: 'Вопросы о ролевых играх, их истории и особенностях.',
          questions: [
            {
              question: 'Какая серия игр считается пионером JRPG?',
              answers: ['Dragon Quest', 'Final Fantasy', 'Pokémon', 'Chrono Trigger'],
              correctAnswer: 0
            },
            {
              question: 'Какая студия разработала серию игр The Elder Scrolls?',
              answers: ['BioWare', 'Bethesda Game Studios', 'CD Projekt Red', 'Obsidian Entertainment'],
              correctAnswer: 1
            },
            {
              question: 'Какая из этих игр относится к жанру ARPG (Action RPG)?',
              answers: ['Baldur\'s Gate', 'Diablo', 'Civilization', 'SimCity'],
              correctAnswer: 1
            },
            {
              question: 'Какая система характерна для большинства RPG?',
              answers: ['Система достижений', 'Система набора очков опыта', 'Система многопользовательской игры', 'Система быстрого сохранения'],
              correctAnswer: 1
            },
            {
              question: 'Кто является главным антагонистом в игре The Witcher 3: Wild Hunt?',
              answers: ['Эредин', 'Детлафф', 'Радовид', 'Лето из Гулеты'],
              correctAnswer: 0
            }
          ]
        }
      ]
    };
  },
  computed: {
    selectedCategory() {
      return this.categories.find(cat => cat.id === this.selectedCategoryId) || {};
    },
    currentQuestions() {
      return this.selectedCategory.questions || [];
    },
    currentQuestion() {
      return this.currentQuestions[this.currentQuestionIndex] || {};
    }
  },
  methods: {
    selectCategory(categoryId) {
      this.selectedCategoryId = categoryId;
      this.categorySelected = true;
    },
    backToCategories() {
      this.categorySelected = false;
      this.quizStarted = false;
      this.quizFinished = false;
    },
    startQuiz() {
      this.quizStarted = true;
      this.quizFinished = false;
      this.currentQuestionIndex = 0;
      this.correctAnswers = 0;
      this.selectedAnswer = null;
    },
    selectAnswer(index) {
      this.selectedAnswer = index;
    },
    nextQuestion() {
      if (this.selectedAnswer === this.currentQuestion.correctAnswer) {
        this.correctAnswers++;
      }

      if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
      } else {
        this.finishQuiz();
      }
    },
    finishQuiz() {
      this.quizFinished = true;
    },
    restartQuiz() {
      this.startQuiz();
    }
  }
};
</script>

<style>
.game-quiz-container {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.quiz-title {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #6366f1, #a855f7, #d946ef);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}


.category-selection h3 {
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
}

.category-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.2rem;
  transition: all 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

.category-card h4 {
  color: var(--text-primary);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.category-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}


.quiz-start {
  text-align: center;
  padding: 1rem;
}

.quiz-start h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.quiz-start p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.start-actions,
.results-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.5rem;
}


.quiz-question h3 {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.question-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.4;
}

.answers-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.answer-button {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: left;
  transition: all 0.2s;
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
}

.answer-button:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
}

.answer-button.selected {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border-color: #6366f1;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2);
}

.navigation-buttons {
  display: flex;
  justify-content: flex-end;
}


.next-button,
.start-button,
.restart-button {
  background: linear-gradient(90deg, #6366f1, #a855f7, #d946ef);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.back-button {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.next-button:hover,
.start-button:hover,
.restart-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
}

.back-button:hover {
  background: rgba(99, 102, 241, 0.05);
  border-color: rgba(99, 102, 241, 0.3);
  color: var(--text-primary);
}

.next-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}


.quiz-results {
  text-align: center;
  padding: 1rem;
}

.quiz-results h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.result-score {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 1.5rem 0;
  background: linear-gradient(90deg, #6366f1, #a855f7, #d946ef);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}


@media (min-width: 640px) {

  .start-actions,
  .results-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
