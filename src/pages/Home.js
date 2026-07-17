import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';

const quickTiles = [
  { title: 'Events', to: '/events', icon: '🎉' },
  { title: 'Services', to: '/businesses', icon: '🛎️' },
  { title: 'Jobs', to: '/jobs', icon: '💼' },
  { title: 'News', to: '/news', icon: '📰' },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getAll().then(res => {
      setEvents(res.data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden bg-slate-950 text-white">
      <section className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,165,0,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_20%),linear-gradient(180deg,_#050505_0%,_#111827_55%,_#0f172a_100%)] overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-orange-200 shadow-lg shadow-orange-500/10">
                Unlock the biggest events & services
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white">Experience events that feel electric, creative, and unforgettable.</h1>
              <p className="max-w-2xl text-lg text-slate-300/85">EventHub brings together stunning events, premium vendors, fast job opportunities, and trending news in one memorable platform.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/events" className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-lg font-bold text-slate-950 shadow-2xl shadow-orange-500/25 hover:scale-[1.01] transition">
                  Explore Events
                </Link>
                <Link to="/businesses" className="inline-flex items-center justify-center rounded-full border border-orange-300/60 bg-white/10 px-8 py-3 text-lg font-semibold text-white hover:bg-white/15 transition">
                  Find Services
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-4 text-white">Spotlight Events</h2>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-orange-600/20">
                    <p className="text-sm uppercase tracking-[0.24em] text-orange-300">Magic of Moments</p>
                    <h3 className="text-3xl font-bold mt-3 text-white">Create the event people remember.</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-white/5 p-5 shadow-lg shadow-orange-500/10">
                      <p className="text-sm uppercase tracking-[0.18em] text-orange-200">Top Vendors</p>
                      <p className="mt-3 text-xl font-semibold text-white">Catering, decor & artists</p>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-5 shadow-lg shadow-orange-500/10">
                      <p className="text-sm uppercase tracking-[0.18em] text-orange-200">Fast Jobs</p>
                      <p className="mt-3 text-xl font-semibold text-white">Premium hiring for events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickTiles.map((tile) => (
              <Link
                key={tile.title}
                to={tile.to}
                className="rounded-3xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/20"
              >
                <div className="text-3xl mb-2">{tile.icon}</div>
                <div>{tile.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-100 text-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-4xl font-bold">Featured Events</h2>
              <p className="text-slate-600 mt-2">Discover the most exciting experiences happening soon.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 shadow-lg shadow-orange-200/20">
              <span className="text-orange-500 font-bold">{events.length}</span>
              <span className="text-slate-300">events featured</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-slate-500">Loading events...</div>
            ) : (
              events.map((event) => (
                <Link key={event._id} to={`/events/${event._id}`}>
                  <div className="group overflow-hidden rounded-[2rem] bg-black text-white shadow-2xl shadow-orange-500/20 transition hover:-translate-y-1 hover:shadow-orange-400/30">
                    <div className="relative h-48 bg-gradient-to-br from-orange-500 via-yellow-400 to-white/10 flex items-center justify-center text-white text-5xl font-bold">
                      {event.category.charAt(0).toUpperCase()}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_40%)]" />
                    </div>
                    <div className="p-6">
                      <span className="inline-flex rounded-full bg-orange-100 text-orange-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">{event.category}</span>
                      <h3 className="mt-4 text-2xl font-bold">{event.title}</h3>
                      <p className="mt-3 text-slate-300 line-clamp-3">{event.description.substring(0, 80)}...</p>
                      <div className="mt-6 flex items-center justify-between gap-3 text-slate-300">
                        <span className="font-semibold">${event.price}</span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-sm">{event.location.city}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-bold">Powerful features</p>
          <h2 className="mt-4 text-4xl font-bold">Everything your community needs in one explosive hub</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Events', icon: '🎉', desc: 'Launch memorable celebrations with premium vendors.' },
            { title: 'Catering', icon: '🍽️', desc: 'Choose top catering services for every budget.' },
            { title: 'Jobs', icon: '💼', desc: 'Find event roles that pay well and feel exciting.' },
            { title: 'News', icon: '📰', desc: 'Stay in the loop with the freshest industry updates.' },
          ].map((service, idx) => (
            <div key={idx} className="rounded-[2rem] border border-orange-500/10 bg-white/5 p-8 shadow-2xl shadow-orange-500/10 transition hover:-translate-y-1">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-slate-300">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-black via-slate-900 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">💥</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Become a Partner?</h2>
          <p className="text-xl text-white/90 mb-4">
            Unlock new revenue streams and reach thousands of event organizers and businesses on EventHub.
          </p>
          <p className="text-lg text-white/80 mb-10">
            Choose from multiple partnership opportunities in catering, decoration, photography, venue management, event organization, and more.
          </p>
          <Link
            to="/role-selection"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-xl font-bold text-slate-950 shadow-2xl shadow-orange-900/30 hover:scale-105 transition"
          >
            Start Your Partnership Journey →
          </Link>
          <p className="text-white/80 text-sm mt-6">
            ✓ Free to apply • ✓ Quick approval • ✓ Instant dashboard access • ✓ 24-48 hour review
          </p>
        </div>
      </section>
    </div>
  );
}
