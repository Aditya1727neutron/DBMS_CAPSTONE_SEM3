import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteMatch } from '../redux/favoritesSlice.js';
import { formatMatchDate, formatMatchTime, getMatchResult, getResultBadgeClass } from '../utils/matchUtils.js';

function MatchCard({ match, focusTeamId = 1 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useSelector((s) => s.ui);
  const favoriteMatchIds = useSelector((s) => s.favorites.matchIds || []);

  const isFavorite = favoriteMatchIds.includes(match.id);
  const isFinished = match.status?.toLowerCase() === 'finished';

  const homeId = match.home_team_id || match.homeTeam?.id;
  const awayId = match.away_team_id || match.awayTeam?.id;
  const isFocusHome = homeId === focusTeamId;
  const isFocusAway = awayId === focusTeamId;
  const isFocusParticipant = isFocusHome || isFocusAway;

  const result = useMemo(() => {
    return isFocusParticipant ? getMatchResult(match, focusTeamId) : null;
  }, [match, focusTeamId, isFocusParticipant]);

  const homeScore = match.home_score !== undefined ? match.home_score : match.score?.fullTime?.home;
  const awayScore = match.away_score !== undefined ? match.away_score : match.score?.fullTime?.away;

  const homeName = match.home_short_name || match.home_name || match.homeTeam?.shortName || match.homeTeam?.name || 'Home';
  const awayName = match.away_short_name || match.away_name || match.awayTeam?.shortName || match.awayTeam?.name || 'Away';
  const homeCrest = match.home_crest || match.homeTeam?.crest;
  const awayCrest = match.away_crest || match.awayTeam?.crest;

  const handleClick = useCallback(() => {
    navigate(`/matches/${match.id}`);
  }, [navigate, match.id]);

  const handleFavorite = useCallback((e) => {
    e.stopPropagation();
    dispatch(toggleFavoriteMatch(match.id));
  }, [dispatch, match.id]);

  const dateStr = match.kickoff_utc || match.utcDate;

  return (
    <div
      onClick={handleClick}
      className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-amber-400/50 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden cursor-pointer"
    >
      {/* Top Accent Gradient on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004D98] via-[#A50044] to-[#EDBB00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Row: Matchday & Favorite */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20">
          Matchday {match.matchday || '—'}
        </span>

        <button
          onClick={handleFavorite}
          className="p-1.5 rounded-lg transition-colors hover:bg-slate-800 text-slate-400 hover:text-rose-400"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-4 h-4 transition-transform ${isFavorite ? 'text-rose-500 fill-current scale-110' : ''}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Match Teams and Score */}
      <div className="flex items-center justify-between gap-3 my-2">
        {/* Home Club */}
        <div className={`flex-1 flex flex-col items-center text-center ${isFocusHome ? 'font-bold' : 'opacity-85'}`}>
          <div className="w-12 h-12 mb-2 p-1.5 rounded-xl bg-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            {homeCrest ? (
              <img src={homeCrest} alt={homeName} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-xs font-bold text-slate-300">{(homeName).substring(0, 3).toUpperCase()}</span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{homeName}</p>
          {isFocusHome && (
            <span className="text-[9px] font-bold tracking-wider text-amber-400 mt-0.5">BARÇA</span>
          )}
        </div>

        {/* Score / Status */}
        <div className="flex flex-col items-center px-2 shrink-0">
          {isFinished ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white font-sans">{homeScore ?? 0}</span>
                <span className="text-slate-500 font-light">–</span>
                <span className="text-2xl font-black text-white font-sans">{awayScore ?? 0}</span>
              </div>
              {result && (
                <span className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${getResultBadgeClass(result)}`}>
                  {result}
                </span>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-slate-400">{formatMatchTime(dateStr) || 'TBD'}</span>
              <span className="text-[10px] font-bold mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                UPCOMING
              </span>
            </div>
          )}
        </div>

        {/* Away Club */}
        <div className={`flex-1 flex flex-col items-center text-center ${isFocusAway ? 'font-bold' : 'opacity-85'}`}>
          <div className="w-12 h-12 mb-2 p-1.5 rounded-xl bg-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            {awayCrest ? (
              <img src={awayCrest} alt={awayName} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-xs font-bold text-slate-300">{(awayName).substring(0, 3).toUpperCase()}</span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{awayName}</p>
          {isFocusAway && (
            <span className="text-[9px] font-bold tracking-wider text-amber-400 mt-0.5">BARÇA</span>
          )}
        </div>
      </div>

      {/* Date & Venue Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>{formatMatchDate(dateStr)}</span>
        <span className="truncate max-w-[110px] text-right">{match.venue || 'La Liga'}</span>
      </div>
    </div>
  );
}

export default React.memo(MatchCard);
