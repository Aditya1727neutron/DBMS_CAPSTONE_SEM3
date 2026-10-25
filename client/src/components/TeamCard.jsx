import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = ({ team }) => {
  return (
    <Link
      to={`/laliga/teams/${team.id}`}
      className="group relative flex flex-col items-center p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-amber-400/50 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="w-16 h-16 mb-3 p-2 rounded-xl bg-slate-800/50 group-hover:scale-105 transition-transform flex items-center justify-center">
        {team.crest_url ? (
          <img
            src={team.crest_url}
            alt={team.name}
            className="w-full h-full object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="font-extrabold text-lg text-slate-400">{team.tla || team.short_name?.substring(0, 3)}</span>
        )}
      </div>

      <h3 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors text-center text-sm truncate w-full">
        {team.name}
      </h3>
      <p className="text-xs text-slate-400 mt-1">{team.city}</p>

      <div className="mt-3 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[120px]">{team.stadium}</span>
        {team.founded_year && <span className="font-mono text-slate-400">Est. {team.founded_year}</span>}
      </div>
    </Link>
  );
};

export default TeamCard;
