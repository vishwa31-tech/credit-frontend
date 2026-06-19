import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessService } from '../services/api';

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    businessService.getAll().then(res => {
      setBusinesses(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = category ? businesses.filter(b => b.category === category) : businesses;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-slate-100 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-[2rem] bg-white/90 p-10 shadow-2xl shadow-cyan-200/40 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-700 font-bold">Creative service partners</p>
          <h1 className="mt-6 text-5xl font-extrabold">Find beautiful vendors for every celebration</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">Tap into premium catering, photography, venues and décor teams that bring your vision to life.</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {['', 'catering', 'photography', 'venue', 'decoration'].map(cat => {
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
