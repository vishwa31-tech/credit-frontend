import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        setUser(null);
      }
    };

    updateUser();
    window.addEventListener('userUpdated', updateUser);

    return () => {
      window.removeEventListener('userUpdated', updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/');
  };

  return (
    <nav className="relative sticky top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 blur-3xl opacity-80" />
      <div className="relative border-b border-white/20 bg-slate-950/5 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 text-white rounded-2xl px-4 py-2 shadow-lg shadow-fuchsia-500/20 font-semibold uppercase tracking-wide text-xs">
              EventHub
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">The future of events, services, and jobs</h1>
              <p className="text-sm text-slate-200/80">A bold new experience for organizers, vendors, and guests.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full hover:bg-white/25 transition"
                >
                  <span className="text-lg">👤</span>
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-950 text-slate-100 shadow-2xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => {
                        navigate('/');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-white/5"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="bg-white text-slate-900 px-4 py-2 rounded-full font-semibold hover:shadow-lg transition">
                  Login
                </Link>
                <Link to="/signup" className="border border-white/30 text-white px-4 py-2 rounded-full font-semibold hover:bg-white/10 transition">
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm text-slate-100/85">
            <Link to="/" className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 transition text-center">Home</Link>
            <Link to="/events" className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 transition text-center">Events</Link>
            <Link to="/businesses" className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 transition text-center">Services</Link>
            <Link to="/jobs" className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 transition text-center">Jobs</Link>
            <Link to="/news" className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 transition text-center">News</Link>
            <div className="flex flex-wrap justify-center gap-2">
              {user?.role === 'vendor' && (
                <>
                  <Link to="/events/create" className="rounded-full bg-fuchsia-500 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-fuchsia-400 transition">+ Event</Link>
                  <Link to="/businesses/create" className="rounded-full bg-cyan-500 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-cyan-400 transition">+ Service</Link>
                  <Link to="/jobs/create" className="rounded-full bg-violet-500 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-violet-400 transition">+ Job</Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="rounded-full bg-slate-100/15 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-slate-100/25 transition">Admin</Link>
              )}
              {!user && (
                <Link to="/admin-login" className="rounded-full bg-slate-100/15 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-slate-100/25 transition">Admin Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
