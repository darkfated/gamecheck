import React, { useEffect, useRef } from 'react';

const QuizPage = () => {
  const quizContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:8080/vue-bundle.js';
    script.async = true;
    script.onload = () => {
      if (window.mountVueQuiz && quizContainerRef.current) {
        window.mountVueQuiz('vue-quiz-container');
      }
    };
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
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