import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';

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
    <div className="overflow-hidden">
      <section className="relative min-h-screen bg-gradient-to-br from-purple-800 via-fuchsia-700 to-pink-500 text-white overflow-hidden">
        <div className="absolute -left-24 top-24 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute right-0 top-32 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/90 shadow-lg shadow-black/20">
                Unlock the biggest events & services
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">Experience events that feel electric, creative, and unforgettable.</h1>
              <p className="max-w-2xl text-lg text-slate-100/90">EventHub brings together stunning events, premium vendors, fast job opportunities, and trending news in one memorable platform.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/events" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-lg font-bold text-purple-700 shadow-xl shadow-purple-500/20 hover:scale-[1.01] transition">
                  Explore Events
                </Link>
                <Link to="/businesses" className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-8 py-3 text-lg font-semibold text-white hover:bg-white/20 transition">
                  Find Services
                </Link>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-4">Spotlight Events</h2>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-purple-950/80 p-6 text-white shadow-xl shadow-violet-500/20">
                    <p className="text-sm uppercase tracking-[0.24em] text-violet-200">Magic of Moments</p>
                    <h3 className="text-3xl font-bold mt-3">Create the event people remember.</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-white/10 p-5 text-white shadow-lg shadow-violet-500/10">
                      <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Top Vendors</p>
                      <p className="mt-3 text-xl font-semibold">Catering, decor & artists</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 p-5 text-white shadow-lg shadow-violet-500/10">
                      <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Fast Jobs</p>
                      <p className="mt-3 text-xl font-semibold">Premium hiring for events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Featured Events</h2>
              <p className="text-slate-600 mt-2">Discover the most exciting experiences happening soon.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-lg shadow-slate-200/80">
              <span className="text-purple-600 font-bold">{events.length}</span>
              <span className="text-slate-600">events featured</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-slate-500">Loading events...</div>
            ) : (
              events.map(event => (
                <Link key={event._id} to={`/events/${event._id}`}>
                  <div className="group overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200 transition hover:-translate-y-1 hover:shadow-purple-300/40">
                    <div className="relative h-48 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
                      {event.category.charAt(0).toUpperCase()}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_40%)]" />
                    </div>
                    <div className="p-6">
                      <span className="inline-flex rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">{event.category}</span>
                      <h3 className="mt-4 text-2xl font-bold text-slate-900">{event.title}</h3>
                      <p className="mt-3 text-slate-600 line-clamp-3">{event.description.substring(0, 80)}...</p>
                      <div className="mt-6 flex items-center justify-between gap-3 text-slate-700">
                        <span className="font-semibold">${event.price}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{event.location.city}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-white via-fuchsia-50 to-cyan-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-500 font-bold">Powerful features</p>
          <h2 className="mt-4 text-4xl font-bold text-slate-900">Everything your community needs in one creative hub</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Events', icon: '🎉', desc: 'Launch memorable celebrations with premium vendors.' },
            { title: 'Catering', icon: '🍽️', desc: 'Choose top catering services for every budget.' },
            { title: 'Jobs', icon: '💼', desc: 'Find event roles that pay well and feel exciting.' },
            { title: 'News', icon: '📰', desc: 'Stay in the loop with the freshest industry updates.' }
          ].map((service, idx) => (
            <div key={idx} className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-2xl shadow-slate-200 backdrop-blur-xl transition hover:-translate-y-1">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{service.title}</h3>
              <p className="text-slate-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
