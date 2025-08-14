import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Race } from '../api/client';
import { mockRaces } from '../mocks/mockLeaderboardData';
import RaceCard from '../components/race/RaceCard';
import { useLanguage } from '../contexts/LanguageContext';

const RacesPage: React.FC = () => {
  const { t } = useLanguage();
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  const { data: allRaces, isLoading: isLoadingAll } = useQuery<Race[]>({
    queryKey: ['races', 'all'],
    queryFn: () => {
      if (import.meta.env.DEV) {
        // Use mock data in development
        return Promise.resolve(mockRaces);
      }
      return api.getCurrentSeasonRaces();
    },
  });
  
  const { data: nextRace, isLoading: isLoadingNext } = useQuery<Race>({
    queryKey: ['races', 'next'],
    queryFn: () => {
      if (import.meta.env.DEV) {
        // Use mock data in development - find the next upcoming race
        const today = new Date();
        const upcomingRace = mockRaces.find(race => new Date(race.date) > today);
        if (upcomingRace) {
          return Promise.resolve(upcomingRace);
        }
      }
      return api.getNextRace();
    },
  });
  
  if (isLoadingAll || isLoadingNext) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">{t('races.title')}</h1>
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="card h-48">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!allRaces) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">{t('races.noRacesFound')}</h1>
        <p>{t('races.errorLoading')}</p>
      </div>
    );
  }
  
  const today = new Date();
  const upcomingRaces = allRaces.filter(race => new Date(race.date) >= today);
  const pastRaces = allRaces.filter(race => new Date(race.date) < today);
  
  const racesToShow = showUpcoming ? upcomingRaces : pastRaces;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('races.calendar')}</h1>
      
      <div className="mb-8 flex gap-4">
        <button
          className={`btn ${showUpcoming ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowUpcoming(true)}
        >
          {t('races.upcomingRaces')}
        </button>
        <button
          className={`btn ${!showUpcoming ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowUpcoming(false)}
        >
          {t('races.pastRaces')}
        </button>
      </div>
      
      {racesToShow.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-xl">
            {showUpcoming ? t('races.noUpcomingScheduled') : t('races.noPastRaces')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {racesToShow.map(race => (
            <RaceCard
              key={race.id}
              race={race}
              isNext={nextRace && race.id === nextRace.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RacesPage; 