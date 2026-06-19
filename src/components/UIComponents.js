import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin">
      <div className="text-4xl">⏳</div>
    </div>
    <p className="text-gray-600 ml-4">Loading...</p>
  </div>
);

export const EmptyState = ({ message, icon = '📭' }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">{icon}</div>
    <p className="text-gray-600 text-lg">{message}</p>
  </div>
);

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
    <p className="text-red-800 font-semibold mb-4">❌ {message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Try Again
      </button>
    )}
  </div>
);
