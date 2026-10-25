import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode, toggleSidebar } from '../redux/uiSlice.js';
import { logout } from '../redux/authSlice.js';
import SeasonSelector from './SeasonSelector.jsx';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleDark = useCallback(() => dispatch(toggleDarkMode()), [dispatch]);
  const handleToggleSidebar = useCallback(() => dispatch(toggleSidebar()), [dispatch]);
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 navbar-blur border-b transition-all duration-300 ${darkMode
          ? 'bg-slate-950/90 border-slate-800/80'
          : 'bg-white/95 border-amber-200/60'
        } ${scrolled ? 'shadow-xl shadow-black/30' : ''}`}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            id="sidebar-toggle"
            onClick={handleToggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-800 text-slate-300 active:scale-95 transition-all"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#004D98] via-[#A50044] to-[#EDBB00] p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-[#EDBB00] font-black text-xs tracking-wider">FCB</span>
              </div>
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white leading-none font-sans group-hover:text-amber-400 transition-colors">
                FC Barcelona
              </h1>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase leading-none mt-1">
                La Liga & DBMS Hub
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Global Season Selector (Desktop) */}
        <div className="hidden md:flex items-center">
          <SeasonSelector />
        </div>

        {/* Right: Auth, Theme toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Admin ({user?.role || 'Admin'})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-400/40 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Admin Login</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            id="dark-mode-toggle"
            onClick={handleToggleDark}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default React.memo(Navbar);
