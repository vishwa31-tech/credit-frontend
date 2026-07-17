import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/businesses', label: 'Services' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/news', label: 'News' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 blur-3xl opacity-80" />
      <div className="relative border-b border-white/10 bg-slate-950/10 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 lg:gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-3 text-white shadow-lg shadow-fuchsia-500/15 transition hover:bg-white/20"
              >
                <span className="text-2xl">✨</span>
                <span className="text-lg font-semibold uppercase tracking-[0.24em]">EventHub</span>
              </Link>
              <div className="hidden sm:block">
                <p className="text-sm text-slate-200">Smart event discovery for planners, vendors, and guests.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/role-selection"
                className="hidden sm:inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-purple-500 hover:to-fuchsia-400"
              >
                Join as Partner
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 py-2 text-white hover:bg-white/15 transition lg:hidden"
              >
                <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
              </button>
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
                <div className="hidden sm:flex gap-2">
                  <Link
                    to="/login"
                    className="bg-white text-slate-900 px-4 py-2 rounded-full font-semibold hover:shadow-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="border border-white/30 text-white px-4 py-2 rounded-full font-semibold hover:bg-white/10 transition"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className={`overflow-hidden rounded-full border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-900/20 transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'} lg:max-h-full`}>
            <div className="grid gap-3 px-4 py-4 lg:grid-cols-[auto_1fr] lg:items-center lg:justify-between">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-full px-4 py-2 text-center text-sm transition ${isActive(link.to) ? 'bg-white text-slate-950 shadow-sm' : 'bg-white/10 text-slate-100 hover:bg-white/20'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                {user?.role === 'vendor' && (
                  <>
                    <Link
                      to="/events/create"
                      className="rounded-full bg-fuchsia-500 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-fuchsia-400 transition"
                    >
                      + Event
                    </Link>
                    <Link
                      to="/businesses/create"
                      className="rounded-full bg-cyan-500 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-cyan-400 transition"
                    >
                      + Service
                    </Link>
                    <Link
                      to="/jobs/create"
                      className="rounded-full bg-violet-500 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-violet-400 transition"
                    >
                      + Job
                    </Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/20 transition"
                  >
                    Admin
                  </Link>
                )}
                {!user && (
                  <Link
                    to="/admin-login"
                    className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/20 transition"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
