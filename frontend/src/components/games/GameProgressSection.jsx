import React, { useState, useEffect } from 'react';
import { GameList } from './GameList';
import ErrorBoundary from '../common/ErrorBoundary';
import ProgressErrorFallback from './ProgressErrorFallback';
import api from '../../services/api';

const GameProgressSection = ({ userId, isOwner }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.games.getUserGames(userId);
      setGames(response.data);
    } catch (err) {
      console.error('Ошибка загрузки игр:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [userId]);

  const handleRetry = () => {
    fetchGames();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-b-transparent border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary 
      componentName="Игровой прогресс" 
      fallback={<ProgressErrorFallback onRetry={handleRetry} />}
      onRetry={handleRetry}
      retryButton={true}
    >
      <GameList 
        games={games} 
        onUpdate={fetchGames} 
        editable={isOwner} 
        isOwner={isOwner} 
      />
    </ErrorBoundary>
  );
};

export default GameProgressSection;
