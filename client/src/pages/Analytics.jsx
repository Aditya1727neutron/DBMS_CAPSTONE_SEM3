import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { analyticsService } from '../services/analyticsService.js';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import DataTable from '../components/DataTable.jsx';
import ChartComponent from '../components/ChartComponent.jsx';
import PointsProgressChart from '../components/charts/PointsProgressChart.jsx';
import HomeAwayChart from '../components/charts/HomeAwayChart.jsx';

function Analytics() {
  const { selectedSeason } = useSelectedSeason();
  const { darkMode } = useSelector((state) => state.ui);
  const seasonId = selectedSeason?.season_id || 1;

  const [tab, setTab] = useState('scorers');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [discipline, setDiscipline] = useState([]);
  const [minutes, setMinutes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchAnalyticsData() {
      setLoading(true);
      setError(null);
      try {
        const [scorersRes, assistsRes, disciplineRes, minutesRes] = await Promise.all([
          analyticsService.getTopScorers(seasonId, 25).catch(() => []),
          analyticsService.getTopAssists(seasonId, 25).catch(() => []),
          analyticsService.getCards(seasonId, 25).catch(() => []),
          analyticsService.getMinutes(seasonId, 25).catch(() => []),
        ]);

        if (isMounted) {
          setTopScorers(scorersRes);
          setTopAssists(assistsRes);
          setDiscipline(disciplineRes);
          setMinutes(minutesRes);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch advanced analytics data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAnalyticsData();

    return () => {
      isMounted = false;
    };
  }, [seasonId]);

  const scorerColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{row.known_as || row.full_name || val}</span>
          <span className="text-xs text-slate-400">{row.team_name || row.club_name || 'FC Barcelona'}</span>
        </div>
      ),
    },
    { key: 'goals', label: 'Goals ⚽', render: (v) => <span className="font-extrabold text-amber-400 text-base">{v}</span> },
    { key: 'penalty_goals', label: 'Penalties', render: (v) => v || 0 },
    { key: 'matches_played', label: 'Matches', render: (v) => v || 0 },
    {
      key: 'mins_per_goal',
      label: 'Mins / Goal',
      render: (v) => v ? `${Math.round(v)}'` : '-',
    },
  ];

  const assistColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{row.known_as || row.full_name || val}</span>
          <span className="text-xs text-slate-400">{row.team_name || row.club_name || 'FC Barcelona'}</span>
        </div>
      ),
    },
    { key: 'assists', label: 'Assists 👟', render: (v) => <span className="font-extrabold text-blue-400 text-base">{v}</span> },
    { key: 'goals', label: 'Goals', render: (v) => v || 0 },
    { key: 'matches_played', label: 'Matches', render: (v) => v || 0 },
  ];

  const disciplineColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{row.known_as || row.full_name || val}</span>
          <span className="text-xs text-slate-400">{row.team_name || row.club_name || 'FC Barcelona'}</span>
        </div>
      ),
    },
    { key: 'yellow_cards', label: 'Yellow 🟨', render: (v) => <span className="font-bold text-amber-300">{v || 0}</span> },
    { key: 'red_cards', label: 'Red 🟥', render: (v) => <span className="font-bold text-rose-500">{v || 0}</span> },
    { key: 'total_cards', label: 'Total Cards', render: (v, r) => (r.yellow_cards || 0) + (r.red_cards || 0) * 2 },
  ];

  const minutesColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{row.known_as || row.full_name || val}</span>
          <span className="text-xs text-slate-400">{row.position || 'Player'}</span>
        </div>
      ),
    },
    { key: 'total_minutes', label: 'Minutes Played ⏱️', render: (v) => <span className="font-bold text-emerald-400">{Number(v).toLocaleString()} min</span> },
    { key: 'matches_played', label: 'Appearances', render: (v) => v || 0 },
    { key: 'starts', label: 'Starts', render: (v) => v || 0 },
  ];

  // Chart data for top 8 scorers
  const scorersChartData = {
    labels: topScorers.slice(0, 8).map((p) => p.known_as || p.full_name || p.player_name || 'Player'),
    datasets: [
      {
        label: 'Goals',
        data: topScorers.slice(0, 8).map((p) => p.goals || 0),
        backgroundColor: 'rgba(237, 187, 0, 0.85)',
        borderColor: '#EDBB00',
        borderRadius: 8,
      },
      {
        label: 'Assists',
        data: topScorers.slice(0, 8).map((p) => p.assists || 0),
        backgroundColor: 'rgba(0, 77, 152, 0.75)',
        borderColor: '#004D98',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="page-container py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                SQL Window Functions & Aggregations
              </span>
              <span className="text-xs text-slate-400">
                Season: {selectedSeason?.season_label || '2023-24'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              DBMS La Liga Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Deep player and club metrics powered by relational queries, composite indexes, and aggregated views.
            </p>
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader text="Executing SQL analytics queries..." />
      ) : (
        <div className="space-y-8">
          {/* Top Visual Chart: Top 8 Goal & Assist Contributors */}
          {topScorers.length > 0 && (
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-amber-200/60 shadow-lg'}`}>
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Goal & Assist Contribution Leaders ({selectedSeason?.season_label})
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Comparative attacking output evaluated across all tracked appearances.
              </p>
              <div className="h-72">
                <ChartComponent type="bar" data={scorersChartData} />
              </div>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'scorers', label: 'Top Scorers ⚽', count: topScorers.length },
              { id: 'assists', label: 'Top Assists 👟', count: topAssists.length },
              { id: 'discipline', label: 'Discipline 🟨🟥', count: discipline.length },
              { id: 'minutes', label: 'Minutes & Endurance ⏱️', count: minutes.length },
              { id: 'trends', label: 'Team Progress Trends 📈' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-lg shadow-rose-900/30'
                    : darkMode
                      ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      : 'bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Views */}
          {tab === 'scorers' && (
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Pichichi Trophy Race</h3>
                <p className="text-xs text-slate-400">Total league goals scored, penalties converted, and scoring efficiency.</p>
              </div>
              <DataTable columns={scorerColumns} data={topScorers} />
            </div>
          )}

          {tab === 'assists' && (
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Playmaker Leaderboard</h3>
                <p className="text-xs text-slate-400">Top assist providers creating scoring chances for their teammates.</p>
              </div>
              <DataTable columns={assistColumns} data={topAssists} />
            </div>
          )}

          {tab === 'discipline' && (
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Fair Play & Disciplinary Records</h3>
                <p className="text-xs text-slate-400">Yellow and red card counts recorded by match officials.</p>
              </div>
              <DataTable columns={disciplineColumns} data={discipline} />
            </div>
          )}

          {tab === 'minutes' && (
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Squad Workhorses</h3>
                <p className="text-xs text-slate-400">Total playing time registered on the pitch throughout the campaign.</p>
              </div>
              <DataTable columns={minutesColumns} data={minutes} />
            </div>
          )}

          {tab === 'trends' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-base font-bold text-white mb-2">Points Progression Over Matchdays</h3>
                <p className="text-xs text-slate-400 mb-6">Cumulative league points curve across all completed fixtures.</p>
                <div className="h-64">
                  <PointsProgressChart seasonId={seasonId} />
                </div>
              </div>
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-base font-bold text-white mb-2">Home vs Away Venue Splits</h3>
                <p className="text-xs text-slate-400 mb-6">Points, goal output, and defensive stability segmented by stadium.</p>
                <div className="h-64">
                  <HomeAwayChart seasonId={seasonId} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
