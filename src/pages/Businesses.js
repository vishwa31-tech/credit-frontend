import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessService } from '../services/api';

const categories = ['', 'catering', 'photography', 'venue', 'decoration'];

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    businessService.getAll().then(res => {
      setBusinesses(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = category ? businesses.filter(b => b.category === category) : businesses;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-cyan-900 to-slate-100 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute right-6 top-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="absolute left-1/2 bottom-0 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr] items-center rounded-[3rem] border border-white/10 bg-slate-950/95 p-6 sm:p-10 shadow-2xl shadow-slate-950/40 overflow-hidden">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-cyan-500/20 px-4 py-2 text-xs uppercase tracking-[0.35em] font-semibold text-cyan-100">Service showcase</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">Discover premium event services with a modern, mobile-first experience.</h1>
              <p className="max-w-2xl text-base sm:text-lg text-slate-300">Browse trusted vendors, compare service categories, and connect with partners using a polished header layout designed for desktop and mobile.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/businesses"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-white/20 hover:bg-slate-100 transition"
                >
                  Browse Services
                </Link>
                <Link
                  to="/role-selection"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
                >
                  Join as Partner
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-white/5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-100 font-semibold">Fast discovery</p>
                <p className="mt-4 text-lg font-semibold text-white">Find the right vendor in seconds with structured browsing.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-white/5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-100 font-semibold">Trusted partners</p>
                <p className="mt-4 text-lg font-semibold text-white">Browse verified service providers across every event category.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 md:p-6">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 sm:p-10 shadow-2xl ring-1 ring-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-500 font-bold">Service browsing only</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">Explore service providers</h2>
                <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                  Customers can browse this page and view services on both mobile and desktop. If you want to register as a service partner, use the Join as Partner page to create your listing.
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="self-start rounded-full bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-900 transition"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setShowPopup(false)}
                className="rounded-full bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-300 transition"
              >
                Continue browsing
              </button>
              <a
                href="/role-selection"
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition"
              >
                Register as Partner
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map(cat => {
            const selected = category === cat;
            return (
              <button
                key={cat || 'all'}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selected ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-300/40' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
              >
                {cat ? cat : 'All'}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full rounded-[2rem] bg-white p-12 text-center shadow-xl">Loading service providers...</div>
          ) : (
            filtered.map(business => (
              <Link key={business._id} to={`/businesses/${business._id}`}>
                <div className="group overflow-hidden rounded-[2rem] bg-white shadow-2xl transition hover:-translate-y-1 hover:shadow-cyan-300/40">
                  <div className="relative h-48 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 flex items-center justify-center text-white text-5xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),_transparent_38%)]" />
                    🏢
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900">{business.name}</h3>
                    <p className="mt-3 text-slate-600 line-clamp-3">{business.description?.substring(0, 90) || 'Professional services tailored to your event.'}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1 capitalize">{business.category}</span>
                      <span className="text-yellow-500">{'⭐'.repeat(Math.round(business.rating))}</span>
                    </div>
                    <p className="mt-4 text-slate-500 text-sm">{business.city}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
