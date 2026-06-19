import React from 'react';
import { getEmoji } from '../utils/helpers';

export default function EventCard({ event, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-2xl transition hover:-translate-y-1 hover:shadow-purple-300/40"
    >
      <div className="relative h-44 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_40%)]" />
        {getEmoji(event.category)}
      </div>
      <div className="p-6">
        <span className="inline-flex rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">{event.category}</span>
        <h3 className="mt-4 text-2xl font-bold text-slate-900 line-clamp-2">{event.title}</h3>
        <p className="mt-3 text-slate-600 text-sm line-clamp-2">{event.description}</p>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-purple-700 font-semibold">${event.price}</span>
        </div>
        <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
          <span>{event.registrations}/{event.capacity} registered</span>
          <span>{event.location.city}</span>
        </div>
      </div>
    </div>
  );
}
