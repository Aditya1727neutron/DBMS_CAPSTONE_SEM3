import React from 'react';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import CoverageBadge from './CoverageBadge.jsx';

const SeasonSelector = ({ className = '', showBadge = true }) => {
  const { selectedSeasonId, selectedSeason, seasonsList, changeSeason } = useSelectedSeason();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <select
          id="season-selector-dropdown"
          value={selectedSeasonId}
          onChange={(e) => changeSeason(Number(e.target.value))}
          className="appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/50 text-slate-100 text-sm font-semibold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer transition-colors shadow-sm"
        >
          {seasonsList.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
              Season {s.label} {s.status === 'current' ? '(Current)' : ''}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {showBadge && selectedSeason && (
        <CoverageBadge coverage={selectedSeason.coverage} size="sm" />
      )}
    </div>
  );
};

export default SeasonSelector;
