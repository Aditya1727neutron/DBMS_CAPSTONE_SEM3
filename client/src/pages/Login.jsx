import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/authSlice.js';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleFillDemo = () => {
    setEmail('admin@fcbarcelona.cat');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-amber-200/60 shadow-xl'
      }`}>
        {/* Glow Accent Top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004D98] via-[#A50044] to-[#EDBB00]" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004D98] via-[#A50044] to-[#EDBB00] p-0.5 mx-auto mb-4 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-amber-400 font-black text-xl">FCB</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">Admin Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate to manage teams, players, fixtures, and database operations.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fcbarcelona.cat"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-rose-600 to-amber-500 hover:opacity-90 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-2 font-medium">Testing or evaluating the DBMS project?</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-400/30 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <span>⚡ Use Demo Admin Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
