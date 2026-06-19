import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService } from '../services/api';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    newsService.getById(id)
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load news');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;
  if (!news) return <div className="text-center py-12">News not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/news')} className="text-red-600 hover:text-red-800 mb-6 font-semibold">
          ← Back to News
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 h-80 flex items-center justify-center">
            <span className="text-white text-8xl">📰</span>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">{news.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="capitalize bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {news.category}
                  </span>
                  <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                  <span>👁️ {news.views} views</span>
                </div>
              </div>
              {news.featured && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-bold">
                  ⭐ Featured
                </div>
              )}
            </div>

            {news.author && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                <p className="text-gray-700">
                  <strong>By:</strong> {news.author.name}
                </p>
              </div>
            )}

            <div className="mb-8">
              <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </article>
            </div>

            {news.tags && news.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <p className="text-gray-700 font-semibold mb-3">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map(tag => (
                    <span key={tag} className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-6 bg-red-50 rounded-lg">
              <p className="text-gray-600">
                <strong>Article ID:</strong> {news._id}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Last Updated:</strong> {new Date(news.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
