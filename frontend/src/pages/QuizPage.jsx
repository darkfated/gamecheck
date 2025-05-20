import React, { useEffect, useRef } from 'react';

const QuizPage = () => {
  const quizContainerRef = useRef(null);

  useEffect(() => {
    // Загружаем Vue bundle скрипт
    const script = document.createElement('script');
    script.src = 'http://localhost:8080/vue-bundle.js';
    script.async = true;
    script.onload = () => {
      if (window.mountVueQuiz && quizContainerRef.current) {
        // Монтируем Vue компонент на странице React
        window.mountVueQuiz('vue-quiz-container');
      }
    };
    
    document.body.appendChild(script);

    return () => {
      // Удаляем скрипт при размонтировании компонента
      document.body.removeChild(script);
      // Можно также добавить очистку Vue приложения здесь, если это необходимо
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-[var(--text-primary)]">
        Игровые тесты
      </h1>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <div 
            id="vue-quiz-container" 
            ref={quizContainerRef}
            className="bg-[var(--bg-secondary)] rounded-xl shadow-lg overflow-hidden"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 