import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../services/api';

export default function News() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService.getAll().then(res => {
      setNews(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = category ? news.filter(n => n.category === category) : news;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-100 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-orange-500 to-pink-500 p-10 shadow-2xl shadow-orange-300/30 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-orange-100/90">Hot stories</p>
          <h1 className="mt-6 text-5xl font-extrabold">Stay ahead with the latest event news</h1>
          <p className="mt-4 max-w-2xl text-lg text-orange-100/90">Current trends, announcements, and stories from the world of events, vendors, and lifestyles.</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {['', 'events', 'business', 'entertainment', 'lifestyle'].map(cat => {
            const selected = category === cat;
            return (
              <button
                key={cat || 'all'}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selected ? 'bg-orange-500 text-white shadow-lg shadow-orange-300/30' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                {cat ? cat : 'All'}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full rounded-[2rem] bg-white p-12 text-center shadow-xl">Loading each update...</div>
          ) : (
            filtered.map(article => (
              <Link key={article._id} to={`/news/${article._id}`}>
                <div className="group overflow-hidden rounded-[2rem] bg-white shadow-2xl transition hover:-translate-y-1 hover:shadow-orange-300/40">
                  <div className="relative h-44 bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 flex items-center justify-center text-white text-5xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_40%)]" />
                    📰
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900">{article.title}</h3>
                    <p className="mt-3 text-slate-600 line-clamp-4">{article.content.substring(0, 100)}...</p>
                    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-2">👁️ {article.views}</span>
                    </div>
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
