import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';

const categories = ['', 'wedding', 'festival', 'party', 'concert'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getAll().then(res => {
      setEvents(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = category ? events.filter(e => e.category === category) : events;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-100 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute left-1/2 top-48 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-fuchsia-700 via-purple-800 to-indigo-700 p-10 shadow-2xl shadow-purple-900/30 text-white">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Live events & immersive experiences</p>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight">Discover the most exciting events near you</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-100/80">Filter by the event type you love and open doors to unforgettable celebrations, shows, and festivals.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {categories.map(cat => {
            const selected = category === cat;
            return (
              <button
                key={cat || 'all'}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selected ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-400/30' : 'bg-white/90 text-slate-900 hover:bg-white'}`}
              >
                {cat ? cat : 'All'}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full rounded-[2rem] bg-white/90 p-12 text-center text-slate-700 shadow-xl">Loading exciting events...</div>
          ) : (
            filtered.map(event => (
              <Link key={event._id} to={`/events/${event._id}`}>
                <div className="group overflow-hidden rounded-[2rem] bg-white shadow-2xl transition hover:-translate-y-1 hover:shadow-fuchsia-300/40">
                  <div className="relative h-48 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_40%)]" />
                    {event.category.charAt(0).toUpperCase()}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-fuchsia-100 text-fuchsia-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">{event.category}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-slate-900">{event.title}</h3>
                    <p className="mt-3 text-slate-600 line-clamp-3">{event.description.substring(0, 90)}...</p>
                    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-purple-700 font-semibold">${event.price}</span>
                    </div>
                    <div className="mt-3 text-sm text-slate-500">{event.location.city}, {event.location.state}</div>
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
