import React, { useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { GAME_STATUS_CONFIG } from "../../constants"

export const GameStats = ({ games = [], statusOptions }) => {
  const canvasRef = useRef(null);
  
  const stats = useMemo(() => {
    if (!Array.isArray(games) || games.length === 0) {
      return {
        total: 0,
        byStatus: statusOptions.reduce((acc, status) => {
          acc[status.value] = 0;
          return acc;
        }, {}),
        avgRating: 0,
        ratingCount: 0,
      };
    }

    const byStatus = games.reduce((acc, game) => {
      acc[game.status] = (acc[game.status] || 0) + 1;
      return acc;
    }, {});

    const gamesWithRating = games.filter(game => game.rating !== null && game.rating !== undefined);
    const sumRatings = gamesWithRating.reduce((sum, game) => sum + game.rating, 0);
    const avgRating = gamesWithRating.length ? (sumRatings / gamesWithRating.length).toFixed(1) : 0;

    return {
      total: games.length,
      byStatus,
      avgRating,
      ratingCount: gamesWithRating.length,
    };
  }, [games, statusOptions]);

  // Функция для отрисовки круговой диаграммы
  useEffect(() => {
    if (!canvasRef.current || stats.total === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Очистка канваса
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let startAngle = 0;
    let total = 0;
    
    // Считаем общее количество для процентного соотношения
    statusOptions.forEach(status => {
      total += stats.byStatus[status.value] || 0;
    });
    
    if (total === 0) return;
    
    // Рисуем секторы
    statusOptions.forEach(status => {
      const value = stats.byStatus[status.value] || 0;
      if (value === 0) return;
      
      const sliceAngle = 2 * Math.PI * value / total;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      // Получаем цвет из конфигурации статуса
      let color;
      switch(status.value) {
        case 'playing':
          color = '#10b981'; // emerald-500
          break;
        case 'completed':
          color = '#3b82f6'; // blue-500
          break;
        case 'plan_to_play':
          color = '#8b5cf6'; // purple-500
          break;
        case 'dropped':
          color = '#ef4444'; // red-500
          break;
        default:
          color = '#6b7280'; // gray-500
      }
      
      ctx.fillStyle = color;
      ctx.fill();
      
      startAngle += sliceAngle;
    });
    
    // Рисуем белый круг в центре для создания эффекта пончика
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = 'var(--card-bg)';
    ctx.fill();
    
    // Добавляем текст в центр
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = 'var(--text-primary)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stats.total.toString(), centerX, centerY - 10);
    
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.fillText('игр', centerX, centerY + 10);
    
  }, [stats, statusOptions, canvasRef]);
  
  if (stats.total === 0) {
    return (
      <div className="mt-6 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] shadow-md">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Статистика игр</h3>
        <p className="text-[var(--text-secondary)] italic text-center py-4">
          Нет данных для отображения статистики.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Статистика игр</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Диаграмма */}
        <div className="md:col-span-1 flex justify-center items-center">
          <canvas 
            ref={canvasRef} 
            width="200" 
            height="200" 
            className="max-w-full"
          ></canvas>
        </div>
        
        {/* Статистика по статусам */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-4">По статусам</h4>
              <div className="space-y-3">
                {statusOptions.map(status => {
                  const count = stats.byStatus[status.value] || 0;
                  const percentage = stats.total ? Math.round(count / stats.total * 100) : 0;
                  
                  return (
                    <div key={status.value}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status.value)}`}></div>
                          <span className="text-sm text-[var(--text-primary)]">{status.label}</span>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`${getProgressColor(status.value)} h-2 rounded-full`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Общая статистика */}
            <div>
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-4">Общая статистика</h4>
              <div className="bg-gradient-to-br from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-primary)]">Всего игр</span>
                  <span className="text-lg font-semibold text-[var(--accent-primary)]">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-primary)]">Средняя оценка</span>
                  <span className="text-lg font-semibold text-[var(--accent-primary)]">
                    {stats.avgRating > 0 ? (
                      <span className="flex items-center">
                        {stats.avgRating}
                        <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-primary)]">Оценено игр</span>
                  <span className="text-lg font-semibold text-[var(--accent-primary)]">{stats.ratingCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-primary)]">Процент оцененных</span>
                  <span className="text-lg font-semibold text-[var(--accent-primary)]">
                    {stats.total > 0 ? `${Math.round((stats.ratingCount / stats.total) * 100)}%` : "0%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getStatusColor(status) {
  switch (status) {
    case 'playing':
      return 'bg-green-500';
    case 'completed':
      return 'bg-blue-500';
    case 'plan_to_play':
      return 'bg-purple-500';
    case 'dropped':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

function getProgressColor(status) {
  switch (status) {
    case 'playing':
      return 'bg-green-500';
    case 'completed':
      return 'bg-blue-500';
    case 'plan_to_play':
      return 'bg-purple-500';
    case 'dropped':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
