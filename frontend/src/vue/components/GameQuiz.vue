<template>
  <div class="game-quiz-container">
    <h2 class="quiz-title">Тест на знание игр</h2>
    
    <div v-if="quizStarted && !quizFinished" class="quiz-question">
      <h3>Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}</h3>
      <div class="question-text">{{ currentQuestion.question }}</div>
      
      <div class="answers-container">
        <button 
          v-for="(answer, index) in currentQuestion.answers" 
          :key="index"
          @click="selectAnswer(index)"
          :class="['answer-button', { 'selected': selectedAnswer === index }]"
        >
          {{ answer }}
        </button>
      </div>
      
      <div class="navigation-buttons">
        <button 
          @click="nextQuestion" 
          :disabled="selectedAnswer === null"
          class="next-button"
        >
          Далее
        </button>
      </div>
    </div>
    
    <div v-else-if="quizFinished" class="quiz-results">
      <h3>Результаты теста</h3>
      <p>Вы правильно ответили на {{ correctAnswers }} из {{ questions.length }} вопросов!</p>
      <div class="result-score">
        {{ Math.round((correctAnswers / questions.length) * 100) }}%
      </div>
      <button @click="restartQuiz" class="restart-button">Пройти заново</button>
    </div>
    
    <div v-else class="quiz-start">
      <p>Проверьте свои знания о видеоиграх! Тест состоит из {{ questions.length }} вопросов.</p>
      <button @click="startQuiz" class="start-button">Начать тест</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameQuiz',
  data() {
    return {
      quizStarted: false,
      quizFinished: false,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      correctAnswers: 0,
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
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    }
  },
  methods: {
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
      
      if (this.currentQuestionIndex < this.questions.length - 1) {
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
  max-width: 600px;
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

.next-button, .start-button, .restart-button {
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

.next-button:hover, .start-button:hover, .restart-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
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

.quiz-start {
  text-align: center;
  padding: 1rem;
}

.quiz-start p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.start-button, .restart-button {
  margin-top: 1rem;
  display: inline-block;
}
</style> 