import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoritePlayer } from '../redux/favoritesSlice.js';
import { formatPosition, getPositionColor } from '../utils/matchUtils.js';
import { calculateAge } from '../utils/formatters.js';

function PlayerCard({ player, maxLeagueGoals = 25, maxLeagueAssists = 15 }) {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((s) => s.ui);
  const favoritePlayerIds = useSelector((s) => s.favorites.playerIds || []);
  
  const playerId = player.player_id || player.id;
  const isFavorite = favoritePlayerIds.includes(playerId);

  const handleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoritePlayer(playerId));
  }, [dispatch, playerId]);

  const age = useMemo(() => {
    return calculateAge(player.date_of_birth || player.dateOfBirth);
  }, [player.date_of_birth, player.dateOfBirth]);

  const initials = useMemo(() => {
    const parts = (player.name || '').split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (player.name || 'FC').substring(0, 2).toUpperCase();
  }, [player.name]);

  const appearances = player.appearances !== undefined ? player.appearances : player.stats?.appearances || 0;
  const goals = player.goals !== undefined ? player.goals : player.stats?.goals || 0;
  const assists = player.assists !== undefined ? player.assists : player.stats?.assists || 0;
  const minutes = player.minutes !== undefined ? player.minutes : player.stats?.minutes || 0;
  const shirtNumber = player.shirt_number || player.shirtNumber;

  return (
    <div className="glass-card-hover p-5 group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-amber-400/50 backdrop-blur-md transition-all duration-300">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004D98] via-[#A50044] to-[#EDBB00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header: Avatar + Position + Favorite */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {player.image_url ? (
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="w-12 h-12 rounded-xl object-cover shadow-lg border border-slate-700/80 group-hover:scale-105 transition-transform"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004D98] to-[#A50044] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 text-white font-bold text-sm">
                  {shirtNumber || initials}
                </div>
              )}
              {shirtNumber && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center justify-center shadow">
                  {shirtNumber}
                </span>
              )}
            </div>

            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${getPositionColor(player.position)}`}>
              {formatPosition(player.position)}
            </span>
          </div>

          <button
            onClick={handleFavorite}
            className="p-1.5 rounded-lg transition-all duration-200 hover:bg-slate-800 text-slate-400 hover:text-rose-400 active:scale-90"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isFavorite ? 'text-rose-500 fill-current scale-110' : ''}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Player Name and Club */}
        <Link to={`/players/${playerId}`} className="block">
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-sans truncate">
            {player.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 mb-4">
          <span>{player.nationality || 'Spain'}</span>
          {age && (
            <>
              <span className="text-slate-600">•</span>
              <span>{age} yrs</span>
            </>
          )}
          {player.team_short_name && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90 font-medium truncate">{player.team_short_name}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats with Visual Bars */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        {/* Apps & Minutes */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Appearances</span>
          <span className="font-bold text-slate-200">
            {appearances} <span className="text-[11px] text-slate-400 font-normal">({minutes}')</span>
          </span>
        </div>

        {/* Goals Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400">Goals</span>
            <span className="font-bold text-amber-400">{goals}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((goals / Math.max(maxLeagueGoals, 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Assists Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400">Assists</span>
            <span className="font-bold text-blue-400">{assists}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((assists / Math.max(maxLeagueAssists, 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        <Link
          to={`/players/${playerId}`}
          className="mt-3 block text-center py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-700/80 hover:text-white rounded-lg transition-colors border border-slate-700/40"
        >
          View Profile & Career Stats →
        </Link>
      </div>
    </div>
  );
}

export default React.memo(PlayerCard);
