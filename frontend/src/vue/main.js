import { createApp } from 'vue';
import GameQuizComponent from './components/GameQuiz.vue';

const mountVueApp = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    const app = createApp(GameQuizComponent);
    app.mount(element);
    return app;
  }
  return null;
};

// Монтирование в отдельной среде Vue
if (document.getElementById('vue-app')) {
  mountVueApp('vue-app');
}

// Экспортируем функцию для монтирования в React приложении
window.mountVueQuiz = mountVueApp; 