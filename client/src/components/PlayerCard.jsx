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
    <div className="p-5 group relative overflow-hidden flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028]/85 via-[#040816]/90 to-[#0c0818]/85 hover:border-white/25 backdrop-blur-2xl transition-all duration-300 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_25px_-5px_rgba(0,102,255,0.25),0_0_25px_-5px_rgba(255,0,85,0.2)] hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),0_0_40px_rgba(0,102,255,0.4),0_0_35px_rgba(255,0,85,0.3)] hover:-translate-y-1.5">
      {/* Top accent line (Royal Blue to Electric Gold to Scarlet Red) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0066FF] via-[#FFD700] to-[#FF0055] opacity-50 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_#FFD700]" />

      <div>
        {/* Header: Avatar + Position + Favorite */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div className="relative">
              {player.image_url ? (
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="w-13 h-13 rounded-2xl object-cover shadow-lg border border-white/15 group-hover:scale-105 transition-transform"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#FF0055] p-[1px] shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full bg-[#040816] rounded-[15px] flex items-center justify-center text-white font-black text-sm">
                    {shirtNumber || initials}
                  </div>
                </div>
              )}
              {shirtNumber && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FFD700] text-[#030712] font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_#FFD700]">
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
