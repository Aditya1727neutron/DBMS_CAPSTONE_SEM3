import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import { teamService } from '../services/teamService.js';
import { matchService } from '../services/matchService.js';
import { formatGoalDifference, formatPercentage } from '../utils/formatters.js';
import SeasonSelector from '../components/SeasonSelector.jsx';
import MatchCard from '../components/MatchCard.jsx';
import ChartComponent from '../components/ChartComponent.jsx';
import HomeAwayChart from '../components/charts/HomeAwayChart.jsx';
import PointsProgressChart from '../components/charts/PointsProgressChart.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Loader from '../components/Loader.jsx';
import CoverageBadge from '../components/CoverageBadge.jsx';

function Dashboard() {
  const { selectedSeasonId, selectedSeason } = useSelectedSeason();
  const [seasonSummary, setSeasonSummary] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Barça (team ID 1) season summary
      const summaryData = await teamService.getTeamSeasonSummary(1, selectedSeasonId);
      setSeasonSummary(summaryData);

      // 2. Fetch matches for season
      const matchesData = await matchService.getMatches({
        seasonId: selectedSeasonId,
        teamId: 1,
        limit: 38,
      });
      setMatches(matchesData.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedSeasonId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading && !seasonSummary) {
    return <Loader message={`Loading FC Barcelona season ${selectedSeason?.label || ''}...`} size="large" />;
  }

  const standings = seasonSummary?.standings;
  const summary = seasonSummary?.summary;
  const recentForm = seasonSummary?.recentForm || [];
  const nextMatch = seasonSummary?.nextMatch;
  const topPerformers = seasonSummary?.topScorers || [];

  const finishedMatches = matches.filter((m) => m.status?.toLowerCase() === 'finished');
  const recentFinishedMatches = [...finishedMatches].slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Camp Nou Dashboard
            </h1>
            {selectedSeason && <CoverageBadge coverage={selectedSeason.coverage} />}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time match metrics, relational SQL analytics, and official records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SeasonSelector />
          <button
            onClick={loadDashboardData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-amber-400/40 transition-colors"
            title="Refresh from MySQL database"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && <ErrorBanner error={error} onRetry={loadDashboardData} />}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* League Standing */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-400">La Liga Standing</span>
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-black text-sm">
              #{standings?.position || '—'}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-sans">
            {standings?.points ?? 0} <span className="text-xs font-medium text-slate-400">PTS</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>{standings?.played ?? 0} played</span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">{standings?.won ?? 0} wins</span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden group hover:border-emerald-400/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-400">Win Rate</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              %
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans">
            {formatPercentage(standings?.won, standings?.played)}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400">{standings?.won ?? 0}W</span>
            <span>{standings?.drawn ?? 0}D</span>
            <span className="text-rose-400">{standings?.lost ?? 0}L</span>
          </div>
        </div>

        {/* Goals Scored & Conceded */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden group hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-400">Goals (GF / GA)</span>
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
              ⚽
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-sans">
            {standings?.gf ?? 0} <span className="text-slate-600 font-light">/</span> {standings?.ga ?? 0}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Avg {(Number(standings?.gf || 0) / Math.max(Number(standings?.played || 1), 1)).toFixed(2)} goals / match
          </p>
        </div>

        {/* Goal Difference (Fixed sign bug: +GD or -GD) */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-400">Goal Difference</span>
            <span className="w-8 h-8 rounded-lg bg-[#A50044]/20 text-rose-300 flex items-center justify-center font-bold text-xs">
              GD
            </span>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-black font-sans ${
              Number(standings?.gd || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatGoalDifference(standings?.gd)}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Clean Sheets: <span className="text-amber-400 font-bold">{summary?.clean_sheets || 0}</span>
          </p>
        </div>
      </div>

      {/* Next Match & Form Guide Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Scheduled Fixture */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#004D98]/20 via-slate-900/90 to-[#A50044]/20 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Next Official Fixture
              </span>
              <span className="text-xs text-slate-400 font-mono">Matchday {nextMatch?.matchday || '—'}</span>
            </div>

            {nextMatch ? (
              <div className="flex items-center justify-around py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 p-2 bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-2">
                    {nextMatch.home_crest ? (
                      <img src={nextMatch.home_crest} alt={nextMatch.home_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-bold text-sm text-slate-200">{nextMatch.home_name?.substring(0, 3)}</span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-white">{nextMatch.home_name}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-500">VS</span>
                  <span className="text-xs text-amber-400 font-semibold mt-1">{nextMatch.venue || 'Estadi Olímpic'}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">{nextMatch.kickoff_utc || 'Upcoming'}</span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 p-2 bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-2">
                    {nextMatch.away_crest ? (
                      <img src={nextMatch.away_crest} alt={nextMatch.away_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-bold text-sm text-slate-200">{nextMatch.away_name?.substring(0, 3)}</span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-white">{nextMatch.away_name}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                No further scheduled fixtures for this campaign period.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Official La Liga EA Sports Calendar</span>
            <Link to="/matches" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
              Full Schedule & Fixtures →
            </Link>
          </div>
        </div>

        {/* Recent Form Tracker */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Recent League Form
            </h3>

            <div className="flex items-center justify-between gap-2 my-4">
              {recentForm.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-lg ${
                      item.result === 'W'
                        ? 'bg-emerald-500 text-white'
                        : item.result === 'D'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.result}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[48px]">
                    {item.home_name === 'Barcelona' ? `@${item.away_name}` : `vs ${item.home_name}`}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">
                    {item.home_score}-{item.away_score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Last 5 Matches Played</span>
            <Link to="/analytics" className="text-blue-400 hover:underline font-semibold">
              Deep Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Match Cards Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A50044]" />
            Recent Match Outings
          </h2>
          <Link to="/matches" className="text-xs font-semibold text-amber-400 hover:underline">
            View All ({matches.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentFinishedMatches.map((m) => (
            <MatchCard key={m.id} match={m} focusTeamId={1} />
          ))}
        </div>
      </div>

      {/* Interactive Charts Component */}
      <ChartComponent
        stats={{
          wins: standings?.won,
          draws: standings?.drawn,
          losses: standings?.lost,
        }}
        players={topPerformers}
        matches={finishedMatches}
        focusTeamId={1}
      />

      {/* Additional Historical and Venue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Home vs Away Performance Split
          </h3>
          <HomeAwayChart summary={summary} />
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Points Progression Across Matchdays
          </h3>
          <PointsProgressChart matches={finishedMatches} focusTeamId={1} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
