import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('userUpdated'));

      alert('Login successful!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to sign in right now. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-cyan-900 flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-cyan-900/40 backdrop-blur-xl">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Secure sign in</p>
          <h1 className="mt-4 text-4xl font-extrabold">Welcome Back</h1>
          <p className="mt-3 text-slate-300">Sign in to your EventHub account</p>
        </div>

        {error && (
          <div className="bg-rose-100 text-rose-900 p-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 pr-20 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-cyan-300 hover:text-cyan-100"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-3 text-lg font-bold text-white shadow-xl shadow-fuchsia-500/20 transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-300 font-bold hover:text-cyan-100">
              Sign Up
            </Link>
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-cyan-200 hover:bg-white/10 transition"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
